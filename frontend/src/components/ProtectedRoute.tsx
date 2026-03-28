import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  role: 'admin' | 'user';
  exp: number;
}

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'user')[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');

  // 1. ถ้าไม่มี Token ให้ส่งกลับไปหน้า login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // 2. เช็คว่า Token หมดอายุหรือยัง
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }

    // 3. เช็ค Role ว่ามีสิทธิ์เข้าหน้านี้ไหม
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      // ถ้า Role ไม่ตรง ให้เตะกลับไปหน้าแรก (หรือหน้าที่เหมาะสม)
      return <Navigate to="/booking" replace />; 
    }

    // 4. ถ้าผ่านหมด ให้แสดงเนื้อหาของหน้านั้นๆ ได้
    return <Outlet />;

  } catch (error) {
    // ถ้า Token พัง ถอดรหัสไม่ได้
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
}