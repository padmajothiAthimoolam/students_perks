import { FormEvent, useState } from "react";
import { MarkEntry, Student } from "../types";
import { calculateCredits, calculatePercentage } from "../utils/credits";

type Props = { onAdd: (entry: MarkEntry) => void; students: Student[]; fixedStudentId?: string };

export default function MarkForm({ onAdd, students, fixedStudentId }: Props) {
  const [studentId, setStudentId] = useState(fixedStudentId ?? students[0]?.id ?? "");
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");
  const [maximumMarks, setMaximumMarks] = useState("100");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const activeStudentId = fixedStudentId ?? studentId;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const numericMarks = Number(marks);
    const numericMaximum = Number(maximumMarks);
    if (!activeStudentId || !subject.trim()) return setError("Please select a student and enter a subject.");
    if (Number.isNaN(numericMarks) || Number.isNaN(numericMaximum) || numericMarks < 0 || numericMaximum <= 0 || numericMarks > numericMaximum) return setError("Enter valid marks. Marks cannot exceed the maximum.");
    onAdd({ id: crypto.randomUUID(), studentId: activeStudentId, subject: subject.trim(), marks: numericMarks, maximumMarks: numericMaximum, percentage: calculatePercentage(numericMarks, numericMaximum), credits: calculateCredits(numericMarks, numericMaximum), date });
    setSubject(""); setMarks(""); setError("");
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div className="panel-heading"><div><p className="eyebrow">Add Result</p><h2>Enter Student Marks</h2></div></div>
      {!fixedStudentId && <label>Student<select value={studentId} onChange={(event) => setStudentId(event.target.value)}>{students.map((student) => <option key={student.id} value={student.id}>{student.name} — Grade {student.grade}</option>)}</select></label>}
      <label>Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="e.g. Mathematics" /></label>
      <label>Marks Earned<input type="number" min="0" value={marks} onChange={(event) => setMarks(event.target.value)} placeholder="85" /></label>
      <label>Maximum Marks<input type="number" min="1" value={maximumMarks} onChange={(event) => setMaximumMarks(event.target.value)} /></label>
      <label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
      {error && <p className="error-message">{error}</p>}
      <button className="primary-button" type="submit">Add Marks and Credits</button>
    </form>
  );
}
