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
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false); // <- Dodato
    const navigate = useNavigate();

    const cities = ["Beograd", "Novi Sad", "Niš", "Novi Pazar", "Kragujevac", "Subotica", "Zrenjanin", "Pančevo", "Čačak", "Kraljevo", "Leskovac"];

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setPhotos((prevPhotos) => [...prevPhotos, ...files]);
        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setPreviewPhotos((prevPreview) => [...prevPreview, ...previewUrls]);
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const isInvalid = (field, value) => touched[field] && !value;

    const create = async (e) => {
        e.preventDefault();

        if (!name || !price || !size || !dressLength || !city || !address || !salonName || photos.length === 0) {
            setError("Molimo popunite sva polja i dodajte bar jednu fotografiju.");
            return;
        }

        if (parseFloat(price) <= 0) {
            setError("Cena mora biti pozitivan broj.");
            return;
        }

        setError("");
        setLoading(true); // <- Aktiviraj loading

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

            await axios.post("https://vowsandveils-api-production.up.railway.app/api/Post/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

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
            setTouched({});
            navigate("/dress");
        } catch (e) {
            console.error("Greška prilikom kreiranja posta:", e);
            setError("Došlo je do greške prilikom kreiranja posta. Pokušajte ponovo.");
        } finally {
            setLoading(false); // <- Deaktiviraj loading
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
                            <img key={index} src={photo} alt={`Pregled ${index + 1}`} className="photo-preview" />
                        ))}
                    </div>
                    {photos.length === 0 && error && (
                        <p className="field-error">Dodajte bar jednu fotografiju.</p>
                    )}
                </div>

                <div className={`form-group ${isInvalid("name", name) ? "invalid" : ""}`}>
                    <label>Naziv:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => handleBlur("name")}
                        placeholder="Unesi naziv"
                    />
                </div>

                <div className={`form-group ${isInvalid("price", price) ? "invalid" : ""}`}>
                    <label>Cena:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        onBlur={() => handleBlur("price")}
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

                <div className={`form-group ${isInvalid("size", size) ? "invalid" : ""}`}>
                    <label>Veličina:</label>
                    <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        onBlur={() => handleBlur("size")}
                    >
                        <option value="">Izaberi veličinu</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                    </select>
                </div>

                <div className={`form-group ${isInvalid("dressLength", dressLength) ? "invalid" : ""}`}>
                    <label>Dužina haljine:</label>
                    <select
                        value={dressLength}
                        onChange={(e) => setDressLength(e.target.value)}
                        onBlur={() => handleBlur("dressLength")}
                    >
                        <option value="">Izaberi dužinu</option>
                        <option value="Sirena">Sirena</option>
                        <option value="Princeza">Princeza</option>
                        <option value="A-line">A-line</option>
                        <option value="Mini">Mini</option>
                    </select>
                </div>

                <div className={`form-group ${isInvalid("city", city) ? "invalid" : ""}`}>
                    <label>Grad:</label>
                    <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onBlur={() => handleBlur("city")}
                    >
                        <option value="">Izaberi grad</option>
                        {cities.map((c, index) => (
                            <option key={index} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className={`form-group ${isInvalid("address", address) ? "invalid" : ""}`}>
                    <label>Adresa:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onBlur={() => handleBlur("address")}
                        placeholder="Unesi adresu"
                    />
                </div>

                <div className={`form-group ${isInvalid("salonName", salonName) ? "invalid" : ""}`}>
                    <label>Naziv salona:</label>
                    <input
                        type="text"
                        value={salonName}
                        onChange={(e) => setSalonName(e.target.value)}
                        onBlur={() => handleBlur("salonName")}
                        placeholder="Unesi naziv salona"
                    />
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Kreiranje posta..." : "Kreiraj"}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default CreatePost;
