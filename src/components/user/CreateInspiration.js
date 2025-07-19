import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../pages/create-inspiration.css";

const SubmitInspiration = () => {
    const [photos, setPhotos] = useState([]);
    const [previewPhotos, setPreviewPhotos] = useState([]);
    const [text, setText] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 1) {
            setError("Dozvoljena je samo jedna fotografija.");
            return;
        }

        setError("");
        setPhotos(files);
        setPreviewPhotos(files.map((file) => URL.createObjectURL(file)));
    };

    const validate = () => {
        if (!text.trim() || !description.trim() || photos.length !== 1) {
            setError("Molimo vas da unesete sva polja.");
            return false;
        }
        return true;
    };

    const createInspiration = async (e) => {
        e.preventDefault();
        setError("");

        if (!validate()) return;

        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setError("Niste prijavljeni.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            const tokenPayload = JSON.parse(atob(token.split(".")[1]));
            const userId = tokenPayload?.sub || tokenPayload?.UserId || tokenPayload?.id;

            formData.append("UserId", userId);
            formData.append("Text", text);
            formData.append("Description", description);
            formData.append("UrlPhotos", photos[0]);

            await axios.post("https://vowsandveils-api-production.up.railway.app/api/Inspiration/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            navigate("/");
        } catch (e) {
            setError("Greška prilikom slanja.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inspiration-form-container">
            <form onSubmit={createInspiration} className="inspiration-form">
                <div className="form-section photo-upload">
                    <label>Fotografija</label>
                    <small style={{ color: "#666", marginBottom: "5px", display: "block" }}>
                        Dozvoljeno je dodavanje samo jedne fotografije.
                    </small>
                    <label htmlFor="file-upload" className="upload-button">
                        Izaberi fotografiju
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        multiple={false}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    <div className="photo-preview-container">
                        {previewPhotos.map((photo, index) => (
                            <img key={index} src={photo} alt="Pregled" className="photo-preview" />
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <label>Naslov</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Unesite naslov..."
                    />
                </div>

                <div className="form-section">
                    <label>Opis</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Unesite opis..."
                    />
                </div>

                {error && <p className="input-alert">{error}</p>}

                <button type="submit" className="submit-inspiration-button" disabled={loading}>
                    {loading ? "Slanje..." : "Pošalji svoju inspiraciju"}
                </button>
            </form>
        </div>
    );
};

export default SubmitInspiration;
