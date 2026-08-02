import { MarkEntry, Redemption, School, Student } from "../types";

type Props = { schools: School[]; students: Student[]; entries: MarkEntry[]; redemptions: Redemption[] };

export default function AdminDashboard({ schools, students, entries, redemptions }: Props) {
  const rows = schools.map((school) => {
    const schoolStudents = students.filter((student) => student.schoolId === school.id);
    const ids = new Set(schoolStudents.map((student) => student.id));
    const schoolEntries = entries.filter((entry) => ids.has(entry.studentId));
    const credits = schoolEntries.reduce((sum, entry) => sum + entry.credits, 0);
    const coupons = redemptions.filter((item) => ids.has(item.studentId)).length;
    const average = schoolEntries.length ? schoolEntries.reduce((sum, entry) => sum + entry.percentage, 0) / schoolEntries.length : 0;
    return { school, students: schoolStudents.length, results: schoolEntries.length, credits, coupons, average };
  }).sort((a, b) => b.credits - a.credits);

  const maxCredits = Math.max(...rows.map((row) => row.credits), 1);

  return (
    <section className="panel">
      <div className="panel-heading"><div><p className="eyebrow">Administration Login</p><h2>School Progress Comparison</h2></div></div>
      <div className="school-grid">
        {rows.map(({ school, students: count, results, credits, coupons, average }, index) => (
          <article className="school-card" key={school.id}>
            <div className="school-rank">#{index + 1}</div>
            <h3>{school.name}</h3><p>{school.district}</p>
            <div className="school-metrics"><span>{count} students</span><span>{results} results</span><span>{average.toFixed(1)}% average</span><span>{coupons} coupons</span></div>
            <strong>{credits} credits earned</strong>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${(credits / maxCredits) * 100}%` }} /></div>
          </article>
        ))}
      </div>
    </section>
  );
}
