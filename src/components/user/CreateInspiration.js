import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../pages/create-inspiration.css"; // Preimenovan CSS fajl

const SubmitInspiration = () => {
    const [photos, setPhotos] = useState([]);
    const [previewPhotos, setPreviewPhotos] = useState([]);
    const [text, setText] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState(""); 
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setPhotos((prevPhotos) => [...prevPhotos, ...files]);
        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setPreviewPhotos((prevPreview) => [...prevPreview, ...previewUrls]);
    };

    const createInspiration = async (e) => {
        e.preventDefault();
        setError("");
        setMessage(""); 

        const token = localStorage.getItem("jwtToken");

        if (!token) {
            setError("Niste prijavljeni. Molimo vas da se ulogujete.");
            return;
        }

        try {
            const formData = new FormData();

            const tokenPayload = JSON.parse(atob(token.split(".")[1]));
            const userId = tokenPayload?.sub || tokenPayload?.UserId || tokenPayload?.id;

            if (!userId) {
                setError("Nevalidan korisnički ID. Molimo vas da se ponovo ulogujete.");
                return;
            }

            formData.append("UserId", userId);
            formData.append("Text", text);
            formData.append("Description", description);
            photos.forEach((photo) => formData.append("UrlPhotos", photo));

            console.log("📢 Slanje podataka:");
            console.log("User ID:", userId);
            console.log("Text:", text);
            console.log("Descrption", description);
            console.log("Photos:", photos);
            console.log("FormData keys:", [...formData.keys()]);

            const response = await axios.post("https://localhost:7042/api/Inspiration/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Uspešno kreirana inspiracija:", response.data);

            setMessage("Vaša inspiracija je uspešno poslata na pregled administratoru.");

            setPhotos([]);
            setPreviewPhotos([]);
            setText("");
            setDescription("");

            setTimeout(() => {
                setMessage("");
                navigate("/");
            }, 3000);
        } catch (e) {
            console.error("❌ Greška prilikom slanja inspiracije:", e.response?.data || e.message);
            if (e.response?.data?.errors) {
                console.log("🔍 Detalji greške:", e.response.data.errors);
            }
            setError(e.response?.data?.title || "Došlo je do greške prilikom slanja inspiracije. Pokušajte ponovo.");
        }
    };

    return (
        <div className="inspiration-form-container">
            <h1>Pošalji svoju inspiraciju</h1>
            <form onSubmit={createInspiration} className="inspiration-form">
                <div className="form-section photo-upload">
                    <label>Fotografije:</label>
                    <label htmlFor="file-upload" className="upload-button">
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
                    <div className="photo-preview-container">
                        {previewPhotos.map((photo, index) => (
                            <img key={index} src={photo} alt={`Pregled ${index + 1}`} className="photo-preview" />
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <label>Naslov:</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Unesite naslov..."
                    />
                </div>

                <div className="form-section">
                    <label>Opis:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Unesite opis..."
                    />
                </div>

                <button type="submit" className="submit-inspiration-button">
                    Pošalji svoju inspiraciju
                </button>
            </form>

            {message && <p className="success-message">{message}</p>}

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default SubmitInspiration;
