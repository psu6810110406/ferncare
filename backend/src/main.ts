import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express'; // 🌟 1. Import เครื่องมือสำหรับตั้งค่าขนาดข้อมูล

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🌟 2. เพิ่ม 2 บรรทัดนี้ ขยายท่อรับข้อมูลให้รองรับไฟล์รูป Base64 ได้สูงสุด 10MB
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // เปิดใช้งาน Validation ทั่วทั้งแอปพลิเคชัน
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // กรองฟิลด์ขยะที่ Frontend ส่งมาเกิน (แฮกเกอร์แอบส่งมา) ทิ้งไป
      transform: true, // สำคัญมาก: แปลงชนิดข้อมูลอัตโนมัติ
    }),
  );

  // Enable CORS so the React frontend can consume the API
  app.enableCors({
    origin: 'http://localhost:5173', // Vite default port
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  await app.listen(3000);
}
bootstrap();