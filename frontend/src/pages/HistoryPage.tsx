import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, MapPin, User, Activity, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import api from '../api/axios';

// นำเข้า Navbar ที่เราทำไว้
import Navbar from '../components/Navbar';

// กำหนดหน้าตาของข้อมูลการจอง
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
  const [error] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    // เช็คก่อนว่าล็อกอินหรือยัง ถ้ายังให้เด้งไปหน้า Login
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchHistory();
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      // พยายามดึงข้อมูลจาก Backend (เดี๋ยวเราต้องไปสร้าง API เส้นนี้ใน NestJS)
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      // ---- สำคัญ: โค้ดชั่วคราวสำหรับ Dev ----
      // ถ้า Backend ยังไม่เสร็จ ให้แสดงข้อมูลจำลองไปก่อน เพื่อให้เห็น UI
      setBookings([
        { id: 1, date: '2026-03-30', timeSlot: 'morning', hospitalName: 'โรงพยาบาลศิริราช', patientName: 'สมหมาย ใจดี', status: 'pending' },
        { id: 2, date: '2026-03-25', timeSlot: 'fullday', hospitalName: 'โรงพยาบาลรามาธิบดี', patientName: 'สมศรี ใจดี', status: 'confirmed' },
        { id: 3, date: '2026-02-14', timeSlot: 'afternoon', hospitalName: 'คลินิกแพทย์สมชาย', patientName: 'สมหมาย ใจดี', status: 'completed' },
      ]);
      // เอาคอมเมนต์ด้านล่างออกเมื่อ Backend เสร็จแล้ว
      // setError('ไม่สามารถโหลดประวัติการใช้งานได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันช่วยแปลภาษาช่วงเวลา
  const getTimeSlotLabel = (slot: string) => {
    switch (slot) {
      case 'morning': return 'ช่วงเช้า (08:00 - 12:00)';
      case 'afternoon': return 'ช่วงบ่าย (13:00 - 17:00)';
      case 'fullday': return 'เต็มวัน (08:00 - 17:00)';
      default: return slot;
    }
  };

  // ฟังก์ชันช่วยจัดการสีและข้อความของสถานะ (Status Badge)
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold"><Clock size={12}/> รอยืนยัน</span>;
      case 'confirmed':
        return <span className="flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-full text-[10px] font-bold"><Activity size={12}/> กำลังดำเนินการ</span>;
      case 'completed':
        return <span className="flex items-center gap-1 bg-green-50 text-green-600 border border-green-200 px-2.5 py-1 rounded-full text-[10px] font-bold"><CheckCircle size={12}/> เสร็จสิ้น</span>;
      case 'cancelled':
        return <span className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full text-[10px] font-bold"><AlertCircle size={12}/> ยกเลิกแล้ว</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-[10px] font-bold">{status}</span>;
    }
  };

  // ฟังก์ชันแปลงรูปแบบวันที่
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans pb-10">
      
      {/* เรียกใช้ Navbar แยกส่วน */}
      <Navbar />

      <div className="max-w-md mx-auto px-5 mt-6">
        <h1 className="text-xl font-bold text-[#1A4F90] mb-6 flex items-center gap-2">
          <CalendarClock size={24} /> ประวัติการใช้บริการ
        </h1>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-4 border border-red-100">
            {error}
          </div>
        )}

        {isLoading ? (
          // หน้าตาตอนกำลังโหลด (Loading State)
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-[#1A4F90] rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500">กำลังโหลดประวัติ...</p>
          </div>
        ) : bookings.length === 0 ? (
          // หน้าตาตอนไม่มีประวัติการจอง (Empty State)
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
          // วนลูปแสดง Card ประวัติการจอง
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                
                {/* ส่วนหัว: วันที่ และ สถานะ */}
                <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
                  <div>
                    <p className="text-[#1A4F90] font-bold text-sm">{formatDate(booking.date)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{getTimeSlotLabel(booking.timeSlot)}</p>
                  </div>
                  <div>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                {/* ส่วนรายละเอียด */}
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

                {/* ปุ่มดูรายละเอียดเพิ่มเติม (เผื่อทำหน้าย่อยในอนาคต) */}
                <div className="mt-4 pt-3 border-t border-gray-50 flex justify-end">
                  <button className="text-[11px] font-bold text-[#1A4F90] hover:text-blue-700 transition-colors flex items-center gap-1">
                    ดูรายละเอียด <ChevronRight size={14} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}