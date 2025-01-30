import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../pages/create-post.css";

const CreatePost = () => {
    const [photos, setPhotos] = useState([]);
    const [previewPhotos, setPreviewPhotos] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState("true");
    const [size, setSize] = useState("");
    const [dressLength, setDressLength] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [salonName, setSalonName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const cities = ["Beograd", "Novi Sad", "Niš", "Novi Pazar", "Kragujevac", "Subotica", "Zrenjanin", "Pančevo", "Čačak", "Kraljevo", "Leskovac"];

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setPhotos((prevPhotos) => [...prevPhotos, ...files]);
        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setPreviewPhotos((prevPreview) => [...prevPreview, ...previewUrls]);
    };

    const create = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            photos.forEach((photo) => formData.append("photos", photo));
            formData.append("name", name);
            formData.append("price", price);
            formData.append("status", status === "true");
            formData.append("size", size);
            formData.append("dressLength", dressLength);
            formData.append("city", city);
            formData.append("address", address);
            formData.append("salonName", salonName);

            await axios.post("https://localhost:7042/api/Post/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Resetovanje forme i preusmeravanje
            setPhotos([]);
            setPreviewPhotos([]);
            setName("");
            setPrice("");
            setStatus("true");
            setSize("");
            setDressLength("");
            setCity("");
            setAddress("");
            setSalonName("");
            navigate("/dress");
        } catch (e) {
            console.error("Greška prilikom kreiranja posta:", e);
            setError("Došlo je do greške prilikom kreiranja posta. Pokušajte ponovo.");
        }
    };

    return (
        <div className="create-post-container">
            <h1>Kreiraj Post</h1>
            <form onSubmit={create} className="create-post-form">
                <div className="form-group photo-upload-container">
                    <label>Fotografije:</label>
                    <label htmlFor="file-upload" className="photo-upload-button">
                        Izaberi fotografije
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    <div className="photo-preview-grid">
                        {previewPhotos.map((photo, index) => (
                            <img
                                key={index}
                                src={photo}
                                alt={`Pregled ${index + 1}`}
                                className="photo-preview"
                            />
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Naziv:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Unesi naziv"
                    />
                </div>

                <div className="form-group">
                    <label>Cena:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Unesi cenu"
                    />
                </div>

                <div className="form-group">
                    <label>Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="true">Aktivan</option>
                        <option value="false">Neaktivan</option>
                    </select>
                </div>

                <div className="form-group">
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

                <div className="form-group">
                    <label>Dužina haljine:</label>
                    <select
                        value={dressLength}
                        onChange={(e) => setDressLength(e.target.value)}
                    >
                        <option value="">Izaberi dužinu</option>
                        <option value="Sirena">Sirena</option>
                        <option value="Princeza">Princeza</option>
                        <option value="A-line">A-line</option>
                        <option value="Mini">Mini</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Grad:</label>
                    <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    >
                        <option value="">Izaberi grad</option>
                        {cities.map((c, index) => (
                            <option key={index} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Adresa:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Unesi adresu"
                    />
                </div>

                <div className="form-group">
                    <label>Naziv salona:</label>
                    <input
                        type="text"
                        value={salonName}
                        onChange={(e) => setSalonName(e.target.value)}
                        placeholder="Unesi naziv salona"
                    />
                </div>

                <button type="submit" className="submit-button">
                    Kreiraj
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default CreatePost;
