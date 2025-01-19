import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
    const [photos, setPhotos] = useState([]); // Za više slika
    const [previewPhotos, setPreviewPhotos] = useState([]); // Za prikaz slika
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState(true);
    const [size, setSize] = useState("");
    const [dressLength, setDressLength] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // Pretvaramo u niz
        setPhotos(files);

        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setPreviewPhotos(previewUrls);
    };

    const create = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // Dodavanje fotografija u FormData
            photos.forEach((photo) => {
                formData.append("photos", photo);
            });
            formData.append("name", name);
            formData.append("price", price);
            formData.append("status", status);
            formData.append("size", size);
            formData.append("dressLength", dressLength);

            const response = await axios.post(
                "https://localhost:7042/api/Post/create",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.token) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
            }

            // Resetovanje forme
            setPhotos([]);
            setPreviewPhotos([]);
            setName("");
            setPrice("");
            setStatus(true);
            setSize("");
            setDressLength("");

            navigate("/dress");
        } catch (e) {
            console.error("Error", e);
            setError("Došlo je do greške prilikom kreiranja posta.");
        }
    };

    return (
        <div>
            <h1>Kreiraj Post</h1>
            <form onSubmit={create}>
                    <div>
                        <label>Photos:</label>
                        {/* Custom upload dugme */}
                        <label
                            htmlFor="file-upload"
                            style={{
                                display: "inline-block",
                                padding: "10px 20px",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Select Photos
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </div>
                    {/* Prikaz slika */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
                        {previewPhotos.map((photo, index) => (
                            <img
                                key={index}
                                src={photo}
                                alt={`Preview ${index + 1}`}
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                    border: "1px solid #ddd",
                                }}
                            />
                        ))}
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
                        onChange={(e) => setDressLength(e.target.value)}
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
