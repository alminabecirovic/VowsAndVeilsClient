import React, { useEffect, useState } from "react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Učitaj omiljene iz localStorage-a
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Ukloni venčanicu iz omiljenih
  const removeFavorite = (weddingDress) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== weddingDress.id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Ažuriraj u localStorage
  };

  return (
    <div>
      <h1>Omiljene Venčanice</h1>
      {favorites.length > 0 ? (
        favorites.map((dress) => (
          <div key={dress.id} style={{ marginBottom: "20px" }}>
            <img src={dress.urlPhoto} alt={dress.name} width="200" />
            <h2>{dress.name}</h2>
            <p>Cena: {dress.price} RSD</p>
            <p>Veličina: {dress.size}</p>
            <p>Dužina haljine: {dress.dressLength}</p>
            <button onClick={() => removeFavorite(dress)}>Ukloni iz omiljenih</button>
          </div>
        ))
      ) : (
        <p>Nema omiljenih venčanica.</p>
      )}
    </div>
  );
};

export default Favorites;
