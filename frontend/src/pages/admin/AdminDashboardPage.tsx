import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Clock, MapPin, User, FileText, Filter } from 'lucide-react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

// กำหนด Type ของข้อมูลให้ตรงกับ Entity
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
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, confirmed, cancelled

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      // เรียก API ไปที่ GET /bookings ซึ่งเราทำไว้ใน Backend แล้ว
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

  // ฟังก์ชันสำหรับอัปเดตสถานะ (ยืนยัน / ยกเลิก)
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ที่จะเปลี่ยนสถานะคิวนี้เป็น "${newStatus === 'confirmed' ? 'ยืนยัน' : 'ยกเลิก'}" ?`)) return;

    try {
      const token = localStorage.getItem('token');
      await api.patch(`/bookings/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // อัปเดตข้อมูลในหน้าเว็บโดยไม่ต้องรีเฟรชใหม่
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      
    } catch (error) {
      console.error('Failed to update status', error);
      alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
    }
  };

  // ฟิลเตอร์ข้อมูลตามสถานะที่เลือก
  const filteredBookings = bookings.filter(b => statusFilter === 'all' ? true : b.status === statusFilter);

  // คำนวณสถิติ
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">กำลังโหลดระบบจัดการ...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <Navbar />

      <div className="max-w-6xl mx-auto px-5 mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1A4F90]">ระบบจัดการคิว (Admin)</h1>
            <p className="text-sm text-gray-500 mt-1">จัดการคำขอจองรถพยาบาลทั้งหมด</p>
          </div>

          {/* สถิติแบบด่วน */}
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
          {/* แถบเครื่องมือ (Toolbar) */}
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

          {/* ตารางแสดงข้อมูล */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 font-bold">ID / วันที่-เวลา</th>
                  <th className="p-4 font-bold">ผู้ป่วย / ติดต่อ</th>
                  <th className="p-4 font-bold">สถานที่</th>
                  <th className="p-4 font-bold text-center">สถานะ</th>
                  <th className="p-4 font-bold text-center">จัดการ</th>
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
                      {/* คอลัมน์ 1: วันที่เวลา */}
                      <td className="p-4 align-top">
                        <div className="text-xs text-gray-400 mb-1">#{booking.id}</div>
                        <div className="text-sm font-bold text-gray-900">{booking.date}</div>
                        <div className="text-xs text-[#1A4F90] mt-0.5 bg-blue-50 inline-block px-2 py-0.5 rounded-md font-medium">
                          {booking.timeSlot === 'fullday' ? 'เหมาเต็มวัน' : booking.timeSlot}
                        </div>
                      </td>

                      {/* คอลัมน์ 2: ผู้ป่วย */}
                      <td className="p-4 align-top">
                        <div className="flex items-start gap-2">
                          <User size={14} className="text-gray-400 mt-1 shrink-0" />
                          <div>
                            <div className="text-sm font-bold text-gray-800">{booking.patientName}</div>
                            <div className="text-xs text-gray-500 mt-0.5">โทร: {booking.relativePhone || '-'}</div>
                          </div>
                        </div>
                      </td>

                      {/* คอลัมน์ 3: สถานที่ */}
                      <td className="p-4 align-top max-w-50">
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="text-red-400 mt-1 shrink-0" />
                          <div className="text-sm text-gray-700 truncate" title={booking.hospitalName}>
                            {booking.hospitalName || 'ไม่ระบุ'}
                          </div>
                        </div>
                      </td>

                      {/* คอลัมน์ 4: สถานะ */}
                      <td className="p-4 align-top text-center">
                        {booking.status === 'pending' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700"><Clock size={12}/> รอตรวจสอบ</span>}
                        {booking.status === 'confirmed' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700"><Check size={12}/> ยืนยันแล้ว</span>}
                        {booking.status === 'cancelled' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700"><X size={12}/> ยกเลิก</span>}
                      </td>

                      {/* คอลัมน์ 5: ปุ่มจัดการ */}
                      <td className="p-4 align-top text-center">
                        <div className="flex items-center justify-center gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                className="p-1.5 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-200"
                                title="ยืนยันคิว"
                              >
                                <Check size={16} />
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                className="p-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-200"
                                title="ปฏิเสธ/ยกเลิก"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                          
                          {/* ปุ่มดูรายละเอียด - ชี้ไปหน้า Detail เดิมที่เราทำไว้ หรือจะทำหน้า Detail ของ Admin แยกต่างหากก็ได้ */}
                          <button 
                            onClick={() => navigate(`/history/${booking.id}`)}
                            className="p-1.5 bg-gray-50 text-gray-600 hover:bg-[#1A4F90] hover:text-white rounded-lg transition-colors border border-gray-200 ml-2"
                            title="ดูรายละเอียด/แก้ไข"
                          >
                            <FileText size={16} />
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