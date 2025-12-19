import { useState } from "react";
import { login, register } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const Auth = () => {
  const { login: authLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // tambahan
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isRegister) {
        await register({ username, email, password }); // kirim email
        // show success message and switch back to login view
        setSuccess("Registrasi berhasil, silakan login");
        setIsRegister(false);
      } else {
        const res = await login({ username, password });
        authLogin(res.access);
        localStorage.setItem("student_access", res.access);
        localStorage.setItem("student_refresh", res.refresh);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(
        isRegister ? "Registrasi gagal" : "Username atau password salah"
      );
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>{isRegister ? "Registrasi Mahasiswa" : "Login Mahasiswa"}</h2>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="auth-input"
        />

        {isRegister && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />

        <button type="submit" className="auth-button">
          {isRegister ? "Daftar" : "Login"}
        </button>

        <p className="auth-switch">
          {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <span
            className="auth-link"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Daftar"}
          </span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },
  card: {
    width: 320,
    padding: 30,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
  },
  input: {
    padding: 10,
    fontSize: 14,
  },
  button: {
    padding: 10,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: 13,
  },
  success: {
    color: "green",
    fontSize: 13,
  },
  switch: {
    fontSize: 13,
    textAlign: "center" as const,
  },
  link: {
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default Auth;
