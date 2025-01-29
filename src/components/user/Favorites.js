import React, { useEffect, useState } from "react";
import "../../pages/favorites.css";

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
    <div className="favorites-container">
      <h1>Omiljene Venčanice</h1>
      {favorites.length > 0 ? (
        favorites.map((dress) => (
          <div key={dress.id} className="favorite-card">
            <div className="favorite-gallery">
              {dress.urlPhotos && dress.urlPhotos.length > 0 ? (
                dress.urlPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${dress.name} - ${index + 1}`}
                    className="favorite-photo"
                  />
                ))
              ) : (
                <p>Nema dostupnih slika za ovu venčanicu.</p>
              )}
            </div>
            <div className="favorite-info">
              <h2>{dress.name}</h2>
              <p>Cena: {dress.price} RSD</p>
              <p>Veličina: {dress.size}</p>
              <p>Dužina haljine: {dress.dressLength}</p>
              <button onClick={() => removeFavorite(dress)}>Ukloni iz omiljenih</button>
            </div>
          </div>
        ))
      ) : (
        <p>Nema omiljenih venčanica.</p>
      )}
    </div>
  );
};

export default Favorites;
