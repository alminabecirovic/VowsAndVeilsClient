import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../pages/create-inspiration.css";

const SubmitInspiration = () => {
    const [photos, setPhotos] = useState([]);
    const [previewPhotos, setPreviewPhotos] = useState([]);
    const [text, setText] = useState("");
    const [description, setDescription] = useState("");
    const [photosMessage, setPhotosMessage] = useState(null);
    const [textMessage, setTextMessage] = useState(null);
    const [descriptionMessage, setDescriptionMessage] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 1) {
            setPhotosMessage("Možete dodati samo jednu sliku.");
            return;
        }
        setPhotos(files);
        setPreviewPhotos(files.map((file) => URL.createObjectURL(file)));
    };

    useEffect(() => {
        if (photos.length > 1) {
            setPhotosMessage("Dozvoljena je samo jedna slika.");
        } else {
            setPhotosMessage(null);
        }
    }, [photos]);

    useEffect(() => {
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount > 10) {
            setTextMessage("Naslov može sadržavati maksimalno 10 reči.");
        } else {
            setTextMessage(null);
        }
    }, [text]);

    useEffect(() => {
        const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount > 100) {
            setDescriptionMessage("Opis može sadržavati maksimalno 100 reči.");
        } else {
            setDescriptionMessage(null);
        }
    }, [description]);

    const createInspiration = async (e) => {
        e.preventDefault();
        setError("");

        if (photosMessage || textMessage || descriptionMessage) {
            console.log("Forma nije validna. Kreiranje nije dozvoljeno.");
            return;
        }

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
            if (photos.length > 0) {
                formData.append("UrlPhotos", photos[0]);
            }

            const response = await axios.post("https://localhost:7042/api/Inspiration/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Uspešno kreirana inspiracija:", response.data);
            navigate("/");
        } catch (e) {
            console.error("❌ Greška prilikom slanja inspiracije:", e.response?.data || e.message);
            setError(e.response?.data?.title || "Došlo je do greške. Pokušajte ponovo.");
        }
    };

    return (
        <div className="inspiration-form-container">
            <h1>Pošalji svoju inspiraciju</h1>
            <form onSubmit={createInspiration} className="inspiration-form">
                <div className="form-section photo-upload">
                    <label>Fotografija:</label>
                    <label htmlFor="file-upload" className="upload-button">
                        Izaberi fotografiju
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    <div className="photo-preview-container">
                        {previewPhotos.map((photo, index) => (
                            <img key={index} src={photo} alt="Pregled" className="photo-preview" />
                        ))}
                    </div>
                    {photosMessage && <p className="input-alert">{photosMessage}</p>}
                </div>

                <div className="form-section">
                    <label>Naslov:</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Unesite naslov..."
                    />
                    {textMessage && <p className="input-alert">{textMessage}</p>}
                </div>

                <div className="form-section">
                    <label>Opis:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Unesite opis..."
                    />
                    {descriptionMessage && <p className="input-alert">{descriptionMessage}</p>}
                </div>

                <button type="submit" className="submit-inspiration-button">
                    Pošalji svoju inspiraciju
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default SubmitInspiration;
