export class CreateBookingDto {
  date: string;
  timeSlot: string;
  pickupAddress: string;
  hospitalName: string;
  patientName: string;
  patientAge: number;
  mobilityStatus: string;
  relativeName: string;
  relativePhone: string;
  additionalNotes?: string; // ใส่ ? เพราะอาจจะไม่มีการกรอกเพิ่มเติมมาก็ได้
}