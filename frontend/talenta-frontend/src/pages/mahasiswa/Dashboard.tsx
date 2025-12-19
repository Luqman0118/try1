import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../services/profile";
import { getSkills } from "../../services/skill";
import { getExperiences } from "../../services/experience";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const { token } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    Promise.all([
      getProfile(token),
      getSkills(token),
      getExperiences(token),
    ])
      .then(([profileRes, skillRes, expRes]) => {
        setProfile(profileRes);
        setSkills(skillRes || []);
        setExperiences(expRes || []);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="loading">Loading dashboard...</p>;

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <img
          src={
            profile?.photo
              ? `http://127.0.0.1:8000${profile.photo}`
              : "/avatar.png"
          }
          alt="Profile"
        />
        <div>
          <h1>👋 Halo, {profile?.nama_lengkap}</h1>
          <p>{profile?.prodi} • {profile?.deskripsi}</p>
        </div>
      </div>

      {/* GRID */}
      <div className="dashboard-grid">
        {/* PROFILE */}
        <div className="card">
          <div className="card-header">
            <h3>📌 Profil</h3>
            <button onClick={() => navigate("/mahasiswa/profile")}>
              Edit
            </button>
          </div>
          <p><strong>Nama:</strong> {profile?.nama_lengkap}</p>
          <p><strong>Prodi:</strong> {profile?.prodi}</p>
          <p>{profile?.deskripsi}</p>
        </div>


        {/* SKILLS */}
        <div className="card">
          <div className="card-header">
            <h3>🧠 Skill</h3>
            <button onClick={() => navigate("/mahasiswa/skill")}>
              Kelola
            </button>
          </div>

          {skills.length === 0 && <p>Belum ada skill</p>}
          <ul className="skill-list">
            {skills.map((s) => (
              <li key={s.id}>{s.name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* EXPERIENCE */}
      <div className="card">
        <div className="card-header">
          <h3>💼 Pengalaman</h3>
          <button onClick={() => navigate("/mahasiswa/experience")}>
            Tambah
          </button>
        </div>
        {experiences.length === 0 && <p>Belum ada pengalaman</p>}
        <div className="experience-list">
          {experiences.map((e) => (
            <div key={e.id} className="experience-item">
              <h4>{e.title}</h4>
              <p>{e.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
