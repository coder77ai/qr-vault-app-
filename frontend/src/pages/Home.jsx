import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Loader2, QrCode, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/qrs';

export default function Home() {
    const [qrs, setQrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchQrs = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}?search=${search}`);
            setQrs(data || []);
        } catch (error) {
            console.error('Error fetching QRs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchQrs();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleDelete = async (id, e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this QR?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchQrs();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div>
            <section className="hero-section">
                <h1 className="hero-title">Your Payment QR Vault</h1>
                <p className="hero-subtitle">Store and organize QR codes from your favorite shops, mechanics, and services for easy payments.</p>
            </section>

            <div className="search-bar">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Search by shop name, category or title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="loader-container">
                    <Loader2 className="loader" size={48} color="#3b82f6" />
                </div>
            ) : qrs.length === 0 ? (
                <div className="empty-state">
                    <QrCode size={64} />
                    <h2>No QR Codes Found</h2>
                    <p>You haven't saved any QR codes yet, or no matches found.¹</p>
                </div>
            ) : (
                <div className="qr-grid">
                    {qrs.map(qr => (
                        <Link to={`/pay/${qr.id}`} key={qr.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="qr-card">
                                <div className="qr-image-container">
                                    <img src={`http://localhost:5000${qr.imageUrl}`} alt={qr.name} />
                                </div>
                                <div className="qr-card-content">
                                    <h3 className="qr-title">{qr.name}</h3>
                                    <div className="qr-shop">
                                        <span>{qr.shopName}</span> • <span>{qr.category}</span>
                                    </div>
                                    <div className="qr-actions">
                                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
                                            Pay Now
                                        </button>
                                        <button
                                            className="btn-danger"
                                            onClick={(e) => handleDelete(qr.id, e)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
