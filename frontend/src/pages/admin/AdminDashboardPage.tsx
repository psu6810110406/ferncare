import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Clock, MapPin, User, FileText, Filter, Trash2, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

interface Booking {
  id: number;
  date: string;
  timeSlot: string;
  hospitalName: string;
  patientName: string;
  relativePhone: string;
  status: string;
}

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const navigate = useNavigate();

  // 🌟 State สำหรับควบคุมกล่อง Popup ยืนยัน
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: 'confirmed' | 'cancelled' | 'delete' | null;
    bookingId: number | null;
  }>({ isOpen: false, type: null, bookingId: null });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch all bookings', error);
      alert('ไม่สามารถดึงข้อมูลคิวได้ กรุณาตรวจสอบสิทธิ์ Admin');
    } finally {
      setIsLoading(false);
    }
  };

  // 🌟 ฟังก์ชันทำงานเมื่อกดปุ่ม "ตกลง" ในกล่อง Popup
  const handleConfirmAction = async () => {
    if (!actionModal.bookingId || !actionModal.type) return;
    
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const { bookingId, type } = actionModal;

      if (type === 'delete') {
        // กรณีลบทิ้งถาวร
        await api.delete(`/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(prev => prev.filter(b => b.id !== bookingId));
      } else {
        // กรณียืนยัน หรือ ยกเลิก
        await api.patch(`/bookings/${bookingId}`, { status: type }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: type } : b));
      }
    } catch (error) {
      console.error('Action failed', error);
      alert('เกิดข้อผิดพลาดในการดำเนินการ');
    } finally {
      setIsProcessing(false);
      setActionModal({ isOpen: false, type: null, bookingId: null }); // ปิด Popup
    }
  };

  // ฟังก์ชันช่วยดึงหน้าตาของ Popup ตามประเภทการกระทำ
  const getModalConfig = () => {
    switch (actionModal.type) {
      case 'confirmed':
        return { icon: <Check size={32} className="text-green-500"/>, bg: 'bg-green-50', title: 'ยืนยันคิว', desc: 'คุณแน่ใจหรือไม่ที่จะ "ยืนยัน" คิวนี้?', btnBg: 'bg-green-600 hover:bg-green-700' };
      case 'cancelled':
        return { icon: <X size={32} className="text-red-500"/>, bg: 'bg-red-50', title: 'ยกเลิกคิว', desc: 'คุณแน่ใจหรือไม่ที่จะเปลี่ยนสถานะเป็น "ยกเลิก" ?', btnBg: 'bg-red-500 hover:bg-red-600' };
      case 'delete':
        return { icon: <AlertTriangle size={32} className="text-red-500"/>, bg: 'bg-red-50', title: 'ลบคิวถาวร', desc: 'คำเตือน: คุณแน่ใจหรือไม่ที่จะลบคิวนี้? ข้อมูลจะถูกลบทิ้งอย่างถาวร', btnBg: 'bg-red-600 hover:bg-red-700' };
      default:
        return { icon: null, bg: '', title: '', desc: '', btnBg: '' };
    }
  };

  const filteredBookings = bookings.filter(b => statusFilter === 'all' ? true : b.status === statusFilter);
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">กำลังโหลดระบบจัดการ...</div>;
  }

  const modalConfig = getModalConfig();

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10 relative">
      <Navbar />

      {/* 🌟 กล่อง Popup Layout (Modal) 🌟 */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center animate-in zoom-in duration-200">
            <div className={`w-16 h-16 rounded-full ${modalConfig.bg} flex items-center justify-center mb-4`}>
              {modalConfig.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{modalConfig.title}</h3>
            <p className="text-sm text-gray-500 mb-6 px-2">
              {modalConfig.desc} <br/> 
              <span className="font-bold text-gray-800 mt-1 block">คิวหมายเลข: #{actionModal.bookingId}</span>
            </p>
            
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setActionModal({ isOpen: false, type: null, bookingId: null })}
                disabled={isProcessing}
                className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                ปิด / ยกเลิก
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isProcessing}
                className={`flex-1 text-white py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex justify-center items-center ${modalConfig.btnBg}`}
              >
                {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'ตกลง'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-5 mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1A4F90]">ระบบจัดการคิว (Admin)</h1>
            <p className="text-sm text-gray-500 mt-1">จัดการคำขอจองรถพยาบาลทั้งหมด</p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-lg"><Clock size={18} className="text-yellow-600" /></div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold">รอตรวจสอบ</p>
                <p className="text-lg font-black text-gray-800 leading-none">{pendingCount}</p>
              </div>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg"><Check size={18} className="text-green-600" /></div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold">ยืนยันแล้ว</p>
                <p className="text-lg font-black text-gray-800 leading-none">{confirmedCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 w-full sm:w-auto">
              <Filter size={16} className="text-gray-400" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm outline-none text-gray-700 w-full"
              >
                <option value="all">แสดงทั้งหมด</option>
                <option value="pending">รอตรวจสอบ (Pending)</option>
                <option value="confirmed">ยืนยันแล้ว (Confirmed)</option>
                <option value="cancelled">ยกเลิกแล้ว (Cancelled)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 font-bold whitespace-nowrap">ID / วันที่-เวลา</th>
                  <th className="p-4 font-bold whitespace-nowrap">ผู้ป่วย / ติดต่อ</th>
                  <th className="p-4 font-bold whitespace-nowrap">สถานที่</th>
                  <th className="p-4 font-bold text-center whitespace-nowrap">สถานะ</th>
                  <th className="p-4 font-bold text-center whitespace-nowrap">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">ไม่มีข้อมูลคิวในระบบ</td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-4 align-top">
                        <div className="text-xs text-gray-400 mb-1">#{booking.id}</div>
                        <div className="text-sm font-bold text-gray-900 whitespace-nowrap">{booking.date}</div>
                        <div className="text-xs text-[#1A4F90] mt-0.5 bg-blue-50 inline-block px-2 py-0.5 rounded-md font-medium whitespace-nowrap">
                          {booking.timeSlot === 'fullday' ? 'เหมาเต็มวัน' : booking.timeSlot}
                        </div>
                      </td>

                      <td className="p-4 align-top">
                        <div className="flex items-start gap-2">
                          <User size={14} className="text-gray-400 mt-1 shrink-0" />
                          <div>
                            <div className="text-sm font-bold text-gray-800 whitespace-nowrap">{booking.patientName}</div>
                            <div className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">โทร: {booking.relativePhone || '-'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 align-top max-w-50">
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="text-red-400 mt-1 shrink-0" />
                          <div className="text-sm text-gray-700 truncate" title={booking.hospitalName}>
                            {booking.hospitalName || 'ไม่ระบุ'}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 align-top text-center">
                        {booking.status === 'pending' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 whitespace-nowrap"><Clock size={12}/> รอตรวจสอบ</span>}
                        {booking.status === 'confirmed' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 whitespace-nowrap"><Check size={12}/> ยืนยันแล้ว</span>}
                        {booking.status === 'cancelled' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 whitespace-nowrap"><X size={12}/> ยกเลิก</span>}
                      </td>

                      <td className="p-4 align-top text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* 🌟 เรียกใช้ Modal แทน alert 🌟 */}
                          {booking.status === 'pending' && (
                            <button 
                              onClick={() => setActionModal({ isOpen: true, type: 'confirmed', bookingId: booking.id })}
                              className="p-1.5 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-200"
                              title="ยืนยันคิว"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          
                          {booking.status !== 'cancelled' && (
                            <button 
                              onClick={() => setActionModal({ isOpen: true, type: 'cancelled', bookingId: booking.id })}
                              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-orange-200"
                              title="เปลี่ยนเป็นยกเลิก"
                            >
                              <X size={16} />
                            </button>
                          )}

                          <button 
                            onClick={() => navigate(`/history/${booking.id}`)}
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-[#1A4F90] hover:text-white rounded-lg transition-colors border border-blue-200"
                            title="ดูรายละเอียด"
                          >
                            <FileText size={16} />
                          </button>

                          <button 
                            onClick={() => setActionModal({ isOpen: true, type: 'delete', bookingId: booking.id })}
                            className="p-1.5 bg-red-70 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors border border-red-200"
                            title="ลบคิวทิ้งถาวร"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}