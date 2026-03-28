import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, MapPin, User, Activity, Clock, CheckCircle, AlertCircle, ChevronRight, Trash2, X } from 'lucide-react'; 
import api from '../api/axios';

// นำเข้า Navbar ที่เราทำไว้
import Navbar from '../components/Navbar';

interface Booking {
  id: number;
  date: string;
  timeSlot: string;
  hospitalName: string;
  patientName: string;
  status: string;
}

export default function HistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(''); 
  
  // --- State สำหรับควบคุม Modal ยืนยันการลบ ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // เอาไว้ทำปุ่มโหลดตอนกำลังลบ
  // ----------------------------------------
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchHistory();
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data); 
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError('ไม่สามารถโหลดประวัติการใช้งานได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  // 1. ฟังก์ชันเปิดกล่อง Modal (รับ id ของคิวที่ถูกคลิก)
  const handleDeleteClick = (bookingId: number) => {
    setBookingToDelete(bookingId);
    setIsModalOpen(true);
  };

  // 2. ฟังก์ชันกดยืนยันลบใน Modal 
  const confirmDelete = async () => {
    if (bookingToDelete === null) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      
      await api.delete(`/bookings/${bookingToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // อัปเดต state ลบออกและปิดกล่อง
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingToDelete));
      setIsModalOpen(false);
      setBookingToDelete(null);
      
    } catch (err) {
      console.error('Failed to delete booking:', err);
      alert('ไม่สามารถลบรายการจองได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsDeleting(false);
    }
  };

  // 3. ฟังก์ชันยกเลิกการลบ (ปิดกล่องเฉยๆ)
  const cancelDelete = () => {
    setIsModalOpen(false);
    setBookingToDelete(null);
  };

  const getTimeSlotLabel = (slot: string) => {
    switch (slot) {
      case 'morning': return 'ช่วงเช้า (08:00 - 12:00)';
      case 'afternoon': return 'ช่วงบ่าย (13:00 - 17:00)';
      case 'fullday': return 'เต็มวัน (08:00 - 17:00)';
      default: return slot;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold"><Clock size={12}/> รอยืนยัน</span>;
      case 'confirmed': return <span className="flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-full text-[10px] font-bold"><Activity size={12}/> กำลังดำเนินการ</span>;
      case 'completed': return <span className="flex items-center gap-1 bg-green-50 text-green-600 border border-green-200 px-2.5 py-1 rounded-full text-[10px] font-bold"><CheckCircle size={12}/> เสร็จสิ้น</span>;
      case 'cancelled': return <span className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full text-[10px] font-bold"><AlertCircle size={12}/> ยกเลิกแล้ว</span>;
      default: return <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-[10px] font-bold">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans pb-10">
      <Navbar />

      <div className="max-w-md mx-auto px-5 mt-6">
        <h1 className="text-xl font-bold text-[#1A4F90] mb-6 flex items-center gap-2">
          <CalendarClock size={24} /> ประวัติการใช้บริการ
        </h1>

        {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-4 border border-red-100">{error}</div>}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-[#1A4F90] rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500">กำลังโหลดประวัติ...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 mt-10">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarClock size={32} className="text-[#1A4F90]/50" />
            </div>
            <h3 className="text-[#1A4F90] font-bold mb-2">ยังไม่มีประวัติการจอง</h3>
            <p className="text-xs text-gray-500 mb-6">คุณยังไม่เคยทำรายการจองบริการพาผู้ป่วยไปหาหมอเลย</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-[#1A4F90] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#153f72] transition-colors shadow-md"
            >
              จองคิวใหม่ตอนนี้
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                
                <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
                  <div>
                    <p className="text-[#1A4F90] font-bold text-sm">{formatDate(booking.date)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{getTimeSlotLabel(booking.timeSlot)}</p>
                  </div>
                  <div>{getStatusBadge(booking.status)}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={16} className="text-[#1A4F90] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-500 font-medium">สถานที่</p>
                      <p className="text-xs text-gray-800 font-bold">{booking.hospitalName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2.5">
                    <User size={16} className="text-[#1A4F90] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-500 font-medium">ผู้เข้ารับบริการ</p>
                      <p className="text-xs text-gray-800 font-bold">{booking.patientName}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                  <button 
                    onClick={() => handleDeleteClick(booking.id)} // เปลี่ยนมาเรียกฟังก์ชันเปิดกล่อง
                    className="text-[11px] font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={14} /> ลบรายการ
                  </button>
                  <button className="text-[11px] font-bold text-[#1A4F90] hover:text-blue-700 transition-colors flex items-center gap-1">
                    ดูรายละเอียด <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- ส่วนของ Modal ยืนยันการลบ --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-[320px] shadow-2xl relative">
            <button 
              onClick={cancelDelete}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 mt-2">
              <Trash2 className="text-red-500" size={28} />
            </div>
            
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">ยืนยันการลบรายการ</h3>
            <p className="text-xs text-center text-gray-500 mb-6 leading-relaxed">
              คุณแน่ใจหรือไม่ว่าต้องการลบรายการจองนี้?<br/>ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors flex justify-center items-center"
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'ลบรายการ'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* -------------------------------- */}

    </div>
  );
}