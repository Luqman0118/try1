const API_URL = "http://127.0.0.1:8000/api/accounts";

interface AuthData {
  username: string;
  password: string;
}

interface RegisterData extends AuthData {
  email: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

// Fungsi login (tetap sama)
export const login = async (data: AuthData): Promise<LoginResponse> => {
  const res = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Login gagal");
  }

  return res.json();
};

// Fungsi register (tambahkan email)
export const register = async (data: RegisterData): Promise<void> => {
  const res = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Registrasi gagal");
  }
};
