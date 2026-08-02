import { useEffect, useMemo, useState } from "react";
import AdminDashboard from "./components/AdminDashboard";
import CouponStore from "./components/CouponStore";
import EntriesTable from "./components/EntriesTable";
import LoginPanel from "./components/LoginPanel";
import MarkForm from "./components/MarkForm";
import MonthlyReport from "./components/MonthlyReport";
import MinisterDashboard from "./components/MinisterDashboard";
import PrincipalDashboard from "./components/PrincipalDashboard";
import SummaryCards from "./components/SummaryCards";
import { Coupon, MarkEntry, Redemption, Role, School, Student } from "./types";

const ENTRY_KEY = "student-rewards-entries-v2";
const REDEMPTION_KEY = "student-rewards-redemptions-v2";

const schools: School[] = [
  { id: "school-1", name: "Maple Grove Public School", district: "Peel District" },
  { id: "school-2", name: "Lakeside Academy", district: "Peel District" },
  { id: "school-3", name: "Cedar Valley School", district: "York District" },
  { id: "school-4", name: "Riverdale Public School", district: "York District" },
  { id: "school-5", name: "Grandview Academy", district: "Halton District" },
  { id: "school-6", name: "North Star School", district: "Halton District" },
  { id: "school-7", name: "Lake Ontario Public School", district: "Durham District" },
  { id: "school-8", name: "Meadowbrook Academy", district: "Durham District" },
];

const students: Student[] = [
  { id: "student-1", name: "Sanjeev", grade: "6", schoolId: "school-1" },
  { id: "student-2", name: "Aarav", grade: "6", schoolId: "school-1" },
  { id: "student-3", name: "Maya", grade: "7", schoolId: "school-2" },
  { id: "student-4", name: "Olivia", grade: "6", schoolId: "school-2" },
  { id: "student-5", name: "Noah", grade: "7", schoolId: "school-3" },
  { id: "student-6", name: "Ethan", grade: "6", schoolId: "school-3" },
  { id: "student-7", name: "Sophia", grade: "7", schoolId: "school-4" },
  { id: "student-8", name: "Liam", grade: "6", schoolId: "school-4" },
  { id: "student-9", name: "Emma", grade: "7", schoolId: "school-5" },
  { id: "student-10", name: "Lucas", grade: "6", schoolId: "school-5" },
  { id: "student-11", name: "Amelia", grade: "7", schoolId: "school-6" },
  { id: "student-12", name: "Benjamin", grade: "6", schoolId: "school-6" },
  { id: "student-13", name: "Charlotte", grade: "7", schoolId: "school-7" },
  { id: "student-14", name: "James", grade: "6", schoolId: "school-7" },
  { id: "student-15", name: "Harper", grade: "7", schoolId: "school-8" },
  { id: "student-16", name: "Henry", grade: "6", schoolId: "school-8" },
];

const coupons: Coupon[] = [
  { id: "coupon-1", retailer: "Indigo", title: "10% Off Books", description: "Save on an eligible book or educational item.", creditsRequired: 50, code: "READ10-DEMO", expiry: "2026-12-31" },
  { id: "coupon-2", retailer: "Staples", title: "$5 School Supplies Coupon", description: "Use toward eligible stationery and school supplies.", creditsRequired: 80, code: "LEARN5-DEMO", expiry: "2026-12-31" },
  { id: "coupon-3", retailer: "Sport Chek", title: "15% Off Sports Gear", description: "Discount on an eligible youth sports item.", creditsRequired: 120, code: "MOVE15-DEMO", expiry: "2026-12-31" },
  { id: "coupon-4", retailer: "Cineplex", title: "Movie Snack Discount", description: "Save on an eligible concession purchase.", creditsRequired: 150, code: "STAR-SNACK-DEMO", expiry: "2026-12-31" },
];

function load<T>(key: string, fallback: T): T { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } }

