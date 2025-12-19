import { useEffect, useState } from "react";
import {
  getProfile,
  saveProfile,
  uploadProfile,
  downloadCV,
} from "../../services/profile";
import { useAuth } from "../../context/AuthContext";

// =======================
// INTERFACE
// =======================
interface ProfileData {
  nim: string;
  nama_lengkap: string;
  prodi: string;
  deskripsi: string;
  photo?: string;
  created_at?: string;
  updated_at?: string;
}

export default function Profile() {
  const { token } = useAuth();

  // =======================
  // STATE
  // =======================
  const [profile, setProfile] = useState<ProfileData>({
    nim: "",
    nama_lengkap: "",
    prodi: "",
    deskripsi: "",
    photo: "",
  });

  const [loading, setLoading] = useState(true);

  // =======================
  // GET PROFILE
  // =======================
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile(token);
        if (data) {
          setProfile({
            nim: data.nim || "",
            nama_lengkap: data.nama_lengkap || "",
            prodi: data.prodi || "",
            deskripsi: data.deskripsi || "",
            photo: data.photo || "",
            created_at: data.created_at,
            updated_at: data.updated_at,
          });
        }
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // =======================
  // HANDLE INPUT
  // =======================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // =======================
  // SAVE PROFILE
  // =======================
  const handleSubmit = async () => {
    if (!token) {
      alert("Token tidak ditemukan, silakan login ulang");
      return;
    }

    console.log("Token:", token);
    console.log("Data to save:", {
      nim: profile.nim,
      nama_lengkap: profile.nama_lengkap,
      prodi: profile.prodi,
      deskripsi: profile.deskripsi,
    });

    try {
      await saveProfile(
        {
          nim: profile.nim,
          nama_lengkap: profile.nama_lengkap,
          prodi: profile.prodi,
          deskripsi: profile.deskripsi,
        },
        token
      );

      const freshProfile = await getProfile(token);
      setProfile(freshProfile);

      alert("Profil berhasil disimpan");
    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
      alert(`Gagal menyimpan profil: ${JSON.stringify(error)}`);
    }
  };

  // =======================
  // UPLOAD FOTO
  // =======================
  const handleUploadPhoto = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !token) return;

    try {
      const formData = new FormData();
      formData.append("nim", profile.nim);
      formData.append("nama_lengkap", profile.nama_lengkap);
      formData.append("prodi", profile.prodi);
      formData.append("deskripsi", profile.deskripsi);
      formData.append("photo", e.target.files[0]);

      await uploadProfile(formData, token);

      const freshProfile = await getProfile(token);
      setProfile(freshProfile);
    } catch (error) {
      console.error("Gagal upload foto:", error);
      alert("Gagal upload foto");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  // =======================
  // RENDER
  // =======================
  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Profil Mahasiswa</h2>

      {profile.photo && (
        <>
          <img
            src={`http://127.0.0.1:8000${profile.photo}`}
            width={150}
            style={{ borderRadius: "10px" }}
          />
          <br /><br />
        </>
      )}

      <input
        name="nim"
        placeholder="NIM"
        value={profile.nim}
        onChange={handleChange}
        readOnly={!!profile.nim}
      />

      <br /><br />

      <input
        name="nama_lengkap"
        placeholder="Nama Lengkap"
        value={profile.nama_lengkap}
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="prodi"
        placeholder="Program Studi"
        value={profile.prodi}
        onChange={handleChange}
      />

      <br /><br />

      <textarea
        name="deskripsi"
        placeholder="Deskripsi singkat"
        value={profile.deskripsi}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="file"
        accept="image/*"
        onChange={handleUploadPhoto}
      />

      <br /><br />

      <button onClick={handleSubmit}>Simpan Profil</button>

      <button
        style={{ marginLeft: 10 }}
        onClick={() => downloadCV(token!)}
      >
        Download CV (PDF)
      </button>

      {profile.created_at && (
        <p style={{ marginTop: 20 }}>
          <small>
            Dibuat: {new Date(profile.created_at).toLocaleString()}
            <br />
            Terakhir diubah:{" "}
            {profile.updated_at &&
              new Date(profile.updated_at).toLocaleString()}
          </small>
        </p>
      )}
    </div>
  );
}
