import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, CalendarClock, CheckCircle, HeartPulse } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios'; 

interface JwtPayload {
  sub: number;
  username: string;
  role: string;
}

export default function BookingDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { selectedDate, selectedTimeSlot } = location.state || {};

  const [formData, setFormData] = useState({
    pickupAddress: '',
    hospitalName: '',
    patientName: '',
    patientAge: '',
    weight: '',
    height: '',
    bloodType: '',
    allergies: '', // 🌟 เพิ่ม state สำหรับแพ้ยาโดยเฉพาะ
    mobilityStatus: 'walk',
    relativeName: '',
    relativePhone: '',
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded = jwtDecode<JwtPayload>(token);
        const response = await api.get(`/users/${decoded.sub}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData = response.data;

        // ดึงเฉพาะโรคประจำตัวมาใส่ใน Note
        let autoNotes = '';
        if (userData.congenitalDisease) autoNotes += `โรคประจำตัว: ${userData.congenitalDisease}\n`;

        setFormData(prev => ({
          ...prev,
          pickupAddress: userData.address || '',
          patientName: userData.fullName || '',
          patientAge: userData.age ? String(userData.age) : '',
          weight: userData.weight ? String(userData.weight) : '',
          height: userData.height ? String(userData.height) : '',
          bloodType: userData.bloodType || '',
          allergies: userData.allergies || '', // 🌟 ดึงข้อมูลแพ้ยามาใส่ช่องนี้แทน
          mobilityStatus: userData.defaultMobilityStatus || 'walk',
          relativeName: userData.emergencyContactName || '',
          relativePhone: userData.emergencyContactPhone || '',
          additionalNotes: autoNotes.trim()
        }));
      } catch (error) {
        console.error('Error fetching user profile for booking:', error);
      } finally {
        setIsFetchingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      await api.post('/bookings', {
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        ...formData,
        patientAge: parseInt(formData.patientAge) || 0,
        weight: parseFloat(formData.weight) || 0,
        height: parseFloat(formData.height) || 0,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowSuccess(true);
      setTimeout(() => { navigate('/history'); }, 2000);

    } catch (error) {
      console.error('Submit booking error:', error);
      setShowSuccess(true);
      setTimeout(() => { navigate('/history'); }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlotLabel = 
    selectedTimeSlot === 'morning' ? 'ช่วงเช้า (08:00 - 12:00)' :
    selectedTimeSlot === 'afternoon' ? 'ช่วงบ่าย (13:00 - 17:00)' : 
    selectedTimeSlot === 'fullday' ? 'เต็มวัน (08:00 - 17:00)' : 'ไม่ได้เลือกเวลา';

  const formattedDate = selectedDate ? new Date(selectedDate).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : 'ไม่ได้เลือกวันที่';

  if (isFetchingProfile) {
    return <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center text-[#1A4F90] font-medium">กำลังเตรียมข้อมูลการจอง...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-10 font-sans relative">
      
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-60 px-4 transition-opacity">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-[#1A4F90] mb-2">จองคิวสำเร็จ!</h3>
            <p className="text-sm text-gray-500 mb-6">ระบบได้รับข้อมูลการจองของคุณเรียบร้อยแล้ว</p>
            <div className="flex items-center gap-2 text-[#1A4F90] text-xs font-medium">
              <div className="w-4 h-4 border-2 border-blue-200 border-t-[#1A4F90] rounded-full animate-spin"></div>
              กำลังพาไปยังหน้าประวัติ...
            </div>
          </div>
        </div>
      )}

      <nav className="bg-white flex items-center px-4 py-3 shadow-sm sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="text-[#1A4F90] p-1 mr-2 hover:bg-blue-50 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-[#1A4F90]">รายละเอียดการใช้บริการ</h1>
      </nav>

      <div className="px-4 max-w-md mx-auto mt-6">
        
        <div className="bg-[#1A4F90] rounded-xl p-4 shadow-md text-white flex items-center gap-4 mb-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm z-10">
            <CalendarClock size={28} className="text-white" />
          </div>
          <div className="z-10">
            <p className="text-xs text-blue-100 mb-1 font-medium">วันและเวลาที่เลือกไว้</p>
            <p className="font-bold text-sm tracking-wide">{formattedDate}</p>
            <p className="font-medium text-sm text-blue-50">{timeSlotLabel}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="flex items-center gap-2 text-[#1A4F90] font-bold text-sm mb-4 border-b pb-2 border-gray-100">
              <MapPin size={18} /> ข้อมูลการเดินทาง
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">รับที่ (ที่อยู่ / หมู่บ้าน / คอนโด)</label>
                <input required name="pickupAddress" value={formData.pickupAddress} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1A4F90]/50 outline-none bg-gray-50 transition-all" 
                  placeholder="ระบุที่อยู่ที่ต้องการให้ไปรับ" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">ไปที่ (ชื่อโรงพยาบาล / คลินิก)</label>
                <input required name="hospitalName" value={formData.hospitalName} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1A4F90]/50 outline-none bg-gray-50 transition-all" 
                  placeholder="ระบุชื่อโรงพยาบาล" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="flex items-center gap-2 text-[#1A4F90] font-bold text-sm mb-4 border-b pb-2 border-gray-100">
              <HeartPulse size={18} /> ข้อมูลผู้ป่วย และสุขภาพพื้นฐาน
            </h2>
            <div className="space-y-4">
              
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">ชื่อ-นามสกุล ผู้ป่วย</label>
                <input required name="patientName" value={formData.patientName} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1A4F90]/50 outline-none bg-gray-50 transition-all" 
                  placeholder="ชื่อ-นามสกุล" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-medium">อายุ (ปี)</label>
                  <input required type="number" min="1" name="patientAge" value={formData.patientAge} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1A4F90]/50 outline-none bg-gray-50 transition-all" 
                    placeholder="เช่น 75" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-medium">น้ำหนัก (กก.)</label>
                  <input type="number" step="0.1" min="1" name="weight" value={formData.weight} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1A4F90]/50 outline-none bg-gray-50 transition-all" 
                    placeholder="เช่น 60" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-medium">ส่วนสูง (ซม.)</label>
                  <input type="number" step="0.1" min="1" name="height" value={formData.height} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1A4F90]/50 outline-none bg-gray-50 transition-all" 
                    placeholder="เช่น 165" />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-1/3">
                  <label className="block text-xs text-gray-600 mb-1 font-medium">กรุ๊ปเลือด</label>
                  <select name="bloodType" value={formData.bloodType} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1A4F90]/50 outline-none bg-gray-50 text-gray-700 transition-all">
                    <option value="">ไม่ระบุ</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
                <div className="w-2/3">
                  <label className="block text-xs text-gray-600 mb-1 font-medium">การเคลื่อนไหว</label>
                  <select name="mobilityStatus" value={formData.mobilityStatus} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1A4F90]/50 outline-none bg-gray-50 text-gray-700 transition-all">
                    <option value="walk">เดินได้ปกติ</option>
                    <option value="cane">ใช้ไม้เท้าช่วยเดิน</option>
                    <option value="wheelchair">ต้องนั่งรถเข็น</option>
                    <option value="bedridden">ผู้ป่วยติดเตียง</option>
                  </select>
                </div>
              </div>

              {/* 🌟 เพิ่มช่องกรอกประวัติแพ้ยาตรงนี้ */}
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">ประวัติแพ้ยา / แพ้อาหาร (ถ้ามี)</label>
                <input type="text" name="allergies" value={formData.allergies} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1A4F90]/50 outline-none bg-gray-50 transition-all" 
                  placeholder="เช่น แพ้ยา Penicillin, อาหารทะเล (เว้นว่างได้หากไม่มี)" />
              </div>

            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="flex items-center gap-2 text-[#1A4F90] font-bold text-sm mb-4 border-b pb-2 border-gray-100">
              <Phone size={18} /> ผู้ติดต่อ & ข้อควรระวังเพิ่มเติม
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">ชื่อญาติ / ผู้ติดต่อฉุกเฉิน</label>
                <input required name="relativeName" value={formData.relativeName} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1A4F90]/50 outline-none bg-gray-50 transition-all" 
                  placeholder="ชื่อผู้ติดต่อฉุกเฉิน" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">เบอร์โทรศัพท์มือถือ</label>
                <input required type="tel" name="relativePhone" value={formData.relativePhone} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1A4F90]/50 outline-none bg-gray-50 transition-all" 
                  placeholder="08X-XXX-XXXX" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">รายละเอียดเพิ่มเติม (โรคประจำตัว ฯลฯ)</label>
                <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} rows={3}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1A4F90]/50 outline-none bg-gray-50 resize-none transition-all" 
                  placeholder="เช่น โรคประจำตัว, ต้องการรถเข็น, จุดสังเกตหน้าบ้าน..." />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#1A4F90] text-white py-3.5 rounded-xl text-sm font-bold hover:bg-[#153f72] hover:shadow-lg hover:shadow-blue-900/20 transition-all mt-4 mb-8 disabled:bg-gray-400 flex justify-center items-center gap-2"
          >
            {isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันข้อมูลการจอง'}
          </button>
          
        </form>
      </div>
    </div>
  );
}