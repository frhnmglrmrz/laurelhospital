// @ts-nocheck

import 'dotenv/config';
import { PrismaClient, Role, Gender, BloodType, AppointmentStatus, AdmissionStatus, BedStatus, RoomType, PaymentMethod, PaymentStatus, LabTestStatus, ShiftType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  console.log('🧹 Cleaning up existing data...');
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.admission.deleteMany();
  await prisma.labResult.deleteMany();
  await prisma.labTest.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.prescriptionItem.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.medicineStock.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.bed.deleteMany();
  await prisma.room.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctorSchedule.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.hospital.deleteMany();

  const hospital = await prisma.hospital.create({
    data: {
      name: 'Laurel Hospital',
      code: 'LH-001',
      address: 'Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta 12190',
      phone: '021-5551234',
      email: 'info@laurelhospital.co.id',
    },
  });
  console.log('✅ Hospital created');

  const branchMain = await prisma.branch.create({
    data: {
      hospitalId: hospital.id,
      name: 'Cabang Utama - Jakarta',
      code: 'LH-JKT-01',
      address: 'Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta 12190',
      phone: '021-5551234',
      email: 'jakarta@laurelhospital.co.id',
    },
  });

  const branchBandung = await prisma.branch.create({
    data: {
      hospitalId: hospital.id,
      name: 'Cabang Bandung',
      code: 'LH-BDG-01',
      address: 'Jl. Asia Afrika No. 45, Bandung, Jawa Barat 40111',
      phone: '022-4201234',
      email: 'bandung@laurelhospital.co.id',
    },
  });
  console.log('✅ Branches created');

  const deptUmum = await prisma.department.create({
    data: {
      branchId: branchMain.id,
      name: 'Poli Umum',
      code: 'DEPT-UMUM',
      floor: 'Lantai 1',
    },
  });

  const deptAnak = await prisma.department.create({
    data: {
      branchId: branchMain.id,
      name: 'Poli Anak',
      code: 'DEPT-ANAK',
      floor: 'Lantai 1',
    },
  });

  const deptBedah = await prisma.department.create({
    data: {
      branchId: branchMain.id,
      name: 'Poli Bedah',
      code: 'DEPT-BEDAH',
      floor: 'Lantai 2',
    },
  });

  const deptJantung = await prisma.department.create({
    data: {
      branchId: branchMain.id,
      name: 'Poli Jantung',
      code: 'DEPT-JANTUNG',
      floor: 'Lantai 2',
    },
  });

  const deptMata = await prisma.department.create({
    data: {
      branchId: branchBandung.id,
      name: 'Poli Mata',
      code: 'DEPT-MATA',
      floor: 'Lantai 1',
    },
  });
  console.log('✅ Departments created');

  const userAdmin = await prisma.user.create({
    data: {
      email: 'admin@laurelhospital.co.id',
      password: '$2b$10$hashedpassword_admin_placeholder',
      role: Role.ADMIN,
    },
  });

  const userDoctor1 = await prisma.user.create({
    data: {
      email: 'dr.sari@laurelhospital.co.id',
      password: '$2b$10$hashedpassword_doctor1_placeholder',
      role: Role.DOCTOR,
    },
  });

  const userDoctor2 = await prisma.user.create({
    data: {
      email: 'dr.budi@laurelhospital.co.id',
      password: '$2b$10$hashedpassword_doctor2_placeholder',
      role: Role.DOCTOR,
    },
  });

  const userDoctor3 = await prisma.user.create({
    data: {
      email: 'dr.ayu@laurelhospital.co.id',
      password: '$2b$10$hashedpassword_doctor3_placeholder',
      role: Role.DOCTOR,
    },
  });

  const userPatient1 = await prisma.user.create({
    data: {
      email: 'andi.pratama@gmail.com',
      password: '$2b$10$hashedpassword_patient1_placeholder',
      role: Role.PATIENT,
    },
  });

  const userPatient2 = await prisma.user.create({
    data: {
      email: 'dewi.lestari@gmail.com',
      password: '$2b$10$hashedpassword_patient2_placeholder',
      role: Role.PATIENT,
    },
  });

  const userPatient3 = await prisma.user.create({
    data: {
      email: 'rizky.hidayat@gmail.com',
      password: '$2b$10$hashedpassword_patient3_placeholder',
      role: Role.PATIENT,
    },
  });

  const userNurse1 = await prisma.user.create({
    data: {
      email: 'ns.ratna@laurelhospital.co.id',
      password: '$2b$10$hashedpassword_nurse1_placeholder',
      role: Role.NURSE,
    },
  });

  const userPharmacist = await prisma.user.create({
    data: {
      email: 'apt.fajar@laurelhospital.co.id',
      password: '$2b$10$hashedpassword_pharmacist_placeholder',
      role: Role.PHARMACIST,
    },
  });

  const userReceptionist = await prisma.user.create({
    data: {
      email: 'rina.resepsionis@laurelhospital.co.id',
      password: '$2b$10$hashedpassword_receptionist_placeholder',
      role: Role.RECEPTIONIST,
    },
  });

  const userLabTech = await prisma.user.create({
    data: {
      email: 'lab.hendra@laurelhospital.co.id',
      password: '$2b$10$hashedpassword_labtech_placeholder',
      role: Role.LAB_TECHNICIAN,
    },
  });
  console.log('✅ Users created');

  const doctor1 = await prisma.doctor.create({
    data: {
      userId: userDoctor1.id,
      departmentId: deptUmum.id,
      fullName: 'Dr. Sari Dewi, Sp.PD',
      specialization: 'Penyakit Dalam',
      licenseNumber: 'STR-2024-001234',
      phone: '0812-3456-7890',
      createdBy: userAdmin.id,
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      userId: userDoctor2.id,
      departmentId: deptAnak.id,
      fullName: 'Dr. Budi Santoso, Sp.A',
      specialization: 'Anak',
      licenseNumber: 'STR-2024-002345',
      phone: '0813-4567-8901',
      createdBy: userAdmin.id,
    },
  });

  const doctor3 = await prisma.doctor.create({
    data: {
      userId: userDoctor3.id,
      departmentId: deptBedah.id,
      fullName: 'Dr. Ayu Wulandari, Sp.B',
      specialization: 'Bedah Umum',
      licenseNumber: 'STR-2024-003456',
      phone: '0814-5678-9012',
      createdBy: userAdmin.id,
    },
  });
  console.log('✅ Doctors created');

  await prisma.doctorSchedule.createMany({
    data: [
      { doctorId: doctor1.id, dayOfWeek: 1, startTime: '08:00', endTime: '12:00', maxSlots: 20 },
      { doctorId: doctor1.id, dayOfWeek: 3, startTime: '08:00', endTime: '12:00', maxSlots: 20 },
      { doctorId: doctor1.id, dayOfWeek: 5, startTime: '08:00', endTime: '12:00', maxSlots: 20 },
    ],
  });

  await prisma.doctorSchedule.createMany({
    data: [
      { doctorId: doctor2.id, dayOfWeek: 2, startTime: '08:00', endTime: '15:00', maxSlots: 25 },
      { doctorId: doctor2.id, dayOfWeek: 4, startTime: '08:00', endTime: '15:00', maxSlots: 25 },
    ],
  });

  await prisma.doctorSchedule.createMany({
    data: [
      { doctorId: doctor3.id, dayOfWeek: 1, startTime: '13:00', endTime: '17:00', maxSlots: 15 },
      { doctorId: doctor3.id, dayOfWeek: 2, startTime: '13:00', endTime: '17:00', maxSlots: 15 },
      { doctorId: doctor3.id, dayOfWeek: 3, startTime: '13:00', endTime: '17:00', maxSlots: 15 },
      { doctorId: doctor3.id, dayOfWeek: 4, startTime: '13:00', endTime: '17:00', maxSlots: 15 },
      { doctorId: doctor3.id, dayOfWeek: 5, startTime: '13:00', endTime: '17:00', maxSlots: 15 },
    ],
  });
  console.log('✅ Doctor schedules created');

  const patient1 = await prisma.patient.create({
    data: {
      userId: userPatient1.id,
      fullName: 'Andi Pratama',
      nik: '3171012345670001',
      dateOfBirth: new Date('1990-05-15'),
      gender: Gender.MALE,
      bloodType: BloodType.A,
      phone: '0815-1234-5678',
      address: 'Jl. Kebon Jeruk No. 10, Jakarta Barat',
      createdBy: userReceptionist.id,
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      userId: userPatient2.id,
      fullName: 'Dewi Lestari',
      nik: '3171012345670002',
      dateOfBirth: new Date('1985-11-20'),
      gender: Gender.FEMALE,
      bloodType: BloodType.B,
      phone: '0816-2345-6789',
      address: 'Jl. Menteng Raya No. 25, Jakarta Pusat',
      createdBy: userReceptionist.id,
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      userId: userPatient3.id,
      fullName: 'Rizky Hidayat',
      nik: '3171012345670003',
      dateOfBirth: new Date('1998-03-08'),
      gender: Gender.MALE,
      bloodType: BloodType.O,
      phone: '0817-3456-7890',
      address: 'Jl. Cempaka Putih No. 5, Jakarta Pusat',
      createdBy: userReceptionist.id,
    },
  });
  console.log('✅ Patients created');

  const staffNurse = await prisma.staff.create({
    data: {
      userId: userNurse1.id,
      branchId: branchMain.id,
      fullName: 'Ns. Ratna Sari, S.Kep',
      position: 'Perawat',
      phone: '0818-4567-8901',
      address: 'Jl. Pasar Minggu No. 30, Jakarta Selatan',
      createdBy: userAdmin.id,
    },
  });

  const staffPharmacist = await prisma.staff.create({
    data: {
      userId: userPharmacist.id,
      branchId: branchMain.id,
      fullName: 'Apt. Fajar Nugroho, S.Farm',
      position: 'Apoteker',
      phone: '0819-5678-9012',
      address: 'Jl. Tebet Raya No. 15, Jakarta Selatan',
      createdBy: userAdmin.id,
    },
  });

  const staffReceptionist = await prisma.staff.create({
    data: {
      userId: userReceptionist.id,
      branchId: branchMain.id,
      fullName: 'Rina Wati',
      position: 'Resepsionis',
      phone: '0820-6789-0123',
      address: 'Jl. Kalibata No. 8, Jakarta Selatan',
      createdBy: userAdmin.id,
    },
  });

  const staffLabTech = await prisma.staff.create({
    data: {
      userId: userLabTech.id,
      branchId: branchMain.id,
      fullName: 'Hendra Saputra, A.Md.AK',
      position: 'Analis Laboratorium',
      phone: '0821-7890-1234',
      address: 'Jl. Pancoran No. 12, Jakarta Selatan',
      createdBy: userAdmin.id,
    },
  });
  console.log('✅ Staff created');

  await prisma.shift.createMany({
    data: [
      { staffId: staffNurse.id, date: new Date('2026-03-17'), shiftType: ShiftType.MORNING, startTime: '07:00', endTime: '15:00' },
      { staffId: staffNurse.id, date: new Date('2026-03-18'), shiftType: ShiftType.AFTERNOON, startTime: '15:00', endTime: '23:00' },
      { staffId: staffNurse.id, date: new Date('2026-03-19'), shiftType: ShiftType.NIGHT, startTime: '23:00', endTime: '07:00' },
      { staffId: staffLabTech.id, date: new Date('2026-03-17'), shiftType: ShiftType.MORNING, startTime: '07:00', endTime: '15:00' },
      { staffId: staffLabTech.id, date: new Date('2026-03-18'), shiftType: ShiftType.MORNING, startTime: '07:00', endTime: '15:00' },
      { staffId: staffReceptionist.id, date: new Date('2026-03-17'), shiftType: ShiftType.MORNING, startTime: '08:00', endTime: '16:00' },
      { staffId: staffReceptionist.id, date: new Date('2026-03-18'), shiftType: ShiftType.MORNING, startTime: '08:00', endTime: '16:00' },
      { staffId: staffPharmacist.id, date: new Date('2026-03-17'), shiftType: ShiftType.MORNING, startTime: '08:00', endTime: '16:00' },
    ],
  });
  console.log('✅ Shifts created');

  const roomGeneral1 = await prisma.room.create({
    data: {
      branchId: branchMain.id,
      number: '101',
      type: RoomType.GENERAL,
      floor: 'Lantai 1',
      price: 350000,
    },
  });

  const roomVIP = await prisma.room.create({
    data: {
      branchId: branchMain.id,
      number: '201',
      type: RoomType.VIP,
      floor: 'Lantai 2',
      price: 1500000,
    },
  });

  const roomICU = await prisma.room.create({
    data: {
      branchId: branchMain.id,
      number: '301',
      type: RoomType.ICU,
      floor: 'Lantai 3',
      price: 3000000,
    },
  });

  const bed1 = await prisma.bed.create({ data: { roomId: roomGeneral1.id, number: '101-A', status: BedStatus.AVAILABLE } });
  const bed2 = await prisma.bed.create({ data: { roomId: roomGeneral1.id, number: '101-B', status: BedStatus.OCCUPIED } });
  const bed3 = await prisma.bed.create({ data: { roomId: roomGeneral1.id, number: '101-C', status: BedStatus.AVAILABLE } });
  const bed4 = await prisma.bed.create({ data: { roomId: roomGeneral1.id, number: '101-D', status: BedStatus.MAINTENANCE } });

  const bedVIP = await prisma.bed.create({ data: { roomId: roomVIP.id, number: '201-A', status: BedStatus.AVAILABLE } });

  const bedICU1 = await prisma.bed.create({ data: { roomId: roomICU.id, number: '301-A', status: BedStatus.AVAILABLE } });
  const bedICU2 = await prisma.bed.create({ data: { roomId: roomICU.id, number: '301-B', status: BedStatus.AVAILABLE } });
  console.log('✅ Rooms & Beds created');

  const med1 = await prisma.medicine.create({
    data: {
      name: 'Paracetamol 500mg',
      genericName: 'Paracetamol',
      code: 'MED-001',
      category: 'Analgesik',
      unit: 'Tablet',
      price: 2500,
      requiresRx: false,
      description: 'Obat pereda nyeri dan penurun demam',
      createdBy: staffPharmacist.id,
    },
  });

  const med2 = await prisma.medicine.create({
    data: {
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin',
      code: 'MED-002',
      category: 'Antibiotik',
      unit: 'Kapsul',
      price: 5000,
      requiresRx: true,
      description: 'Antibiotik spektrum luas',
      createdBy: staffPharmacist.id,
    },
  });

  const med3 = await prisma.medicine.create({
    data: {
      name: 'Omeprazole 20mg',
      genericName: 'Omeprazole',
      code: 'MED-003',
      category: 'Antasida',
      unit: 'Kapsul',
      price: 8000,
      requiresRx: true,
      description: 'Obat untuk masalah lambung dan asam lambung',
      createdBy: staffPharmacist.id,
    },
  });

  const med4 = await prisma.medicine.create({
    data: {
      name: 'Cetirizine 10mg',
      genericName: 'Cetirizine',
      code: 'MED-004',
      category: 'Antihistamin',
      unit: 'Tablet',
      price: 3500,
      requiresRx: false,
      description: 'Obat anti alergi',
      createdBy: staffPharmacist.id,
    },
  });

  const med5 = await prisma.medicine.create({
    data: {
      name: 'Metformin 500mg',
      genericName: 'Metformin',
      code: 'MED-005',
      category: 'Antidiabetik',
      unit: 'Tablet',
      price: 4000,
      requiresRx: true,
      description: 'Obat untuk diabetes tipe 2',
      createdBy: staffPharmacist.id,
    },
  });
  console.log('✅ Medicines created');

  await prisma.medicineStock.createMany({
    data: [
      { medicineId: med1.id, batchNo: 'BATCH-PCT-2026-01', quantity: 500, expiryDate: new Date('2028-06-01'), supplier: 'PT. Kimia Farma' },
      { medicineId: med1.id, batchNo: 'BATCH-PCT-2026-02', quantity: 300, expiryDate: new Date('2028-09-01'), supplier: 'PT. Kimia Farma' },
      { medicineId: med2.id, batchNo: 'BATCH-AMX-2026-01', quantity: 200, expiryDate: new Date('2027-12-01'), supplier: 'PT. Sanbe Farma' },
      { medicineId: med3.id, batchNo: 'BATCH-OMP-2026-01', quantity: 150, expiryDate: new Date('2028-03-01'), supplier: 'PT. Dexa Medica' },
      { medicineId: med4.id, batchNo: 'BATCH-CTZ-2026-01', quantity: 400, expiryDate: new Date('2028-01-01'), supplier: 'PT. Kalbe Farma' },
      { medicineId: med5.id, batchNo: 'BATCH-MTF-2026-01', quantity: 250, expiryDate: new Date('2027-08-01'), supplier: 'PT. Kimia Farma' },
    ],
  });
  console.log('✅ Medicine stocks created');

  const appointment1 = await prisma.appointment.create({
    data: {
      branchId: branchMain.id,
      patientId: patient1.id,
      doctorId: doctor1.id,
      date: new Date('2026-03-17'),
      time: '09:00',
      queueNo: 1,
      status: AppointmentStatus.CONFIRMED,
      reason: 'Keluhan sakit kepala dan demam sudah 3 hari',
      createdBy: userReceptionist.id,
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      branchId: branchMain.id,
      patientId: patient2.id,
      doctorId: doctor2.id,
      date: new Date('2026-03-18'),
      time: '10:00',
      queueNo: 1,
      status: AppointmentStatus.PENDING,
      reason: 'Konsultasi kesehatan anak, batuk pilek',
      createdBy: userReceptionist.id,
    },
  });

  const appointment3 = await prisma.appointment.create({
    data: {
      branchId: branchMain.id,
      patientId: patient3.id,
      doctorId: doctor1.id,
      date: new Date('2026-03-17'),
      time: '09:30',
      queueNo: 2,
      status: AppointmentStatus.COMPLETED,
      reason: 'Kontrol rutin tekanan darah tinggi',
      createdBy: userReceptionist.id,
    },
  });
  console.log('✅ Appointments created');

  const record1 = await prisma.medicalRecord.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      checkupDate: new Date('2026-03-17T09:15:00'),
      symptoms: 'Pasien mengeluh sakit kepala berat, demam tinggi (39°C) selama 3 hari, badan lemas, dan tidak nafsu makan.',
      diagnosis: 'Demam tifoid (tipes). Hasil Widal test positif.',
      bloodPressure: '120/80',
      temperature: 39.0,
      weight: 70.5,
      height: 175,
      notes: 'Pasien disarankan istirahat total dan makan makanan lunak. Kontrol 1 minggu lagi.',
      createdBy: doctor1.id,
    },
  });

  const record2 = await prisma.medicalRecord.create({
    data: {
      patientId: patient3.id,
      doctorId: doctor1.id,
      checkupDate: new Date('2026-03-17T10:00:00'),
      symptoms: 'Pasien datang untuk kontrol rutin hipertensi. Tidak ada keluhan khusus.',
      diagnosis: 'Hipertensi grade 1, terkontrol dengan obat.',
      bloodPressure: '140/90',
      temperature: 36.5,
      weight: 82.0,
      height: 170,
      notes: 'Lanjutkan obat sebelumnya. Kontrol 1 bulan lagi.',
      createdBy: doctor1.id,
    },
  });

  await prisma.appointment.update({
    where: { id: appointment3.id },
    data: { medicalRecordId: record2.id },
  });
  console.log('✅ Medical records created');

  const prescription1 = await prisma.prescription.create({
    data: {
      medicalRecordId: record1.id,
      notes: 'Minum obat secara teratur. Kembali kontrol jika demam tidak turun setelah 3 hari.',
      createdBy: doctor1.id,
      items: {
        create: [
          {
            medicineId: med1.id,
            dosage: '3 x 1 tablet',
            quantity: 9,
            instructions: 'Diminum setelah makan, 3 kali sehari',
          },
          {
            medicineId: med2.id,
            dosage: '3 x 1 kapsul',
            quantity: 15,
            instructions: 'Diminum setelah makan selama 5 hari, habiskan',
          },
        ],
      },
    },
  });

  const prescription2 = await prisma.prescription.create({
    data: {
      medicalRecordId: record2.id,
      notes: 'Lanjutkan pengobatan rutin. Jaga pola makan rendah garam.',
      createdBy: doctor1.id,
      items: {
        create: [
          {
            medicineId: med5.id,
            dosage: '1 x 1 tablet',
            quantity: 30,
            instructions: 'Diminum pagi hari sebelum makan',
          },
        ],
      },
    },
  });
  console.log('✅ Prescriptions created');

  await prisma.attachment.createMany({
    data: [
      {
        medicalRecordId: record1.id,
        fileName: 'hasil_widal_test.pdf',
        fileUrl: '/uploads/attachments/hasil_widal_test_20260317.pdf',
        fileType: 'application/pdf',
      },
      {
        medicalRecordId: record1.id,
        fileName: 'foto_rontgen_dada.jpg',
        fileUrl: '/uploads/attachments/rontgen_dada_20260317.jpg',
        fileType: 'image/jpeg',
      },
      {
        medicalRecordId: record2.id,
        fileName: 'hasil_lab_darah.pdf',
        fileUrl: '/uploads/attachments/lab_darah_20260317.pdf',
        fileType: 'application/pdf',
      },
    ],
  });
  console.log('✅ Attachments created');

  const labTest1 = await prisma.labTest.create({
    data: {
      medicalRecordId: record1.id,
      testName: 'Darah Lengkap (Complete Blood Count)',
      testCode: 'LAB-CBC',
      status: LabTestStatus.COMPLETED,
      requestedDate: new Date('2026-03-17T09:30:00'),
      completedDate: new Date('2026-03-17T11:00:00'),
      notes: 'Sampel darah diambil dari lengan kiri',
      createdBy: doctor1.id,
      result: {
        create: {
          result: 'Hemoglobin: 13.5 g/dL, Leukosit: 12.000/uL (tinggi), Trombosit: 180.000/uL, Hematokrit: 40%',
          unit: 'g/dL, /uL',
          refRange: 'Hb: 13-17 g/dL, Leukosit: 4.000-10.000/uL, Trombosit: 150.000-400.000/uL',
          isNormal: false,
          notes: 'Leukosit meningkat, menandakan adanya infeksi',
          createdBy: staffLabTech.id,
        },
      },
    },
  });

  const labTest2 = await prisma.labTest.create({
    data: {
      medicalRecordId: record1.id,
      testName: 'Widal Test',
      testCode: 'LAB-WIDAL',
      status: LabTestStatus.COMPLETED,
      requestedDate: new Date('2026-03-17T09:30:00'),
      completedDate: new Date('2026-03-17T12:00:00'),
      createdBy: doctor1.id,
      result: {
        create: {
          result: 'S. typhi O: 1/320 (Positif), S. typhi H: 1/320 (Positif), S. paratyphi AO: 1/80 (Negatif)',
          unit: 'titer',
          refRange: 'Negatif jika < 1/160',
          isNormal: false,
          notes: 'Hasil positif tifoid, titer tinggi menunjukkan infeksi aktif',
          createdBy: staffLabTech.id,
        },
      },
    },
  });

  const labTest3 = await prisma.labTest.create({
    data: {
      medicalRecordId: record2.id,
      testName: 'Gula Darah Puasa',
      testCode: 'LAB-GDP',
      status: LabTestStatus.IN_PROGRESS,
      requestedDate: new Date('2026-03-17T10:15:00'),
      notes: 'Pasien puasa 8 jam sebelum pengambilan sampel',
      createdBy: doctor1.id,
    },
  });
  console.log('✅ Lab tests & results created');

  const admission1 = await prisma.admission.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      bedId: bed2.id,
      admissionDate: new Date('2026-03-17T12:00:00'),
      status: AdmissionStatus.ADMITTED,
      diagnosis: 'Demam tifoid, perlu rawat inap untuk observasi dan pengobatan IV',
      notes: 'Pasien dipindahkan ke rawat inap atas indikasi demam tinggi tidak kunjung turun. Infus terpasang.',
      createdBy: doctor1.id,
    },
  });
  console.log('✅ Admissions created');

  const invoice1 = await prisma.invoice.create({
    data: {
      branchId: branchMain.id,
      patientId: patient1.id,
      invoiceNo: 'INV-2026-03-0001',
      totalAmount: 850000,
      discount: 0,
      tax: 0,
      grandTotal: 850000,
      status: PaymentStatus.UNPAID,
      dueDate: new Date('2026-03-24'),
      notes: 'Biaya rawat jalan + laboratorium',
      createdBy: staffReceptionist.id,
      items: {
        create: [
          {
            description: 'Konsultasi Dokter Spesialis Penyakit Dalam',
            category: 'consultation',
            quantity: 1,
            unitPrice: 250000,
            totalPrice: 250000,
          },
          {
            description: 'Tes Darah Lengkap (CBC)',
            category: 'lab',
            quantity: 1,
            unitPrice: 150000,
            totalPrice: 150000,
          },
          {
            description: 'Widal Test',
            category: 'lab',
            quantity: 1,
            unitPrice: 100000,
            totalPrice: 100000,
          },
          {
            description: 'Paracetamol 500mg (9 tablet)',
            category: 'medicine',
            quantity: 9,
            unitPrice: 2500,
            totalPrice: 22500,
          },
          {
            description: 'Amoxicillin 500mg (15 kapsul)',
            category: 'medicine',
            quantity: 15,
            unitPrice: 5000,
            totalPrice: 75000,
          },
          {
            description: 'Kamar Rawat Inap Kelas 3 (1 hari)',
            category: 'room',
            quantity: 1,
            unitPrice: 350000,
            totalPrice: 350000,
          },
        ],
      },
    },
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      branchId: branchMain.id,
      patientId: patient3.id,
      invoiceNo: 'INV-2026-03-0002',
      totalAmount: 520000,
      discount: 52000,
      tax: 0,
      grandTotal: 468000,
      status: PaymentStatus.PAID,
      notes: 'Biaya kontrol rutin - Diskon 10% member',
      createdBy: staffReceptionist.id,
      items: {
        create: [
          {
            description: 'Konsultasi Dokter Spesialis Penyakit Dalam',
            category: 'consultation',
            quantity: 1,
            unitPrice: 250000,
            totalPrice: 250000,
          },
          {
            description: 'Tes Gula Darah Puasa',
            category: 'lab',
            quantity: 1,
            unitPrice: 75000,
            totalPrice: 75000,
          },
          {
            description: 'Metformin 500mg (30 tablet)',
            category: 'medicine',
            quantity: 30,
            unitPrice: 4000,
            totalPrice: 120000,
          },
          {
            description: 'Biaya administrasi',
            category: 'admin',
            quantity: 1,
            unitPrice: 75000,
            totalPrice: 75000,
          },
        ],
      },
    },
  });
  console.log('✅ Invoices created');

  await prisma.payment.create({
    data: {
      invoiceId: invoice2.id,
      amount: 468000,
      method: PaymentMethod.BPJS,
      reference: 'BPJS-CLM-2026030001',
      notes: 'Pembayaran via BPJS Kesehatan',
      createdBy: staffReceptionist.id,
    },
  });
  console.log('✅ Payments created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   - 1 Hospital`);
  console.log(`   - 2 Branches`);
  console.log(`   - 5 Departments`);
  console.log(`   - 11 Users`);
  console.log(`   - 3 Doctors`);
  console.log(`   - 10 Doctor Schedules`);
  console.log(`   - 3 Patients`);
  console.log(`   - 4 Staff`);
  console.log(`   - 8 Shifts`);
  console.log(`   - 3 Rooms, 7 Beds`);
  console.log(`   - 5 Medicines, 6 Stocks`);
  console.log(`   - 3 Appointments`);
  console.log(`   - 2 Medical Records`);
  console.log(`   - 2 Prescriptions, 3 Items`);
  console.log(`   - 3 Attachments`);
  console.log(`   - 3 Lab Tests, 2 Results`);
  console.log(`   - 1 Admission`);
  console.log(`   - 2 Invoices, 10 Items`);
  console.log(`   - 1 Payment`);
  console.log('='.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
