import { Phone, Mail, MessageCircle } from 'lucide-react';
// 🌟 ดึงไฟล์โลโก้เข้ามาใช้งาน (ตรวจสอบ path ให้ถูกต้องนะครับ)
import logo from '../assets/logo.png'; 

// 🌟 สร้างคอมโพเนนต์ไอคอน Facebook เอง (แก้ปัญหา lucide-react ไม่มีไอคอนนี้)
const FacebookIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function Footer() {
  return (
    // ✅ แก้ไข: เอา rounded-t-3xl ออก (เป็น rounded-none) และปรับ pb-0 เพื่อให้แนบชิดขอบล่างพอดี
    <footer className="bg-[#1A4F90] text-white pt-10 pb-0 rounded-none mt-auto w-full"> 
      <div className="max-w-md mx-auto px-6 pb-6"> 
        
        <div className="flex flex-col gap-8">
          {/* ส่วนที่ 1: โลโก้ และ ชื่อเว็บ */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-white p-1.5 rounded-xl flex items-center justify-center shadow-inner">
                <img src={logo} alt="Ferncare Logo" className="h-8 w-auto object-contain" />
              </div>
              <h2 className="text-2xl font-bold tracking-wide">Ferncare</h2>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed pr-4">
              บริการพาผู้ป่วยไปโรงพยาบาล สะดวก ปลอดภัย อุ่นใจเหมือนมีญาติมิตรคอยดูแลอย่างใกล้ชิด
            </p>
          </div>

          {/* ส่วนที่ 2: ช่องทางการติดต่อ */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white/90">ติดต่อสอบถาม</h3>
            <div className="space-y-3.5 text-sm text-blue-100">
              <a href="tel:0801234567" className="flex items-center gap-3 hover:text-white hover:translate-x-1 transition-all">
                <div className="bg-blue-800/50 p-2 rounded-lg">
                  <Phone size={16} />
                </div>
                <span className="font-medium">081-081-7537</span>
              </a>
              
              <a href="#" className="flex items-center gap-3 hover:text-white hover:translate-x-1 transition-all">
                <div className="bg-blue-800/50 p-2 rounded-lg">
                  <MessageCircle size={16} />
                </div>
                <span className="font-medium">Line ID: @ferncare</span>
              </a>

              {/* 🌟 เรียกใช้ FacebookIcon ที่เราสร้างเอง */}
              <a 
                href="https://www.facebook.com/phach.ra.ph.rn.sm.hmay.2024" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 hover:text-white hover:translate-x-1 transition-all"
              >
                <div className="bg-blue-800/50 p-2 rounded-lg">
                  <FacebookIcon size={16} />
                </div>
                <span className="font-medium">พัชราภรณ์ สมหมาย</span>
              </a>

              <a href="mailto:contact@ferncare.com" className="flex items-center gap-3 hover:text-white hover:translate-x-1 transition-all">
                <div className="bg-blue-800/50 p-2 rounded-lg">
                  <Mail size={16} />
                </div>
                <span className="font-medium">contact@ferncare.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* ส่วนที่ 3: ลิขสิทธิ์ (Copyright) */}
        <div className="mt-8 pt-5 border-t border-blue-800/50 flex flex-col items-center justify-center gap-1">
          <p className="text-xs text-blue-300">
            &copy; {new Date().getFullYear()} Ferncare. All rights reserved.
          </p>
          <p className="text-[10px] text-blue-400">
            Designed with care for your loved ones.
          </p>
        </div>

      </div>
    </footer>
  );
}