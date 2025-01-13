import React, { useState } from "react";
import axios from "axios";

const SearchWeddingDresses = () => {
  const [criteria, setCriteria] = useState({
    minPrice: "",
    maxPrice: "",
    dressLength: "",
    size: "",
  });

  const [filteredDresses, setFilteredDresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/WeddingDress/search", criteria);
      setFilteredDresses(response.data);
    } catch (err) {
      setError("An error occurred while fetching wedding dresses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Wedding Dresses</h1>
      <form>
        
        <div>
          <label>Dress Length:</label>
          <select name="dressLength" value={criteria.dressLength} onChange={handleInputChange}>
            <option value="">All</option>
            <option value="mini">Mini</option>
            <option value="midi">Midi</option>
            <option value="maxi">Maxi</option>
          </select>
        </div>
        <div>
          <label>Size:</label>
          <select name="size" value={criteria.size} onChange={handleInputChange}>
            <option value="">All</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </select>
        </div>
        <button type="button" onClick={handleSearch}>
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Filtered Results:</h2>
      <ul>
        {filteredDresses.map((dress) => (
          <li key={dress.id}>
            Price: {dress.price}, Length: {dress.dressLength}, Size: {dress.size}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchWeddingDresses;
