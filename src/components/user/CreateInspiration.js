import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../pages/create-inspiration.css";

const CreateInspiration = () => {
    const [photos, setPhotos] = useState([]);
    const [previewPhotos, setPreviewPhotos] = useState([]);
    const [text, setText] = useState("");
    const [message, setMessage] = useState(""); // Dodato za prikaz obaveštenja
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
        setMessage(""); // Resetujemo poruke pre slanja

        const token = localStorage.getItem("jwtToken");

        if (!token) {
            setError("Niste prijavljeni. Molimo vas da se ulogujete.");
            return;
        }

        try {
            const formData = new FormData();

            // 🔍 PROVERA TOKENA I USER ID-A
            const tokenPayload = JSON.parse(atob(token.split(".")[1]));
            const userId = tokenPayload?.sub || tokenPayload?.UserId || tokenPayload?.id;

            if (!userId) {
                setError("Nevalidan korisnički ID. Molimo vas da se ponovo ulogujete.");
                return;
            }

            formData.append("UserId", userId);
            formData.append("Text", text);
            photos.forEach((photo) => formData.append("UrlPhotos", photo));

            console.log("📢 Slanje podataka:");
            console.log("User ID:", userId);
            console.log("Text:", text);
            console.log("Photos:", photos);
            console.log("FormData keys:", [...formData.keys()]);

            const response = await axios.post("https://localhost:7042/api/Inspiration/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Uspešno kreirana inspiracija:", response.data);

            // 📢 POSTAVLJANJE PORUKE O USPEŠNOJ POŠILJCI
            setMessage("Vaša inspiracija je uspešno poslata na pregled administratoru.");

            // Resetovanje forme nakon slanja
            setPhotos([]);
            setPreviewPhotos([]);
            setText("");

            // Automatsko zatvaranje poruke i preusmeravanje posle 3 sekunde
            setTimeout(() => {
                setMessage("");
                navigate("/inspirations");
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
        <div className="create-inspiration-container">
            <h1>Pošalji svoju inspiraciju</h1>
            <form onSubmit={createInspiration} className="create-inspiration-form">
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
                </div>

                <div className="form-group">
                    <label>Tekst:</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Unesite inspiraciju..."
                    />
                </div>

                <button type="submit" className="submit-button">
                    Pošalji svoju inspiraciju
                </button>
            </form>

            {/* Poruka o uspešnom slanju */}
            {message && <p className="success-message">{message}</p>}

            {/* Prikaz greške ako postoji */}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default CreateInspiration;
