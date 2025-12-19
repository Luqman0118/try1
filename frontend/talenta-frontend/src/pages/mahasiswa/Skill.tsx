import { useEffect, useState } from "react";
import { getSkills, addSkill } from "../../services/skill";
import { useAuth } from "../../context/AuthContext";

interface Skill {
  id: number;
  name: string;
}

export default function Skill() {
  const { token } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    if (token) {
      getSkills(token).then(setSkills);
    }
  }, [token]);

  const handleAdd = async () => {
    if (!name || !token) return;
    const newSkill = await addSkill({ name }, token);
    setSkills([...skills, newSkill]);
    setName("");
  };

  return (
    <div>
      <h2>Skill Mahasiswa</h2>

      <input
        placeholder="Nama skill"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAdd}>Tambah</button>

      <ul>
        {skills.map((skill) => (
          <li key={skill.id}>{skill.name}</li>
        ))}
      </ul>
    </div>
  );
}
