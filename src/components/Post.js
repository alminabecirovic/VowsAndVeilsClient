import React, { useState } from "react";
import axios from "axios";

const CreatePost = () => {
    const [urlPhoto, setUrlPhoto] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState(true);
    const [size, setSize] = useState("");
    const [dressLength, setDressLenght] = useState("");
    const [error, setError] = useState("");

    const handleCreatePost = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "https://localhost:7042/api/Post/create",
                {
                    urlPhoto,
                    name,
                    price,
                    status,
                    size,
                    dressLength,
                }
            );

            const responseData = response.data;
            if (responseData.token) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${responseData.token}`;
            }

            setUrlPhoto("");
            setName("");
            setPrice("");
            setStatus(true);
            setSize("");
            setDressLenght("");
        } catch (e) {
            console.error("Error", e);
            setError("Došlo je do greške prilikom kreiranja posta.");
        }
    };

    return (
        <div>
            <h1>Kreiraj Post</h1>
            <form onSubmit={handleCreatePost}>
                <div>
                    <label>URL Fotografije:</label>
                    <input
                        type="text"
                        value={urlPhoto}
                        onChange={(e) => setUrlPhoto(e.target.value)}
                        placeholder="Unesi URL fotografije"
                    />
                </div>
                <div>
                    <label>Naziv:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Unesi naziv"
                    />
                </div>
                <div>
                    <label>Cena:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Unesi cenu"
                    />
                </div>
                <div>
                    <label>Status:</label>
                    <input
                        type="checkbox"
                        checked={status}
                        onChange={(e) => setStatus(e.target.checked)}
                    />
                    <span>{status ? "Aktivan" : "Neaktivan"}</span>
                </div>
                <div>
                    <label>Veličina:</label>
                    <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                    >
                        <option value="">Izaberi veličinu</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                    </select>
                </div>
                <div>
                    <label>Dužina Haljine:</label>
                    <input
                        type="text"
                        value={dressLength}
                        onChange={(e) => setDressLenght(e.target.value)}
                        placeholder="Unesi dužinu haljine"
                    />
                </div>
                <button type="submit">Kreiraj</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default CreatePost;
