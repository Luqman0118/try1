import React, { useEffect, useState } from "react";

interface Student {
  id: number;
  username: string;
  email: string;
  nama_lengkap: string;
  prodi: string;
  skills: string[];
  is_active: boolean;
}

const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const adminToken = localStorage.getItem("admin_access");
  console.log("AdminDashboard rendered, adminToken:", adminToken);

  // Fetch semua mahasiswa
  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/accounts/admin/students/", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (!res.ok) throw new Error("Gagal mengambil data mahasiswa");
      const data = await res.json();
      setStudents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Toggle status aktif/nonaktif mahasiswa
  const toggleStudent = async (id: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/accounts/admin/students/${id}/toggle/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (!res.ok) throw new Error("Gagal mengubah status mahasiswa");
      // update local state
      setStudents(prev =>
        prev.map(s =>
          s.id === id ? { ...s, is_active: !s.is_active } : s
        )
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Dashboard Admin</h1>
        <p>Kelola data mahasiswa dan status akun mereka</p>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Username</th>
              <th>Email</th>
              <th>Prodi</th>
              <th>Skills</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.nama_lengkap}</td>
                <td>{student.username}</td>
                <td>{student.email}</td>
                <td>{student.prodi}</td>
                <td>{student.skills.join(", ")}</td>
                <td>
                  {student.is_active ? (
                    <span style={{ color: "green" }}>Aktif</span>
                  ) : (
                    <span style={{ color: "red" }}>Nonaktif</span>
                  )}
                </td>
                <td>
                  <button
                    style={{
                      ...styles.button,
                      background: student.is_active ? "#f87171" : "#34d399",
                    }}
                    onClick={() => toggleStudent(student.id)}
                  >
                    {student.is_active ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: 30,
    minHeight: "100vh",
    background: "#f4f6f8",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    marginBottom: 20,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    background: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  button: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
};

export default AdminDashboard;
