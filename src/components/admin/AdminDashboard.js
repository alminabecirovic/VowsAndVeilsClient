import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../pages/appointments-list.css"; // Koristi CSS iz appointments.css

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
      setError(""); // RESET error poruke ako je uspešan zahtev
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

  return (
    <div className="appointments-container">
     

      {loading && <p className="loading-message">Učitavanje korisnika...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && users.length === 0 && <p className="no-appointments">Nema dostupnih korisnika.</p>}

      {!loading && users.length > 0 && (
        <table className="appointments-table">
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
                <td>
                  {user.birthDate && !isNaN(new Date(user.birthDate).getTime())
                    ? new Date(user.birthDate).toLocaleDateString("sr-RS")
                    : "Nepoznat datum"}
                </td>
                <td>
                  <button className="delete-button" onClick={() => deleteUser(user.id)}>Obriši</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
