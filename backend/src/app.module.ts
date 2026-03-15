import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { HospitalModule } from './hospital/hospital.module';
import { BranchModule } from './branch/branch.module';
import { UserModule } from './user/user.module';
import { DepartmentModule } from './department/department.module';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { DoctorScheduleModule } from './doctor-schedule/doctor-schedule.module';
import { AppointmentModule } from './appointment/appointment.module';
import { MedicalRecordModule } from './medical-record/medical-record.module';
import { PrescriptionModule } from './prescription/prescription.module';
import { PrescriptionItemModule } from './prescription-item/prescription-item.module';
import { MedicineModule } from './medicine/medicine.module';
import { MedicineStockModule } from './medicine-stock/medicine-stock.module';
import { RoomModule } from './room/room.module';
import { BedModule } from './bed/bed.module';
import { AdmissionModule } from './admission/admission.module';
import { LabTestModule } from './lab-test/lab-test.module';
import { LabResultModule } from './lab-result/lab-result.module';
import { InvoiceModule } from './invoice/invoice.module';
import { InvoiceItemModule } from './invoice-item/invoice-item.module';
import { PaymentModule } from './payment/payment.module';
import { AttachmentModule } from './attachment/attachment.module';
import { StaffModule } from './staff/staff.module';
import { ShiftModule } from './shift/shift.module';

@Module({
  imports: [AuthModule, PrismaModule, HospitalModule, BranchModule, UserModule, DepartmentModule, PatientModule, DoctorModule, DoctorScheduleModule, AppointmentModule, MedicalRecordModule, PrescriptionModule, PrescriptionItemModule, MedicineModule, MedicineStockModule, RoomModule, BedModule, AdmissionModule, LabTestModule, LabResultModule, InvoiceModule, InvoiceItemModule, PaymentModule, AttachmentModule, StaffModule, ShiftModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
