import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Eye, ShieldCheck, Check } from 'lucide-react';

export default function Verification() {
  const [pendingItems, setPendingItems] = useState([
    {
      id: 'REC-1027',
      breedSuggested: 'Sahiwal',
      confidence: 88.5,
      submittedBy: 'Kisan Kendra - Ludhiana',
      date: '2026-09-03 11:45',
      image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=600&auto=format&fit=crop&q=80',
      status: 'pending'
    },
    {
      id: 'REC-1026',
      breedSuggested: 'Murrah Buffalo',
      confidence: 84.1,
      submittedBy: 'Dairy Coop - Karnal',
      date: '2026-09-02 16:30',
      image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80',
      status: 'pending'
    }
  ]);

  const handleAction = (id, newStatus) => {
    setPendingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>
          <ShieldCheck size={13} /> Quality Assurance
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Veterinary Verification Queue
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
          Validate borderline predictions (&lt; 90% confidence) to ensure scientific accuracy.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {pendingItems.map((item) => (
          <div key={item.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative', height: '220px', borderRadius: '12px', overflow: 'hidden' }}>
              <img
                src={item.image}
                alt="Subject livestock"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span className="badge badge-amber" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                {item.confidence}% Match
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>{item.breedSuggested}</h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#67e8f9' }}>{item.id}</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>
                Source: {item.submittedBy} • {item.date}
              </p>
            </div>

            {item.status === 'pending' ? (
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button
                  type="button"
                  onClick={() => handleAction(item.id, 'confirmed')}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                >
                  <Check size={16} /> Confirm Breed
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(item.id, 'rejected')}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.85rem', color: '#fb7185' }}
                >
                  <XCircle size={16} /> Reclassify
                </button>
              </div>
            ) : (
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: item.status === 'confirmed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: item.status === 'confirmed' ? '#34d399' : '#fb7185',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}>
                {item.status === 'confirmed' ? '✓ Breed Classification Confirmed' : '✗ Flagged for Reclassification'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
