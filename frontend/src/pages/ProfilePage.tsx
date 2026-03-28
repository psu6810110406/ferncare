import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Phone, MapPin, Save, ArrowLeft, Calendar, 
  Heart, Activity, AlertCircle, Scale, Ruler, Droplet, Accessibility 
} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';
import Navbar from '../components/Navbar';

interface JwtPayload {
  sub: number;
  username: string;
  role: string;
}

// 🌟 1. กำหนดรูปแบบโครงสร้างข้อมูลที่อยู่ให้ตรงกับไฟล์ JSON ที่เป็น Array
interface AddressItem {
  district: string;      // ตำบล/แขวง
  amphoe: string;        // อำเภอ/เขต
  province: string;      // จังหวัด
  zipcode: number | string; // รหัสไปรษณีย์
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<'personal' | 'health' | 'emergency'>('personal');

  // 🌟 2. เปลี่ยน State เป็น Array ของ AddressItem
  const [addressData, setAddressData] = useState<AddressItem[]>([]);

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    age: '',
    phone: '',
    addressDetail: '', 
    province: '',
    district: '',
    subDistrict: '',
    zipCode: '',
    weight: '',
    height: '',
    bloodType: '',
    congenitalDisease: '',
    allergies: '',
    defaultMobilityStatus: 'walk',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: ''
  });

  useEffect(() => {
    fetchProfile();
    
    // โหลดข้อมูลที่อยู่จากไฟล์
    fetch('/thai_address.json')
      .then(res => res.json())
      .then(data => setAddressData(data))
      .catch(err => console.error('ไม่สามารถโหลดข้อมูลที่อยู่ได้:', err));
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const decoded = jwtDecode<JwtPayload>(token);
      setUserId(decoded.sub);

      const response = await api.get(`/users/${decoded.sub}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;
      setFormData(prev => ({
        ...prev,
        username: data.username || '',
        fullName: data.fullName || '',
        age: data.age || '',
        phone: data.phone || '',
        addressDetail: data.address || '', 
        weight: data.weight || '',
        height: data.height || '',
        bloodType: data.bloodType || '',
        congenitalDisease: data.congenitalDisease || '',
        allergies: data.allergies || '',
        defaultMobilityStatus: data.defaultMobilityStatus || 'walk',
        emergencyContactName: data.emergencyContactName || '',
        emergencyContactPhone: data.emergencyContactPhone || '',
        emergencyContactRelation: data.emergencyContactRelation || ''
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('ไม่สามารถดึงข้อมูลโปรไฟล์ได้ กรุณาล็อกอินใหม่');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (['age', 'weight', 'height'].includes(name)) {
      if (Number(value) < 0) {
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🌟 3. ปรับวิธีค้นหารหัสไปรษณีย์จากการเลือกตำบล
  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      if (name === 'province') {
        newData.district = '';
        newData.subDistrict = '';
        newData.zipCode = '';
      }
      
      if (name === 'district') {
        newData.subDistrict = '';
        newData.zipCode = '';
      }

      if (name === 'subDistrict' && newData.province && newData.district) {
        // ค้นหาข้อมูลที่ตรงกับ จังหวัด อำเภอ และ ตำบล ที่เลือก
        const matchedItem = addressData.find(
          item => 
            item.province === newData.province && 
            item.amphoe === newData.district && 
            item.district === value
        );
        newData.zipCode = matchedItem ? String(matchedItem.zipcode) : '';
      }

      return newData;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      const fullAddress = `${formData.addressDetail} ต.${formData.subDistrict} อ.${formData.district} จ.${formData.province} ${formData.zipCode}`.trim();

      // 🌟 จัดเตรียมข้อมูลก่อนส่ง โดยเช็คและแปลงเป็นตัวเลขให้เรียบร้อย
      const payload = {
        fullName: formData.fullName,
        age: formData.age ? parseInt(formData.age, 10) : null, // แปลงเป็น Integer
        phone: formData.phone,
        address: fullAddress,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        bloodType: formData.bloodType,
        congenitalDisease: formData.congenitalDisease,
        allergies: formData.allergies,
        defaultMobilityStatus: formData.defaultMobilityStatus,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        emergencyContactRelation: formData.emergencyContactRelation
      };

      await api.patch(`/users/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

  // 🌟 4. ดึงรายชื่อ จังหวัด อำเภอ ตำบล โดยการ Filter จาก Array และตัดตัวซ้ำออกด้วย Set
  const availableProvinces = Array.from(
    new Set(addressData.map(item => item.province))
  ).sort();

  const availableDistricts = formData.province 
    ? Array.from(
        new Set(
          addressData
            .filter(item => item.province === formData.province)
            .map(item => item.amphoe)
        )
      ).sort()
    : [];

  const availableSubDistricts = formData.province && formData.district
    ? Array.from(
        new Set(
          addressData
            .filter(item => item.province === formData.province && item.amphoe === formData.district)
            .map(item => item.district)
        )
      ).sort()
    : [];

  if (isLoading) {
    return <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans pb-10 relative">
      <Navbar />

      <div className="max-w-md mx-auto px-5 mt-6">
        
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-[#1A4F90] transition-colors p-2 bg-white rounded-full shadow-sm border border-gray-100">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-[#1A4F90]">โปรไฟล์ของฉัน</h1>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-4 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#1A4F90] shrink-0 border-2 border-blue-100">
            <User size={30} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{formData.fullName || `@${formData.username}`}</h2>
            <p className="text-sm text-gray-500">จัดการข้อมูลส่วนตัวและข้อมูลสุขภาพ</p>
          </div>
        </div>

        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-4">
          <button 
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'personal' ? 'bg-[#1A4F90] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            ข้อมูลส่วนตัว
          </button>
          <button 
            onClick={() => setActiveTab('health')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'health' ? 'bg-[#1A4F90] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            สุขภาพ/ร่างกาย
          </button>
          <button 
            onClick={() => setActiveTab('emergency')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'emergency' ? 'bg-[#1A4F90] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            ติดต่อฉุกเฉิน
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          
          {activeTab === 'personal' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 ml-1">ชื่อ-สกุล</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><User size={16} /></div>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="ชื่อและนามสกุลจริง" className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4F90]/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 ml-1">อายุ (ปี)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Calendar size={16} /></div>
                    <input type="number" min="0" name="age" value={formData.age} onChange={handleInputChange} placeholder="เช่น 35" className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4F90]/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 ml-1">เบอร์โทรศัพท์</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Phone size={16} /></div>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="08X-XXX-XXXX" className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4F90]/50" />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 mt-2">
                <label className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5"><MapPin size={16} className="text-[#1A4F90]"/> ที่อยู่ตามภูมิลำเนา</label>
                <div className="space-y-3">
                  <textarea name="addressDetail" value={formData.addressDetail} onChange={handleInputChange} rows={2} placeholder="บ้านเลขที่, หมู่บ้าน, ซอย, ถนน..." className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4F90]/50 resize-none" />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <select name="province" value={formData.province} onChange={handleAddressChange} className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4F90]/50">
                      <option value="">เลือกจังหวัด</option>
                      {availableProvinces.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    
                    <select name="district" value={formData.district} onChange={handleAddressChange} disabled={!formData.province} className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4F90]/50 disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="">เลือกอำเภอ/เขต</option>
                      {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <select name="subDistrict" value={formData.subDistrict} onChange={handleAddressChange} disabled={!formData.district} className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4F90]/50 disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="">เลือกตำบล/แขวง</option>
                      {availableSubDistricts.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    
                    <input type="text" name="zipCode" value={formData.zipCode} readOnly placeholder="รหัสไปรษณีย์" className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 ml-1">น้ำหนัก (กก.)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Scale size={16} /></div>
                    <input type="number" min="0" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="เช่น 65" className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4F90]/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 ml-1">ส่วนสูง (ซม.)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Ruler size={16} /></div>
                    <input type="number" min="0" name="height" value={formData.height} onChange={handleInputChange} placeholder="เช่น 170" className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4F90]/50" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 ml-1">สถานะการเคลื่อนไหวพื้นฐาน</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Accessibility size={16} /></div>
                  <select name="defaultMobilityStatus" value={formData.defaultMobilityStatus} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4F90]/50 appearance-none">
                    <option value="walk">เดินได้ปกติ</option>
                    <option value="wheelchair">ใช้รถเข็น (นั่งได้)</option>
                    <option value="bedridden">ผู้ป่วยติดเตียง</option>
                  </select>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 ml-1">* จะถูกตั้งเป็นค่าเริ่มต้นอัตโนมัติเมื่อกดจองรถ</p>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 ml-1 flex items-center gap-1"><Droplet size={14}/> กรุ๊ปเลือด</label>
                    <select name="bloodType" value={formData.bloodType} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4F90]/50">
                      <option value="">ไม่ระบุ / ไม่ทราบ</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="O">O</option>
                      <option value="AB">AB</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 ml-1 flex items-center gap-1"><Activity size={14}/> โรคประจำตัว (ถ้ามี)</label>
                    <input type="text" name="congenitalDisease" value={formData.congenitalDisease} onChange={handleInputChange} placeholder="เช่น เบาหวาน, ความดันสูง" className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4F90]/50" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 ml-1 flex items-center gap-1"><AlertCircle size={14}/> ประวัติการแพ้ยา / แพ้อาหาร</label>
                    <input type="text" name="allergies" value={formData.allergies} onChange={handleInputChange} placeholder="ระบุสิ่งที่แพ้ (ถ้ามี)" className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A4F90]/50" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 mb-2">
                <div className="flex items-start gap-2">
                  <Heart className="text-red-500 mt-0.5 shrink-0" size={18} />
                  <p className="text-xs text-red-800 leading-relaxed">
                    บุคคลที่ทีมพยาบาลสามารถติดต่อได้ทันทีในกรณีฉุกเฉิน หรือหากไม่สามารถติดต่อคุณได้ระหว่างการเดินทาง
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 ml-1">ชื่อ-สกุล (ผู้ติดต่อฉุกเฉิน)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><User size={16} /></div>
                  <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange} placeholder="ชื่อบุคคลติดต่อ" className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 ml-1">ความสัมพันธ์</label>
                <input type="text" name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleInputChange} placeholder="เช่น บิดา, มารดา, บุตร, สามี, ภรรยา" className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/50" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 ml-1">เบอร์โทรศัพท์ฉุกเฉิน</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Phone size={16} /></div>
                  <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleInputChange} placeholder="08X-XXX-XXXX" className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/50" />
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full mt-8 bg-[#1A4F90] text-white py-3.5 rounded-xl text-sm font-bold hover:bg-[#153f72] transition-colors disabled:opacity-70 shadow-md flex justify-center items-center gap-2"
          >
            {isSaving ? <span className="animate-pulse">กำลังบันทึก...</span> : <><Save size={18} /> บันทึกการเปลี่ยนแปลงทั้งหมด</>}
          </button>
            
        </div>
      </div>
    </div>
  );
}