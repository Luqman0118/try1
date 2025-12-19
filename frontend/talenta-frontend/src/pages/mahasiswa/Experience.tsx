import { useEffect, useState } from "react";
import { getExperiences, addExperience } from "../../services/experience";
import { useAuth } from "../../context/AuthContext";

interface Experience {
  id: number;
  title: string;
  description: string;
}

export default function Experience() {
  const { token } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [form, setForm] = useState({ title: "", description: "" });

  useEffect(() => {
    if (token) {
      getExperiences(token).then(setExperiences);
    }
  }, [token]);

  const handleAdd = async () => {
    if (!token) return;
    const newExp = await addExperience(form, token);
    setExperiences([...experiences, newExp]);
    setForm({ title: "", description: "" });
  };

  return (
    <div>
      <h2>Pengalaman</h2>

      <input
        placeholder="Judul pengalaman"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Deskripsi"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <button onClick={handleAdd}>Tambah</button>

      <ul>
        {experiences.map((exp) => (
          <li key={exp.id}>
            <b>{exp.title}</b>
            <p>{exp.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