export default function App() {
  const [role, setRole] = useState<Role>("student");
  const [selectedStudentId, setSelectedStudentId] = useState(students[0].id);
  const [selectedSchoolId, setSelectedSchoolId] = useState(schools[0].id);
  const [entries, setEntries] = useState<MarkEntry[]>(() => load(ENTRY_KEY, []));
  const [redemptions, setRedemptions] = useState<Redemption[]>(() => load(REDEMPTION_KEY, []));

  useEffect(() => localStorage.setItem(ENTRY_KEY, JSON.stringify(entries)), [entries]);
  useEffect(() => localStorage.setItem(REDEMPTION_KEY, JSON.stringify(redemptions)), [redemptions]);

  const selectedStudent = students.find((student) => student.id === selectedStudentId) ?? students[0];
  const studentEntries = entries.filter((entry) => entry.studentId === selectedStudent.id);
  const earnedCredits = studentEntries.reduce((sum, entry) => sum + entry.credits, 0);
  const spentCredits = redemptions.filter((item) => item.studentId === selectedStudent.id).reduce((sum, item) => sum + item.creditsSpent, 0);
  const availableCredits = earnedCredits - spentCredits;
  const average = studentEntries.length ? studentEntries.reduce((sum, entry) => sum + entry.percentage, 0) / studentEntries.length : 0;
  const level = earnedCredits >= 200 ? "Gold" : earnedCredits >= 100 ? "Silver" : earnedCredits >= 50 ? "Bronze" : "Starter";
  const schoolEntries = useMemo(() => {
    const ids = new Set(students.filter((student) => student.schoolId === selectedSchoolId).map((student) => student.id));
    return entries.filter((entry) => ids.has(entry.studentId));
  }, [entries, selectedSchoolId]);

  function redeem(coupon: Coupon) {
    if (availableCredits < coupon.creditsRequired) return;
    setRedemptions((current) => [...current, { id: crypto.randomUUID(), studentId: selectedStudent.id, couponId: coupon.id, creditsSpent: coupon.creditsRequired, redeemedAt: new Date().toISOString() }]);
  }

  return <div className="app-shell">
    <header className="hero"><nav className="nav"><div className="brand"><div className="brand-icon">SR</div><div><strong>Student Rewards</strong><span>Learn • Earn • Achieve</span></div></div><span className="demo-label">Role-based School Demo</span></nav><div className="hero-content"><p className="eyebrow light">Student Achievement Platform</p><h1>Individual progress, meaningful rewards, stronger schools.</h1><p>Students earn credits from marks, redeem retail discount coupons, and receive monthly performance reports. Principals monitor individual students while administrators compare schools and the State Minister ranks district performance.</p></div></header>
    <main className="container">
      <LoginPanel role={role} setRole={setRole} selectedStudentId={selectedStudentId} setSelectedStudentId={setSelectedStudentId} selectedSchoolId={selectedSchoolId} setSelectedSchoolId={setSelectedSchoolId} students={students} schools={schools} />

      {role === "student" && <>
        <div className="student-banner"><div><span>Student Dashboard</span><h2>{selectedStudent.name}</h2><p>Grade {selectedStudent.grade} • {schools.find((school) => school.id === selectedStudent.schoolId)?.name}</p></div><div className="wallet-large"><span>Credit Wallet</span><strong>{availableCredits}</strong><small>{spentCredits} credits redeemed</small></div></div>
        <SummaryCards totalCredits={earnedCredits} totalEntries={studentEntries.length} averagePercentage={average} currentReward={level} />
        <div className="two-column"><MarkForm onAdd={(entry) => setEntries((current) => [...current, entry])} students={students} fixedStudentId={selectedStudent.id} /><div className="panel"><p className="eyebrow">How Credits Work</p><h2>Performance Credit Rules</h2><div className="rule-list"><span>90–100% <strong>20 credits</strong></span><span>80–89% <strong>15 credits</strong></span><span>70–79% <strong>10 credits</strong></span><span>60–69% <strong>5 credits</strong></span><span>Below 60% <strong>0 credits</strong></span></div></div></div>
        <CouponStore studentId={selectedStudent.id} availableCredits={availableCredits} coupons={coupons} redemptions={redemptions} onRedeem={redeem} />
        <MonthlyReport entries={studentEntries} students={students} title={`${selectedStudent.name}'s Monthly Report`} />
        <EntriesTable entries={studentEntries} students={students} onDelete={(id) => setEntries((current) => current.filter((entry) => entry.id !== id))} title={`${selectedStudent.name}'s Results`} />
      </>}

      {role === "principal" && <>
        <PrincipalDashboard students={students} entries={entries} redemptions={redemptions} schoolId={selectedSchoolId} />
        <MarkForm onAdd={(entry) => setEntries((current) => [...current, entry])} students={students.filter((student) => student.schoolId === selectedSchoolId)} />
        <MonthlyReport entries={schoolEntries} students={students} title="School Monthly Student Report" />
        <EntriesTable entries={schoolEntries} students={students} onDelete={(id) => setEntries((current) => current.filter((entry) => entry.id !== id))} />
      </>}

      {role === "administrator" && <>
        <AdminDashboard schools={schools} students={students} entries={entries} redemptions={redemptions} />
        <MonthlyReport entries={entries} students={students} title="District Monthly Report" />
      </>}

      {role === "minister" && <MinisterDashboard schools={schools} students={students} entries={entries} />}
    </main>
    <footer>Student Rewards Program • Demo retail coupons are placeholders and require retailer agreements before real use.</footer>
  </div>;
}
