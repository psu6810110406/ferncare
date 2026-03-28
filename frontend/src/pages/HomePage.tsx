import { 
  Car, User, Pill, FileText, CalendarCheck, 
  Clock, Calendar as CalendarIcon, ShieldCheck, Heart, PhoneCall, ChevronRight, ChevronDown 
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Import รูปภาพ
import Navbar from '../components/Navbar';
import banner from '../assets/banner.jpg'; 

export default function HomePage() {
  const [timeSlot, setTimeSlot] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false); 
  
  const navigate = useNavigate();

  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return 'เลือกวันที่ (วว/ดด/ปปปป)';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`; 
  };

  const handleSearch = async () => {
    setError('');
    setIsAvailable(false);

    if (!date || !timeSlot) {
      setError('กรุณาเลือกวันที่และช่วงเวลาก่อนครับ');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get(`/bookings/check-availability`, {
        params: { date, timeSlot }
      });

      if (response.data.isAvailable) {
        setIsAvailable(true); 
      } else {
        setError('คิวสำหรับช่วงเวลานี้เต็มแล้วครับ กรุณาเลือกเวลาอื่น');
      }
    } catch (err) {
      console.error('Check availability error:', err);
      setIsAvailable(true); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDetails = () => {
    const token = localStorage.getItem('token'); 
    if (!token) {
      navigate('/login', { 
        state: { 
          redirectTo: '/booking-details', 
          bookingData: { selectedDate: date, selectedTimeSlot: timeSlot }
        } 
      });
      return;
    }
    navigate('/booking-details', { 
      state: { selectedDate: date, selectedTimeSlot: timeSlot } 
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>, type: 'date' | 'time') => {
    if (type === 'date') setDate(e.target.value);
    if (type === 'time') setTimeSlot(e.target.value);
    setError('');
    setIsAvailable(false); 
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans pb-6">
      <Navbar />

      <div className="max-w-md mx-auto relative">
        
        {/* Hero Section */}
        <div className="relative w-full h-64 bg-gray-900 overflow-hidden shadow-md">
          <img src={banner} alt="Ferncare Banner" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-linear-to-t from-[#1A4F90]/90 via-[#1A4F90]/40 to-transparent"></div>
          
          <div className="absolute bottom-6 left-5 right-5 text-white">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-medium mb-3 border border-white/30">
              <Heart size={12} className="text-pink-300 fill-pink-300" /> ดูแลดุจญาติมิตร
            </div>
            <h2 className="text-2xl font-bold leading-tight mb-1 drop-shadow-md">
              บริการพาผู้ป่วยไปหาหมอ
            </h2>
            <p className="text-sm text-blue-100 drop-shadow-sm font-light">
              สะดวก ปลอดภัย จบครบในที่เดียว ไปรับ-รอตรวจ-รับยา-ไปส่ง
            </p>
          </div>
        </div>

        {/* กล่องเลือกวันและเวลา */}
        <div className="px-5 mt-6 relative z-10">
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-blue-900/5 border border-white">
            <h3 className="text-[#1A4F90] font-bold text-base mb-4 flex items-center gap-2">
              <CalendarCheck size={18} /> จองคิวใช้บริการ
            </h3>
            
            {error && (
              <div className="text-red-500 text-xs mb-4 bg-red-50 py-2 px-3 rounded-lg border border-red-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>{error}
              </div>
            )}
            
            {isAvailable && (
               <div className="text-green-700 text-xs mb-4 bg-green-50 py-2 px-3 rounded-lg font-medium border border-green-200 flex items-center gap-2">
                 <ShieldCheck size={16} className="text-green-600"/> คิวว่าง! ดำเนินการต่อได้เลย
             </div>
            )}

            <div className="flex flex-col gap-3 mb-5">
              
              {/* 🌟 1. ช่องเลือกวันที่ 🌟 */}
              <div className="relative group">
                {/* ดัน z-index ขึ้นมาเป็น 30 เพื่อให้ไอคอนลอยอยู่หน้าสุดเสมอ */}
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-30 transition-colors ${date ? 'text-[#1A4F90]' : 'text-gray-400 group-hover:text-[#1A4F90]'}`}>
                  <CalendarIcon size={18} />
                </div>
                
                {/* ลดความหนาเหลือ font-medium */}
                <div className={`w-full border rounded-xl py-3 pl-10 pr-3 text-sm flex items-center transition-all focus-within:ring-2 focus-within:ring-[#1A4F90]/50 focus-within:border-[#1A4F90] ${date ? 'border-[#1A4F90]/30 text-gray-900 font-medium bg-white shadow-sm' : 'border-gray-200 text-gray-500 bg-gray-50'}`}>
                  {formatShortDate(date)}
                </div>

                <input 
                  type="date" 
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleInputChange(e, 'date')}
                  onClick={(e) => {
                    try { e.currentTarget.showPicker(); } catch (err) {}
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
              </div>

              {/* 🌟 2. ช่องเลือกเวลา 🌟 */}
              <div className="relative group">
                {/* ดัน z-index ขึ้นมาเป็น 30 เหมือนกัน */}
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-30 transition-colors ${timeSlot ? 'text-[#1A4F90]' : 'text-gray-400 group-hover:text-[#1A4F90]'}`}>
                  <Clock size={18} />
                </div>
                
                {/* ลดความหนาเหลือ font-medium */}
                <select 
                  value={timeSlot}
                  onChange={(e) => handleInputChange(e, 'time')}
                  className={`w-full border rounded-xl py-3 pl-10 pr-10 text-sm outline-none transition-all cursor-pointer relative z-20 appearance-none focus:ring-2 focus:ring-[#1A4F90]/50 focus:border-[#1A4F90] ${timeSlot ? 'border-[#1A4F90]/30 text-gray-900 font-medium bg-white shadow-sm' : 'border-gray-200 text-gray-500 bg-gray-50'}`}
                >
                  <option value="" disabled>เลือกช่วงเวลาที่ต้องการ</option>
                  <option value="morning">ช่วงเช้า (08:00 - 12:00)</option>
                  <option value="afternoon">ช่วงบ่าย (13:00 - 17:00)</option>
                  <option value="fullday">เต็มวัน (08:00 - 17:00)</option>
                </select>
                
                {/* ไอคอนลูกศรชี้ลง ดันเป็น z-30 */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 z-30">
                  <ChevronDown size={18} />
                </div>
              </div>

            </div>
            
            {/* ปุ่มกด */}
            {!isAvailable ? (
              <button onClick={handleSearch} disabled={isLoading} className="w-full bg-linear-to-r from-[#1A4F90] to-[#2563EB] text-white px-6 py-3.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-70 disabled:hover:shadow-none flex justify-center items-center gap-2">
                {isLoading ? <span className="animate-pulse">กำลังตรวจสอบคิว...</span> : 'ค้นหาคิวว่าง'}
              </button>
            ) : (
              <button onClick={handleGoToDetails} className="w-full bg-linear-to-r from-green-500 to-emerald-600 text-white px-6 py-3.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all flex justify-center items-center gap-2">
                กรอกรายละเอียดการจอง <ChevronRight size={18} />
              </button>
            )}
          </div>

          {/* หมวดหมู่ "บริการของเรา" */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#1A4F90] font-bold text-lg">บริการของเรา</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-blue-200 transition-colors">
                <div className="bg-blue-50 p-2.5 rounded-xl mb-3 text-[#1A4F90]"><Car size={22} /></div>
                <span className="text-sm font-bold text-gray-800 mb-1">รับ-ส่งถึงบ้าน</span>
                <span className="text-[10px] text-gray-500 leading-tight">บริการรถรับส่งถึงหน้าบ้านอย่างปลอดภัย</span>
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-blue-200 transition-colors">
                <div className="bg-blue-50 p-2.5 rounded-xl mb-3 text-[#1A4F90]"><User size={22} /></div>
                <span className="text-sm font-bold text-gray-800 mb-1">ดูแลทุกขั้นตอน</span>
                <span className="text-[10px] text-gray-500 leading-tight">มีผู้ดูแลคอยประกบ ตั้งแต่เริ่มจนกลับถึงบ้าน</span>
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-blue-200 transition-colors">
                <div className="bg-blue-50 p-2.5 rounded-xl mb-3 text-[#1A4F90]"><Pill size={22} /></div>
                <span className="text-sm font-bold text-gray-800 mb-1">รับยาและเอกสาร</span>
                <span className="text-[10px] text-gray-500 leading-tight">จัดการเรื่องรอรับยา ชำระเงิน แทนญาติ</span>
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:border-blue-200 transition-colors">
                <div className="bg-blue-50 p-2.5 rounded-xl mb-3 text-[#1A4F90]"><FileText size={22} /></div>
                <span className="text-sm font-bold text-gray-800 mb-1">รายงานอาการ</span>
                <span className="text-[10px] text-gray-500 leading-tight">สรุปคำแนะนำจากแพทย์ให้ญาติทราบ</span>
              </div>
            </div>
          </div>

          {/* ขั้นตอนการใช้บริการ (How it works) */}
          <div className="mt-8 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-[#1A4F90] font-bold text-base mb-4">ขั้นตอนการใช้บริการ</h3>
            <div className="flex justify-between relative">
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-100 -z-10"></div>
              
              <div className="flex flex-col items-center gap-2 bg-white px-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1A4F90] font-bold flex items-center justify-center text-sm shadow-sm">1</div>
                <span className="text-[10px] text-gray-600">จองคิว</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white px-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1A4F90] font-bold flex items-center justify-center text-sm shadow-sm">2</div>
                <span className="text-[10px] text-gray-600">รอรับที่บ้าน</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white px-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1A4F90] font-bold flex items-center justify-center text-sm shadow-sm">3</div>
                <span className="text-[10px] text-gray-600">พบแพทย์</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white px-2">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold flex items-center justify-center text-sm shadow-sm">4</div>
                <span className="text-[10px] text-gray-600">ส่งกลับบ้าน</span>
              </div>
            </div>
          </div>

          {/* Footer สำหรับติดต่อฉุกเฉิน */}
          <div className="mt-8 mb-4 bg-blue-50 p-4 rounded-2xl flex items-center justify-between border border-blue-100">
            <div>
              <p className="text-xs font-bold text-[#1A4F90]">ต้องการความช่วยเหลือ?</p>
              <p className="text-[10px] text-gray-500 mt-0.5">ติดต่อสายด่วน สอบถามคิวฉุกเฉิน</p>
            </div>
            <button className="bg-white p-2.5 rounded-full shadow-sm text-[#1A4F90] hover:bg-blue-100 transition-colors">
              <PhoneCall size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}