import { Role, School, Student } from "../types";

type Props = {
  role: Role;
  setRole: (role: Role) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  selectedSchoolId: string;
  setSelectedSchoolId: (id: string) => void;
  students: Student[];
  schools: School[];
};

export default function LoginPanel({
  role,
  setRole,
  selectedStudentId,
  setSelectedStudentId,
  selectedSchoolId,
  setSelectedSchoolId,
  students,
  schools,
}: Props) {
  const schoolStudents = students.filter((student) => student.schoolId === selectedSchoolId);

  return (
    <section className="panel login-panel">
      <div>
        <p className="eyebrow">Demo Login</p>
        <h2>Choose a user role</h2>
        <p className="muted">This starter uses role switching for demonstration. Production authentication should use secure accounts.</p>
      </div>

      <label>
        Login As
        <select value={role} onChange={(event) => setRole(event.target.value as Role)}>
          <option value="student">Student</option>
          <option value="principal">School Principal</option>
          <option value="administrator">District Administrator</option>
          <option value="minister">State Minister</option>
        </select>
      </label>

      {(role === "principal" || role === "administrator") && (
        <label>
          School
          <select value={selectedSchoolId} onChange={(event) => setSelectedSchoolId(event.target.value)}>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>{school.name}</option>
            ))}
          </select>
        </label>
      )}

      {role === "student" && (
        <label>
          Student
          <select value={selectedStudentId} onChange={(event) => setSelectedStudentId(event.target.value)}>
            {students.map((student) => (
              <option key={student.id} value={student.id}>{student.name} — Grade {student.grade}</option>
            ))}
          </select>
        </label>
      )}

      {role === "principal" && (
        <div className="login-summary">
          <strong>{schoolStudents.length}</strong>
          <span>students available in principal view</span>
        </div>
      )}
    </section>
  );
}
