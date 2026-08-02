import { useMemo, useState } from "react";
import { MarkEntry, School, Student } from "../types";

type Props = {
  schools: School[];
  students: Student[];
  entries: MarkEntry[];
};

export default function MinisterDashboard({ schools, students, entries }: Props) {
  const [selectedMonth, setSelectedMonth] = useState("");

  const districtRows = useMemo(() => {
    const filteredEntries = selectedMonth
      ? entries.filter((entry) => entry.date.startsWith(selectedMonth))
      : entries;

    const districtNames = [...new Set(schools.map((school) => school.district))];

    return districtNames
      .map((district) => {
        const districtSchools = schools.filter((school) => school.district === district);
        const schoolRows = districtSchools.map((school) => {
          const schoolStudentIds = new Set(
            students.filter((student) => student.schoolId === school.id).map((student) => student.id)
          );
          const schoolEntries = filteredEntries.filter((entry) => schoolStudentIds.has(entry.studentId));
          const average = schoolEntries.length
            ? schoolEntries.reduce((sum, entry) => sum + entry.percentage, 0) / schoolEntries.length
            : 0;

          return {
            school,
            average,
            results: schoolEntries.length,
            students: schoolStudentIds.size,
          };
        });

        const schoolsWithResults = schoolRows.filter((row) => row.results > 0);
        const districtAverage = schoolsWithResults.length
          ? schoolsWithResults.reduce((sum, row) => sum + row.average, 0) / schoolsWithResults.length
          : 0;
        const totalResults = schoolRows.reduce((sum, row) => sum + row.results, 0);
        const totalStudents = schoolRows.reduce((sum, row) => sum + row.students, 0);
        const topSchool = [...schoolRows].sort((a, b) => b.average - a.average)[0];

        return {
          district,
          average: districtAverage,
          schoolCount: districtSchools.length,
          totalResults,
          totalStudents,
          topSchool,
          schoolRows: [...schoolRows].sort((a, b) => b.average - a.average),
        };
      })
      .sort((a, b) => b.average - a.average);
  }, [entries, schools, selectedMonth, students]);

  const stateAverage = districtRows.length
    ? districtRows.reduce((sum, row) => sum + row.average, 0) / districtRows.length
    : 0;
  const topDistrict = districtRows[0];
  const maxAverage = Math.max(...districtRows.map((row) => row.average), 1);

  function downloadCsv() {
    const rows = [
      ["Rank", "District", "District Average", "Schools", "Students", "Results", "Top School", "Top School Average"],
      ...districtRows.map((row, index) => [
        index + 1,
        row.district,
        row.average.toFixed(1),
        row.schoolCount,
        row.totalStudents,
        row.totalResults,
        row.topSchool?.school.name ?? "No data",
        row.topSchool?.average.toFixed(1) ?? "0.0",
      ]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `state-district-performance-${selectedMonth || "all-time"}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <section className="minister-banner">
        <div>
          <p className="eyebrow light">State Minister Login</p>
          <h2>District Performance Overview</h2>
          <p>Districts are ranked by the average performance of schools with submitted results.</p>
        </div>
        <div className="minister-controls">
          <label>
            Report Month
            <input type="month" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} />
          </label>
          <button className="secondary-button" onClick={downloadCsv}>Download District Report</button>
        </div>
      </section>

      <div className="summary-grid minister-summary">
        <article className="summary-card"><span>Top District</span><strong>{topDistrict?.district ?? "No data"}</strong></article>
        <article className="summary-card"><span>Top District Average</span><strong>{topDistrict?.average.toFixed(1) ?? "0.0"}%</strong></article>
        <article className="summary-card"><span>State Average</span><strong>{stateAverage.toFixed(1)}%</strong></article>
        <article className="summary-card"><span>Districts Compared</span><strong>{districtRows.length}</strong></article>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div><p className="eyebrow">State Ranking</p><h2>Best-Performing Districts</h2></div>
        </div>
        <div className="district-grid">
          {districtRows.map((row, index) => (
            <article className={`district-card ${index === 0 ? "district-winner" : ""}`} key={row.district}>
              <div className="district-rank">#{index + 1}</div>
              <h3>{row.district}</h3>
              <strong className="district-average">{row.average.toFixed(1)}%</strong>
              <p>Average of school performance</p>
              <div className="district-metrics">
                <span>{row.schoolCount} schools</span>
                <span>{row.totalStudents} students</span>
                <span>{row.totalResults} results</span>
              </div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${(row.average / maxAverage) * 100}%` }} /></div>
              <div className="top-school-line">
                <span>Top school</span>
                <strong>{row.topSchool?.school.name ?? "No results"}</strong>
                <small>{row.topSchool?.average.toFixed(1) ?? "0.0"}% average</small>
              </div>
              <details>
                <summary>View schools</summary>
                <div className="minister-school-list">
                  {row.schoolRows.map((schoolRow, schoolIndex) => (
                    <div key={schoolRow.school.id}>
                      <span>{schoolIndex + 1}. {schoolRow.school.name}</span>
                      <strong>{schoolRow.average.toFixed(1)}%</strong>
                    </div>
                  ))}
                </div>
              </details>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
