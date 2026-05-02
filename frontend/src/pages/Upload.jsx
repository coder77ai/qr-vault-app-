import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/qrs';

export default function UploadPage() {
    const [formData, setFormData] = useState({
        name: '',
        shopName: '',
        category: 'Shop'
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setupFile(e.target.files[0]);
        }
    };

    const setupFile = (file) => {
        setFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setupFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please upload a QR code image');
            return;
        }

        setLoading(true);
        const apiData = new FormData();
        apiData.append('qrImage', file);
        apiData.append('name', formData.name);
        apiData.append('shopName', formData.shopName);
        apiData.append('category', formData.category);

        try {
            await axios.post(API_URL, apiData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/');
        } catch (error) {
            console.error('Upload Error', error);
            alert('Failed to upload QR code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <div className="upload-header">
                <h2>Save a New QR</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Upload your payment QR codes for easy access later.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title (e.g., Grocery Shop QR)</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter a recognizable title"
                    />
                </div>

                <div className="form-group">
                    <label>Shop / Mechanic Name</label>
                    <input
                        type="text"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleInputChange}
                        required
                        placeholder="Name of the person/shop being paid"
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange}>
                        <option value="Shop">Shop / Grocery</option>
                        <option value="Mechanic">Mechanic / Service</option>
                        <option value="Restaurant">Restaurant / Cafe</option>
                        <option value="Personal">Personal Contact</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>QR Image Upload</label>
                    <div
                        className={`file-drop-area ${dragActive ? 'drag-active' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="preview-image" />
                        ) : (
                            <>
                                <UploadCloud size={48} />
                                <p>Drag and drop your QR screenshot here</p>
                                <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>or click to browse</p>
                            </>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="file-input"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <button type="submit" className="btn-primary submit-btn" disabled={loading}>
                    {loading ? 'Saving...' : (
                        <>
                            <CheckCircle size={20} />
                            Save QR Code
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
