export type Role = "student" | "principal" | "administrator" | "minister";

export type Student = {
  id: string;
  name: string;
  grade: string;
  schoolId: string;
};

export type School = {
  id: string;
  name: string;
  district: string;
};

export type MarkEntry = {
  id: string;
  studentId: string;
  subject: string;
  marks: number;
  maximumMarks: number;
  percentage: number;
  credits: number;
  date: string;
};

export type Coupon = {
  id: string;
  retailer: string;
  title: string;
  description: string;
  creditsRequired: number;
  code: string;
  expiry: string;
};

export type Redemption = {
  id: string;
  studentId: string;
  couponId: string;
  creditsSpent: number;
  redeemedAt: string;
};
