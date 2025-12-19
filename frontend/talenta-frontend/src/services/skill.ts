const API_URL = "http://127.0.0.1:8000/api/accounts/skills/";

export const getSkills = async (token: string) => {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const addSkill = async (data: { name: string }, token: string) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
