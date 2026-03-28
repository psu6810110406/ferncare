import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 🌟 1. Import ตัวนี้เพิ่มเข้ามา

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🌟 2. เปิดใช้งาน Validation ทั่วทั้งแอปพลิเคชัน
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // กรองฟิลด์ขยะที่ Frontend ส่งมาเกิน (แฮกเกอร์แอบส่งมา) ทิ้งไป
      transform: true, // 🌟 สำคัญมาก: ตัวนี้จะช่วยแปลงชนิดข้อมูล เช่น สตริง '18' ให้เป็นตัวเลข 18 ตามที่เราเขียนไว้ใน DTO อัตโนมัติ
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