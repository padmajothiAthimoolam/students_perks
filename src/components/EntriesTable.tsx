import { MarkEntry, Student } from "../types";
type Props = { entries: MarkEntry[]; students: Student[]; onDelete: (id: string) => void; title?: string };
export default function EntriesTable({ entries, students, onDelete, title = "Recent Mark Entries" }: Props) {
  const names = Object.fromEntries(students.map((student) => [student.id, student.name]));
  return <section className="panel"><div className="panel-heading"><div><p className="eyebrow">Activity</p><h2>{title}</h2></div></div>{entries.length === 0 ? <p className="empty-state">No marks have been entered yet.</p> : <div className="table-wrap"><table><thead><tr><th>Date</th><th>Student</th><th>Subject</th><th>Score</th><th>Percentage</th><th>Credits</th><th></th></tr></thead><tbody>{[...entries].reverse().map((entry) => <tr key={entry.id}><td>{entry.date}</td><td>{names[entry.studentId] ?? "Student"}</td><td>{entry.subject}</td><td>{entry.marks}/{entry.maximumMarks}</td><td>{entry.percentage}%</td><td><span className="credit-badge">+{entry.credits}</span></td><td><button className="delete-button" onClick={() => onDelete(entry.id)}>Delete</button></td></tr>)}</tbody></table></div>}</section>;
}
