import { MarkEntry, Redemption, Student } from "../types";

type Props = {
  students: Student[];
  entries: MarkEntry[];
  redemptions: Redemption[];
  schoolId: string;
};

export default function PrincipalDashboard({ students, entries, redemptions, schoolId }: Props) {
  const rows = students
    .filter((student) => student.schoolId === schoolId)
    .map((student) => {
      const studentEntries = entries.filter((entry) => entry.studentId === student.id);
      const earned = studentEntries.reduce((sum, entry) => sum + entry.credits, 0);
      const spent = redemptions.filter((item) => item.studentId === student.id).reduce((sum, item) => sum + item.creditsSpent, 0);
      const average = studentEntries.length ? studentEntries.reduce((sum, entry) => sum + entry.percentage, 0) / studentEntries.length : 0;
      return { student, earned, spent, available: earned - spent, average, results: studentEntries.length };
    })
    .sort((a, b) => b.earned - a.earned);

  return (
    <section className="panel">
      <div className="panel-heading">
        <div><p className="eyebrow">Principal Dashboard</p><h2>Individual Student Progress</h2></div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Student</th><th>Grade</th><th>Results</th><th>Average</th><th>Earned</th><th>Spent</th><th>Available</th></tr></thead>
          <tbody>
            {rows.map(({ student, earned, spent, available, average, results }, index) => (
              <tr key={student.id}>
                <td><strong>#{index + 1} {student.name}</strong></td>
                <td>{student.grade}</td><td>{results}</td><td>{average.toFixed(1)}%</td>
                <td>{earned}</td><td>{spent}</td><td><span className="credit-badge">{available}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
