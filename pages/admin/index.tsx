import { useState } from "react";
import { useRouter } from "next/router";
import { loginAdmin } from "../../utils/api";

const AdminLogin = () => {
  const [authKey, setAuthKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await loginAdmin(authKey);
      localStorage.setItem("authKey", authKey);
      router.push("/admin/templates");
    } catch {
      setError("Kunci otorisasi salah.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Admin Login</h1>
      <input
        type="password"
        value={authKey}
        onChange={(e) => setAuthKey(e.target.value)}
        placeholder="Masukkan kunci otorisasi"
        style={{ padding: "10px", margin: "10px" }}
      />
      <button onClick={handleLogin} style={{ padding: "10px 20px" }}>
        Login
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AdminLogin;
