
export enum Jantina {
  Lelaki = 'LELAKI',
  Perempuan = 'PEREMPUAN'
}

export enum Kaum {
  Melayu = 'MELAYU',
  Cina = 'CINA',
  India = 'INDIA',
  OrangAsli = 'ORANG ASLI',
  LainLain = 'LAIN-LAIN'
}

export enum JawatanGuru {
  Penasihat = 'Penasihat',
  Pengerusi = 'Pengerusi',
  NaibPengerusi = 'Naib Pengerusi',
  GuruPelaksana = 'Guru Pelaksana'
}

export enum JawatanAJK {
  Pengerusi = 'Pengerusi',
  NaibPengerusi = 'Naib Pengerusi',
  Setiausaha = 'Setiausaha',
  NaibSetiausaha = 'Naib Setiausaha',
  Bendahari = 'Bendahari',
  NaibBendahari = 'Naib Bendahari',
  AJKT1 = 'AJK Tingkatan 1',
  AJKT2 = 'AJK Tingkatan 2',
  AJKT3 = 'AJK Tingkatan 3',
  AJKT4 = 'AJK Tingkatan 4',
  AJKT5 = 'AJK Tingkatan 5'
}

export interface Teacher {
  id: string;
  nama: string;
  jawatan: JawatanGuru;
  telefon: string;
}

export interface Student {
  id: string;
  nama: string;
  noKP: string;
  tingkatan: string;
  kelas: string;
  jantina: Jantina;
  kaum: Kaum;
}

export interface CommitteeMember {
  id: string;
  studentId: string;
  jawatan: JawatanAJK;
}

export interface Attendance {
  id: string;
  tarikh: string;
  presents: string[]; // array of studentIds
}

export interface Activity {
  id: string;
  tarikh: string;
  masa: string;
  nama: string;
  tempat: string;
  ulasan: string;
}

export interface AnnualPlan {
  id: string;
  bulan: string;
  program: string;
  tempat: string;
  catatan: string;
}

export interface CloudSettings {
  sheetUrl: string;
  logoUrl?: string;
  autoSync: boolean;
  lastSync?: string;
}

export interface SystemData {
  teachers: Teacher[];
  students: Student[];
  committees: CommitteeMember[];
  attendances: Attendance[];
  activities: Activity[];
  annualPlans: AnnualPlan[];
  settings?: CloudSettings;
}

export type ReportType = 'AHLI' | 'AJK' | 'KEHADIRAN' | 'AKTIVITI';
