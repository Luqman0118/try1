import { useEffect, useState } from "react";
import TalentCard from "./components/TalentCard";
import FilterBar from "./components/FilterBar";
import StudentList from "./components/StudentList";
import "./DashboardPengunjung.css";

// Interface tipe data Talent
interface Talent {
  id: number;
  name: string;
  prodi: string;
  skills: string[];
  email: string;
  linkedin?: string;
  github?: string;
  created_at: string;
}

const DashboardPengunjung: React.FC = () => {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [displayedTalents, setDisplayedTalents] = useState<Talent[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filterProdi, setFilterProdi] = useState<string>("");
  const [filterSkill, setFilterSkill] = useState<string>("");
  const [selected, setSelected] = useState<Talent | null>(null);

  useEffect(() => {
    // Fetch data mahasiswa publik dari backend
    fetch("http://127.0.0.1:8000/api/accounts/")
      .then(res => res.json())
      .then((data: Talent[]) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setTalents(sorted);
        setDisplayedTalents(sorted);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = () => {
    const filtered = talents
      .filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
      .filter(t => filterProdi === "" || t.prodi.toLowerCase().includes(filterProdi.toLowerCase()))
      .filter(t => filterSkill === "" || t.skills.some(s => s.toLowerCase().includes(filterSkill.toLowerCase())));
    const sorted = filtered.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    setDisplayedTalents(sorted);
  };

  const latestTalents = [...talents]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="dashboard-pengunjung">
      <header className="dashboard-header">
        <h1>Talenta Publik</h1>
        <p>Jelajahi talenta mahasiswa, temukan skill, dan hubungi mereka.</p>
      </header>

      {/* Talenta Terbaru */}
      <section>
        <h2>Talenta Terbaru</h2>
        <div className="talent-grid">
          {latestTalents.map(t => (
            <TalentCard key={t.id} {...t} onClick={() => setSelected(t)} />
          ))}
        </div>
      </section>

      {/* Filter Bar */}
      <section>
        <h2>Daftar Talenta</h2>
        <FilterBar
          search={search}
          setSearch={setSearch}
          filterProdi={filterProdi}
          setFilterProdi={setFilterProdi}
          filterSkill={filterSkill}
          setFilterSkill={setFilterSkill}
        />
        <button
          onClick={handleSearch}
          style={{
            marginTop: 8,
            padding: "6px 12px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Cari
        </button>

        {/* Student List Table */}
        <StudentList talents={displayedTalents} />

        {/* Daftar Talenta */}
        <div className="talent-grid">
          {displayedTalents.map(t => (
            <TalentCard key={t.id} {...t} onClick={() => setSelected(t)} />
          ))}
        </div>
      </section>

      {/* Modal Detail */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            <h3>{selected.name}</h3>
            <p><strong>Prodi:</strong> {selected.prodi}</p>
            <p><strong>Skills:</strong> {selected.skills.join(", ") || "-"}</p>
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${selected.email}`}>{selected.email}</a>
            </p>
            {selected.linkedin && (
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a href={selected.linkedin} target="_blank" rel="noopener noreferrer">Profile</a>
              </p>
            )}
            {selected.github && (
              <p>
                <strong>GitHub:</strong>{" "}
                <a href={selected.github} target="_blank" rel="noopener noreferrer">Repo</a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPengunjung;
