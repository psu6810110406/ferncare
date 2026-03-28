import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, User, Phone, CalendarClock } from 'lucide-react';

export default function BookingDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // รับค่า วันที่ และ เวลา ที่ส่งมาจากหน้า HomePage
  const { selectedDate, selectedTimeSlot } = location.state || {};

  // สร้าง State สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    pickupAddress: '',
    hospitalName: '',
    patientName: '',
    patientAge: '',
    mobilityStatus: 'walk', // ค่าเริ่มต้น: เดินได้เอง
    relativeName: '',
    relativePhone: '',
    additionalNotes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ตอนนี้ให้ console.log ดูก่อนว่าเก็บข้อมูลครบไหม
    console.log('ข้อมูลที่เตรียมส่งไป Backend:', {
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      ...formData
    });
    
    // เดี๋ยวกดแล้วค่อยให้ไปหน้า "สรุปการจอง" หรือยิง API ค่อยว่ากันครับ
    alert('บันทึกข้อมูลสำเร็จ! เตรียมส่งไป Backend');
  };

  // แปลงช่วงเวลาเป็นภาษาไทยให้ดูง่ายขึ้น
  const timeSlotLabel = 
    selectedTimeSlot === 'morning' ? 'ช่วงเช้า (08:00 - 12:00)' :
    selectedTimeSlot === 'afternoon' ? 'ช่วงบ่าย (13:00 - 17:00)' : 
    selectedTimeSlot === 'fullday' ? 'เต็มวัน (08:00 - 17:00)' : 'ไม่ได้เลือกเวลา';

  // แปลงวันที่ให้อ่านง่าย (ดึงจาก YYYY-MM-DD)
  const formattedDate = selectedDate ? new Date(selectedDate).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : 'ไม่ได้เลือกวันที่';

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-10 font-sans">
      
      {/* Navbar แบบมีปุ่มย้อนกลับ */}
      <nav className="bg-white flex items-center px-4 py-3 shadow-sm sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="text-[#1A4F90] p-1 mr-2 hover:bg-blue-50 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-[#1A4F90]">รายละเอียดการใช้บริการ</h1>
      </nav>

      <div className="px-4 max-w-md mx-auto mt-6">
        
        {/* กล่องสรุปวัน-เวลาที่เลือกมา */}
        <div className="bg-[#1A4F90] rounded-xl p-4 shadow-md text-white flex items-center gap-4 mb-6">
          <div className="bg-white/20 p-3 rounded-lg">
            <CalendarClock size={28} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-blue-100 mb-1">วันและเวลาที่เลือกไว้</p>
            <p className="font-medium text-sm">{formattedDate}</p>
            <p className="font-medium text-sm">{timeSlotLabel}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Section 1: ข้อมูลการเดินทาง */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="flex items-center gap-2 text-[#1A4F90] font-bold text-sm mb-4 border-b pb-2">
              <MapPin size={18} /> ข้อมูลการเดินทาง
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">รับที่ (ที่อยู่ / หมู่บ้าน / คอนโด)</label>
                <input required name="pickupAddress" value={formData.pickupAddress} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1A4F90] outline-none bg-gray-50" 
                  placeholder="ระบุที่อยู่ที่ต้องการให้ไปรับ" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">ไปที่ (ชื่อโรงพยาบาล / คลินิก)</label>
                <input required name="hospitalName" value={formData.hospitalName} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1A4F90] outline-none bg-gray-50" 
                  placeholder="ระบุชื่อโรงพยาบาล" />
              </div>
            </div>
          </div>

          {/* Section 2: ข้อมูลผู้ป่วย */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="flex items-center gap-2 text-[#1A4F90] font-bold text-sm mb-4 border-b pb-2">
              <User size={18} /> ข้อมูลผู้ป่วย / ผู้สูงอายุ
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">ชื่อ-นามสกุล ผู้ป่วย</label>
                <input required name="patientName" value={formData.patientName} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1A4F90] outline-none bg-gray-50" 
                  placeholder="ชื่อ-นามสกุล" />
              </div>
              <div className="flex gap-3">
                <div className="w-1/3">
                  <label className="block text-xs text-gray-600 mb-1">อายุ (ปี)</label>
                  <input required type="number" name="patientAge" value={formData.patientAge} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1A4F90] outline-none bg-gray-50" 
                    placeholder="เช่น 75" />
                </div>
                <div className="w-2/3">
                  <label className="block text-xs text-gray-600 mb-1">การเคลื่อนไหว</label>
                  <select name="mobilityStatus" value={formData.mobilityStatus} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1A4F90] outline-none bg-gray-50 text-gray-700">
                    <option value="walk">เดินได้ปกติ</option>
                    <option value="cane">ใช้ไม้เท้าช่วยเดิน</option>
                    <option value="wheelchair">ต้องนั่งรถเข็น (มีรถเข็นให้)</option>
                    <option value="wheelchair_req">ต้องการยืมรถเข็นจากศูนย์</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: ผู้ติดต่อและเพิ่มเติม */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="flex items-center gap-2 text-[#1A4F90] font-bold text-sm mb-4 border-b pb-2">
              <Phone size={18} /> ผู้ติดต่อ & ข้อมูลเพิ่มเติม
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">ชื่อญาติ / ผู้ติดต่อ</label>
                <input required name="relativeName" value={formData.relativeName} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1A4F90] outline-none bg-gray-50" 
                  placeholder="ชื่อผู้ติดต่อฉุกเฉิน" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">เบอร์โทรศัพท์มือถือ</label>
                <input required type="tel" name="relativePhone" value={formData.relativePhone} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1A4F90] outline-none bg-gray-50" 
                  placeholder="08X-XXX-XXXX" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">รายละเอียดเพิ่มเติม (เช่น โรคประจำตัว, แพ้ยา)</label>
                <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} rows={3}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1A4F90] outline-none bg-gray-50 resize-none" 
                  placeholder="ระบุความต้องการเพิ่มเติม..." />
              </div>
            </div>
          </div>

          {/* ปุ่ม Submit */}
          <button type="submit" className="w-full bg-[#1A4F90] text-white py-3.5 rounded-xl text-sm font-bold hover:bg-[#153f72] transition-colors shadow-lg mt-4 mb-8">
            ยืนยันข้อมูลการจอง
          </button>
          
        </form>
      </div>
    </div>
  );
}