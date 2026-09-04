import React from 'react';
import { ShieldCheck, MapPin, Activity, Droplets, Info } from 'lucide-react';

export default function PredictionCard({ breed, confidence }) {
  if (!breed) return null;

  return (
    <div className="glass-panel" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative top accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              {breed.name}
            </h2>
            <span className="badge badge-emerald">
              <ShieldCheck size={14} /> High Match
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            {breed.species}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            AI Confidence
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#10b981'
          }}>
            {(confidence || (breed.confidence * 100)).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Key characteristics grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginTop: '24px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <MapPin size={18} style={{ color: '#06b6d4', marginTop: '3px' }} />
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Native Origin</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>{breed.origin || 'Western India'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <Droplets size={18} style={{ color: '#38bdf8', marginTop: '3px' }} />
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Avg Milk Yield</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>{breed.milkYield || '12-16 L/day'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <Activity size={18} style={{ color: '#10b981', marginTop: '3px' }} />
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Health & Immunity</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>{breed.healthIndex || 'High Resistance'}</div>
          </div>
        </div>
      </div>

      {/* Trait details */}
      {breed.characteristics && (
        <div style={{
          marginTop: '20px',
          padding: '14px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px'
        }}>
          <Info size={18} style={{ color: '#94a3b8', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            <strong style={{ color: '#f8fafc' }}>Key Morphological Traits: </strong>
            {breed.characteristics}
          </p>
        </div>
      )}
    </div>
  );
}
