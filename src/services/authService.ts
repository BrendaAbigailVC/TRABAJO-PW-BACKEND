
const BASE_URL = "http://localhost:5000/api";

export const AuthService = {
  register: async (email: string, password: string, username: string) => {
    const res = await fetch(`${BASE_URL}/usuarios/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });
    return res.json();
  },

  verifyCode: async (email: string, codigo: string) => {
    const res = await fetch(`${BASE_URL}/usuarios/verificar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, codigo }),
    });
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

     const contentType = res.headers.get("Content-Type");
    if (!contentType?.includes("application/json")) {
      const text = await res.text(); // para depurar
      console.error("Respuesta no JSON del servidor:", text);
      throw new Error("Respuesta inesperada del servidor");
    }
    
    return res.json();
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isLoggedIn: () => {
    return !!localStorage.getItem("token");
  },
};
