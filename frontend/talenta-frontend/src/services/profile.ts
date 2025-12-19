// src/services/profile.ts
const API_URL = "http://127.0.0.1:8000/api/accounts";

// =======================
// GET PROFILE
// =======================
export const getProfile = async (token: string) => {
  const res = await fetch(`${API_URL}/profile/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return res.json();
};

// =======================
// SAVE PROFILE (JSON)
// =======================
export const saveProfile = async (
  data: {
    nim: string;
    nama_lengkap: string;
    prodi: string;
    deskripsi: string;
  },
  token: string
) => {
  const res = await fetch(`${API_URL}/profile/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return res.json();
};

// =======================
// UPLOAD PROFILE (FORMDATA)
// =======================
export const uploadProfile = async (
  data: FormData,
  token: string
) => {
  const res = await fetch(`${API_URL}/profile/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return res.json();
};

// =======================
// DOWNLOAD CV
// =======================
export const downloadCV = (token: string) => {
  fetch(`${API_URL}/cv/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Gagal download CV");
      return res.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CV_Mahasiswa.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((err) => {
      console.error(err);
      alert("Gagal download CV");
    });
};
