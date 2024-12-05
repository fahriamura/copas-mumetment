import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  fetchTemplates,
  deleteTemplate,
  confirmTemplate,
  addTemplate,
} from "../../utils/api";

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [teks, setTeks] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const authKey = typeof window !== "undefined" ? localStorage.getItem("authKey") : null;

  useEffect(() => {
    if (!authKey) {
      router.push("/admin");
    } else {
      fetchTemplatesData();
    }
  }, []);

  const fetchTemplatesData = async () => {
    try {
      const { data } = await fetchTemplates(authKey!);
      setTemplates(data.data);
    } catch {
      setError("Gagal memuat template.");
    }
  };

  const handleDelete = async (id: number) => {
    await deleteTemplate(id, authKey!);
    fetchTemplatesData();
  };

  const handleConfirm = async (id: number) => {
    await confirmTemplate(id, authKey!);
    fetchTemplatesData();
  };

  const handleAdd = async () => {
    if (!teks) return alert("Teks tidak boleh kosong");
    await addTemplate(teks, authKey!);
    setTeks("");
    fetchTemplatesData();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Template Management</h1>
      <div>
        <input
          type="text"
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          placeholder="Teks baru"
          style={{ marginRight: "10px", padding: "10px" }}
        />
        <button onClick={handleAdd} style={{ padding: "10px 20px" }}>
          Add Template
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border={1} style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Teks</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template.id}>
              <td>{template.id}</td>
              <td>{template.teks}</td>
              <td>{template.status}</td>
              <td>
                <button onClick={() => handleDelete(template.id)}>Delete</button>
                <button onClick={() => handleConfirm(template.id)}>Confirm</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TemplatesPage;
