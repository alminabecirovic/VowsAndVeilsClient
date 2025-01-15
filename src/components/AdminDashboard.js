import React, { useEffect, useState } from "react";
import axios from "axios";


axios.defaults.baseURL = "https://localhost:7042"; 
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dohvatanje korisnika sa backend-a
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/Admin/users"); 
      setUsers(response.data);
    } catch (err) {
      setError("Greška pri dohvatanju korisnika.");
    } finally {
      setLoading(false);
    }
  };

  // Brisanje korisnika
  const deleteUser = async (userId) => {
    if (window.confirm("Da li ste sigurni da želite obrisati korisnika?")) {
      try {
        await axios.delete(`/api/Admin/users/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
        alert("Korisnik je uspešno obrisan.");
      } catch (err) {
        alert("Greška pri brisanju korisnika.");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Učitavanje korisnika...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Lista korisnika</h1>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Email</th>
            <th>Korisničko ime</th>
            <th>Datum rođenja</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{new Date(user.birthDate).toLocaleDateString()}</td>
              <td>
                <button onClick={() => deleteUser(user.id)}>Obriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;