import { useMemo, useState } from "react";
import { MarkEntry, Student } from "../types";

type Props = { entries: MarkEntry[]; students: Student[]; title?: string };

export default function MonthlyReport({ entries, students, title = "Credits and Performance" }: Props) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const reportEntries = useMemo(() => entries.filter((entry) => entry.date.startsWith(selectedMonth)), [entries, selectedMonth]);
  const totalCredits = reportEntries.reduce((sum, entry) => sum + entry.credits, 0);
  const average = reportEntries.length ? reportEntries.reduce((sum, entry) => sum + entry.percentage, 0) / reportEntries.length : 0;
  const studentNames = Object.fromEntries(students.map((student) => [student.id, student.name]));

  const studentSummary = Object.values(reportEntries.reduce<Record<string, { studentId: string; entries: number; credits: number; average: number }>>((acc, entry) => {
    const current = acc[entry.studentId] ?? { studentId: entry.studentId, entries: 0, credits: 0, average: 0 };
    current.average = (current.average * current.entries + entry.percentage) / (current.entries + 1);
    current.entries += 1; current.credits += entry.credits; acc[entry.studentId] = current; return acc;
  }, {}));

  function downloadCsv() {
    const rows = [["Date", "Student", "Subject", "Marks", "Maximum", "Percentage", "Credits"], ...reportEntries.map((entry) => [entry.date, studentNames[entry.studentId] ?? "Student", entry.subject, entry.marks, entry.maximumMarks, entry.percentage, entry.credits])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `student-rewards-report-${selectedMonth}.csv`; anchor.click(); URL.revokeObjectURL(url);
  }

  return <section className="panel">
    <div className="panel-heading report-heading"><div><p className="eyebrow">Monthly Report</p><h2>{title}</h2></div><div className="report-actions"><input type="month" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} /><button className="secondary-button" onClick={downloadCsv} disabled={!reportEntries.length}>Download CSV</button></div></div>
    <div className="report-summary"><div><span>Entries</span><strong>{reportEntries.length}</strong></div><div><span>Credits Earned</span><strong>{totalCredits}</strong></div><div><span>Average Score</span><strong>{average.toFixed(1)}%</strong></div></div>
    {!studentSummary.length ? <p className="empty-state">No results are available for this month.</p> : <div className="subject-grid">{studentSummary.map((item) => <article className="subject-card" key={item.studentId}><h3>{studentNames[item.studentId] ?? "Student"}</h3><p>{item.entries} result(s)</p><strong>{item.credits} credits</strong><span>Average: {item.average.toFixed(1)}%</span></article>)}</div>}
  </section>;
}
