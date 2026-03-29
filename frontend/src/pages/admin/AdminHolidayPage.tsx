import { useState, useEffect } from 'react';
import { CalendarOff, Plus, Trash2, Calendar as CalendarIcon, AlertCircle, Clock, CalendarRange, Repeat } from 'lucide-react'; // 🌟 Import Repeat เพิ่มเข้ามา
import api from '../../api/axios'; 
import Navbar from '../../components/Navbar';

interface Holiday {
  id: string; 
  startDate: string; 
  endDate: string; 
  isAllDay: boolean;
  startTime?: string;
  endTime?: string;
  reason?: string;
  isRecurring?: boolean; // 🌟 1. เพิ่มฟิลด์ isRecurring เข้ามาใน Type
}

export default function AdminHolidayPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  
  // State สำหรับฟอร์มใหม่
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isAllDay, setIsAllDay] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [isRecurring, setIsRecurring] = useState(false); // 🌟 2. เพิ่ม State เก็บค่าการทำซ้ำ
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const getTodayLocalString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchHolidays = async () => {
    try {
      const response = await api.get('/admin/holidays'); 
      setHolidays(response.data);
    } catch (err) {
      console.error('Error fetching holidays:', err);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Validation พื้นฐาน
    if (!startDate) {
      setError('กรุณาเลือกวันที่เริ่มต้นครับ');
      return;
    }
    if (!isAllDay && (!startTime || !endTime)) {
      setError('กรุณาระบุเวลาเริ่มต้นและเวลาสิ้นสุดด้วยครับ');
      return;
    }
    if (new Date(endDate || startDate) < new Date(startDate)) {
      setError('วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มต้นครับ');
      return;
    }

    setIsLoading(true);
    try {
      // 🌟 3. ส่ง isRecurring ไปหา Backend ด้วย
      await api.post('/admin/holidays', { 
        startDate, 
        endDate: endDate || startDate, 
        isAllDay,
        startTime: isAllDay ? null : startTime,
        endTime: isAllDay ? null : endTime,
        reason,
        isRecurring
      });

      setSuccessMsg('บันทึกวันหยุดเรียบร้อยแล้ว!');
      // เคลียร์ฟอร์ม
      setStartDate('');
      setEndDate('');
      setIsAllDay(true);
      setStartTime('');
      setEndTime('');
      setReason('');
      setIsRecurring(false); // 🌟 เคลียร์ค่าคืนกลับเป็น false
      
      fetchHolidays(); 
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกวันหยุด');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHoliday = async (id: string) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบวันหยุดนี้?')) return;
    try {
      await api.delete(`/admin/holidays/${id}`);
      fetchHolidays(); 
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบวันหยุด');
    }
  };

  const formatHolidayDisplay = (holiday: Holiday) => {
    const formatD = (d: string) => new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    
    let dateStr = formatD(holiday.startDate);
    if (holiday.startDate !== holiday.endDate) {
      dateStr += ` - ${formatD(holiday.endDate)}`;
    }

    let timeStr = holiday.isAllDay ? 'ตลอดวัน' : `${holiday.startTime} น. - ${holiday.endTime} น.`;

    return { dateStr, timeStr };
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 font-sans">
        <div className="max-w-5xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1A4F90] flex items-center gap-2">
              <CalendarRange size={28} />
              จัดการวันหยุด / ปิดรับคิว
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              กำหนดวันหยุดพักผ่อน หรือปิดรับคิวบางช่วงเวลา เพื่อไม่ให้ลูกค้ากดจองเข้ามาได้
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* ฝั่งซ้าย: ฟอร์ม */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Plus size={18} className="text-[#1A4F90]" /> เพิ่มช่วงเวลาหยุด
                </h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2 border border-red-100">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100">
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleAddHoliday} className="space-y-5">
                  
                  {/* แถวที่ 1: วันที่เริ่ม - สิ้นสุด */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่ม <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        value={startDate}
                        min={getTodayLocalString()}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#1A4F90] outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ถึงวันที่ (ตัวเลือก)</label>
                      <input
                        type="date"
                        value={endDate}
                        min={startDate || getTodayLocalString()}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#1A4F90] outline-none"
                      />
                    </div>
                  </div>

                  {/* 🌟 4. เพิ่ม Checkbox สำหรับเลือกว่าจะทำซ้ำทุกปีหรือไม่ */}
                  <div className="border border-blue-100 rounded-xl p-3 bg-blue-50/30">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="rounded text-[#1A4F90] focus:ring-[#1A4F90] w-4 h-4"
                      />
                      <span className="text-sm font-bold text-[#1A4F90] flex items-center gap-1.5">
                        <Repeat size={14} /> ทำซ้ำทุกปี (เทศกาลประจำปี)
                      </span>
                    </label>
                  </div>

                  {/* แถวที่ 2: ตั้งค่าเวลา */}
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                    <label className="flex items-center gap-2 cursor-pointer mb-3">
                      <input 
                        type="checkbox" 
                        checked={isAllDay}
                        onChange={(e) => setIsAllDay(e.target.checked)}
                        className="rounded text-[#1A4F90] focus:ring-[#1A4F90] w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700">หยุดตลอดทั้งวัน</span>
                    </label>

                    {!isAllDay && (
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock size={12}/> ตั้งแต่เวลา</label>
                          <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#1A4F90] outline-none"
                            required={!isAllDay}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1 items-center gap-1"><Clock size={12}/> ถึงเวลา</label>
                          <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#1A4F90] outline-none"
                            required={!isAllDay}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* แถวที่ 3: หมายเหตุ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="เช่น เอารถเข้าศูนย์, ไปทำธุระ"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1A4F90] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1A4F90] hover:bg-blue-800 text-white font-medium py-2.5 rounded-xl transition-colors disabled:bg-gray-400"
                  >
                    {isLoading ? 'กำลังบันทึก...' : 'บันทึกวันหยุด'}
                  </button>
                </form>
              </div>
            </div>

            {/* ฝั่งขวา: รายการ */}
            <div className="lg:col-span-7">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CalendarIcon size={18} className="text-[#1A4F90]" /> รายการวันหยุดที่ตั้งไว้
                </h2>

                {holidays.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <CalendarOff size={40} className="mx-auto mb-3 opacity-50" />
                    <p>ยังไม่มีการตั้งวันหยุดครับ</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {holidays.map((holiday) => {
                      const { dateStr, timeStr } = formatHolidayDisplay(holiday);
                      return (
                        <div 
                          key={holiday.id} 
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all bg-gray-50/50 gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-red-600 text-base">{dateStr}</span>
                              <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-md font-medium">
                                {timeStr}
                              </span>
                              
                              {/* 🌟 5. แสดงป้ายกำกับว่า "ทำซ้ำทุกปี" ถ้ารายการนั้นตั้งค่าไว้ */}
                              {holiday.isRecurring && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">
                                  <Repeat size={12} /> ทำซ้ำทุกปี
                                </span>
                              )}

                            </div>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                              {holiday.reason ? `หมายเหตุ: ${holiday.reason}` : 'ไม่มีหมายเหตุ'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteHoliday(holiday.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                            title="ลบวันหยุดนี้"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}