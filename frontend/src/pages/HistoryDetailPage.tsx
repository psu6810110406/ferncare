import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// 👇 เพิ่ม CheckCircle เข้ามาตรงนี้ครับ
import { ArrowLeft, Edit3, Save, MapPin, User, Phone, FileText, X, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function HistoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 👇 1. เพิ่ม State สำหรับควบคุมการแสดง Popup สำเร็จ
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [booking, setBooking] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    pickupAddress: '',
    patientName: '',
    patientAge: '',
    mobilityStatus: '',
    relativeName: '',
    relativePhone: '',
    additionalNotes: ''
  });

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  const fetchBookingDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooking(response.data);
      setFormData({
        pickupAddress: response.data.pickupAddress || '',
        patientName: response.data.patientName || '',
        patientAge: response.data.patientAge || '',
        mobilityStatus: response.data.mobilityStatus || 'walk',
        relativeName: response.data.relativeName || '',
        relativePhone: response.data.relativePhone || '',
        additionalNotes: response.data.additionalNotes || ''
      });
    } catch (error) {
      console.error('Failed to fetch detail', error);
      alert('ไม่พบข้อมูลการจองนี้');
      navigate('/history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/bookings/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBooking({ ...booking, ...formData });
      setIsEditing(false);
      
      // 👇 2. เปลี่ยนจาก alert เป็นการเปิด Modal และตั้งเวลาให้มันปิดเองใน 2 วินาที (หรือจะกดปิดเองก็ได้)
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to update booking', error);
      alert('ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center font-sans">กำลังโหลด...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans pb-10 relative">
      <Navbar />

      <div className="max-w-md mx-auto px-5 mt-6">
        
        {/* Header ส่วนบน */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate('/history')} className="text-gray-500 hover:text-[#1A4F90] flex items-center gap-1">
            <ArrowLeft size={20} /> ย้อนกลับ
          </button>
          
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-[#1A4F90] bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-100 flex items-center gap-1.5"
            >
              <Edit3 size={16} /> แก้ไขข้อมูล
            </button>
          ) : (
            <button 
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  pickupAddress: booking.pickupAddress,
                  patientName: booking.patientName,
                  patientAge: booking.patientAge,
                  mobilityStatus: booking.mobilityStatus,
                  relativeName: booking.relativeName,
                  relativePhone: booking.relativePhone,
                  additionalNotes: booking.additionalNotes
                });
              }}
              className="text-gray-500 bg-gray-200 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-300 flex items-center gap-1.5"
            >
              <X size={16} /> ยกเลิก
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#1A4F90] mb-4 pb-3 border-b border-gray-100">
            {isEditing ? 'แก้ไขข้อมูลการจอง' : 'รายละเอียดการจอง'}
          </h2>

          {/* โหมดดูข้อมูล (View Mode) */}
          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="text-[#1A4F90] shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">สถานที่รับ ➔ โรงพยาบาล</p>
                  <p className="text-sm font-bold text-gray-800">{booking.pickupAddress} <span className="text-gray-400 font-normal mx-1">➔</span> {booking.hospitalName}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <User className="text-[#1A4F90] shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">ข้อมูลผู้ป่วย</p>
                  <p className="text-sm font-bold text-gray-800">{booking.patientName} (อายุ {booking.patientAge} ปี)</p>
                  <p className="text-xs text-blue-600 mt-0.5 font-medium">
                    สถานะ: {booking.mobilityStatus === 'walk' ? 'เดินได้ปกติ' : booking.mobilityStatus === 'wheelchair' ? 'ใช้รถเข็น' : 'ผู้ป่วยติดเตียง'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="text-[#1A4F90] shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">ผู้ติดต่อ (ญาติ)</p>
                  <p className="text-sm font-bold text-gray-800">{booking.relativeName}</p>
                  <p className="text-sm text-gray-600">{booking.relativePhone}</p>
                </div>
              </div>

              {booking.additionalNotes && (
                <div className="flex gap-3 mt-4 bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                  <FileText className="text-yellow-600 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs text-yellow-800 font-bold mb-0.5">หมายเหตุเพิ่มเติม</p>
                    <p className="text-sm text-yellow-900">{booking.additionalNotes}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            
            /* โหมดแก้ไขข้อมูล (Edit Mode) */
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">สถานที่รับผู้ป่วย (ที่อยู่)</label>
                <input name="pickupAddress" value={formData.pickupAddress} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-gray-50 focus:ring-2 focus:ring-[#1A4F90]/50" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-1 font-medium">ชื่อ-สกุล ผู้ป่วย</label>
                  <input name="patientName" value={formData.patientName} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-gray-50 focus:ring-2 focus:ring-[#1A4F90]/50" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-medium">อายุ (ปี)</label>
                  <input name="patientAge" value={formData.patientAge} onChange={handleInputChange} type="number" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-gray-50 focus:ring-2 focus:ring-[#1A4F90]/50" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">สถานะการเคลื่อนไหว</label>
                <select name="mobilityStatus" value={formData.mobilityStatus} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-gray-50 focus:ring-2 focus:ring-[#1A4F90]/50">
                  <option value="walk">เดินได้ปกติ</option>
                  <option value="wheelchair">ใช้รถเข็น (นั่งได้)</option>
                  <option value="bedridden">ผู้ป่วยติดเตียง (ต้องใช้เปลนอน)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-medium">ชื่อผู้ติดต่อ (ญาติ)</label>
                  <input name="relativeName" value={formData.relativeName} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-gray-50 focus:ring-2 focus:ring-[#1A4F90]/50" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-medium">เบอร์โทรศัพท์</label>
                  <input name="relativePhone" value={formData.relativePhone} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-gray-50 focus:ring-2 focus:ring-[#1A4F90]/50" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">รายละเอียดเพิ่มเติม</label>
                <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} rows={3} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-gray-50 focus:ring-2 focus:ring-[#1A4F90]/50 resize-none" />
              </div>

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-[#1A4F90] text-white py-3 mt-2 rounded-xl text-sm font-bold hover:bg-[#153f72] transition-colors flex justify-center items-center gap-2"
              >
                {isSaving ? 'กำลังบันทึก...' : <><Save size={18} /> บันทึกการเปลี่ยนแปลง</>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 👇 3. ส่วนของกล่อง Popup (Modal) แสดงเมื่อบันทึกสำเร็จ */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-70 shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">บันทึกสำเร็จ</h3>
            <p className="text-xs text-gray-500 text-center mb-6">
              อัปเดตข้อมูลการจองเรียบร้อยแล้ว
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#1A4F90] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#153f72] transition-colors"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}

    </div>
  );
}