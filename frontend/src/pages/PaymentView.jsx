import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/qrs';

export default function PaymentView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [qr, setQr] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQr = async () => {
            try {
                const { data } = await axios.get(`${API_URL}`);
                const currentQr = data.find(q => q.id === id);
                if (currentQr) setQr(currentQr);
            } catch (error) {
                console.error('Error fetching QR details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQr();
    }, [id]);

    if (loading) {
        return (
            <div className="loader-container">
                <Loader2 className="loader" size={48} color="#3b82f6" />
            </div>
        );
    }

    if (!qr) {
        return (
            <div className="empty-state">
                <h2>QR Not Found</h2>
                <button className="btn-secondary" onClick={() => navigate('/')}>Back to Library</button>
            </div>
        );
    }

    return (
        <div className="payment-view">
            <button
                className="btn-secondary"
                onClick={() => navigate('/')}
                style={{ marginBottom: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
                <ArrowLeft size={18} />
                Back to Library
            </button>

            <div className="payment-card">
                <img
                    src={`http://localhost:5000${qr.imageUrl}`}
                    alt={qr.name}
                    className="payment-qr"
                />
            </div>

            <div className="payment-details">
                <h2>{qr.shopName}</h2>
                <p>{qr.name}</p>
                <span style={{
                    display: 'inline-block',
                    marginTop: '15px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: 'var(--accent-color)',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                }}>
                    {qr.category}
                </span>
            </div>

            <div style={{ marginTop: '40px' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Scan this QR code with your payment app
                </p>
                {/* If this was a mobile PWA, we'd add "Open in UPI App" button if we previously decoded it */}
            </div>
        </div>
    );
}
