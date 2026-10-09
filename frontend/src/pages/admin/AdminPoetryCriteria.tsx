import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, CheckCircle2, RefreshCw, Plus, Trash2 } from 'lucide-react';
import type { JudgingCriterion } from '../../types/poetryJudging';
import { criteriaService } from '../../services/admin/criteriaService';
import { PoetryNavTabs } from '../../components/admin/PoetryNavTabs';

export const AdminPoetryCriteriaPage: React.FC = () => {
  const [criteria, setCriteria] = useState<JudgingCriterion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadCriteria = async () => {
    setLoading(true);
    try {
      const res = await criteriaService.getCriteria();
      if (res.data) setCriteria(res.data);
    } catch (err) {
      console.error('Failed loading criteria:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCriteria();
  }, []);

  const totalWeight = criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
  const isValidWeight = totalWeight === 100;

  const handleChange = (index: number, field: keyof JudgingCriterion, value: any) => {
    const updated = [...criteria];
    updated[index] = {
      ...updated[index],
      [field]: field === 'weight' || field === 'maxScore' ? Number(value) : value,
    };
    setCriteria(updated);
  };

  const handleAddCriterion = () => {
    setCriteria([
      ...criteria,
      {
        id: `CRT-${(criteria.length + 1).toString().padStart(3, '0')}`,
        name: 'New Criterion',
        description: 'Description of evaluation criterion',
        weight: 0,
        maxScore: 10,
      },
    ]);
  };

  const handleRemoveCriterion = (index: number) => {
    if (criteria.length <= 1) return;
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidWeight) {
      setMsg({ type: 'error', text: `Total criteria weight must equal 100%. Current total: ${totalWeight}%` });
      return;
    }

    setSaving(true);
    setMsg(null);
    try {
      const res = await criteriaService.updateCriteria(criteria);
      if (res.success && res.data) {
        setCriteria(res.data);
        setMsg({ type: 'success', text: 'Judging criteria updated successfully ✓' });
      } else {
        setMsg({ type: 'error', text: res.message || 'Failed saving criteria.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Error updating criteria.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Judging Criteria Configuration
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Set scoring weights and maximum scores for judges. Total weight must equal 100%.
          </p>
        </div>

        <button className="admin-btn admin-btn-secondary" onClick={() => loadCriteria()}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <PoetryNavTabs />

      {/* Total Weight Monitor Card */}
      <div
        className="admin-card"
        style={{
          backgroundColor: isValidWeight ? '#f0fdf4' : '#fff1f2',
          borderColor: isValidWeight ? '#bbf7d0' : '#fecdd3',
          padding: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isValidWeight ? (
              <CheckCircle2 size={24} color="#16a34a" />
            ) : (
              <AlertTriangle size={24} color="#e11d48" />
            )}
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: isValidWeight ? '#166534' : '#9f1239' }}>
                Total Criteria Weight: {totalWeight}% / 100%
              </div>
              <div style={{ fontSize: '0.8125rem', color: isValidWeight ? '#15803d' : '#be123c' }}>
                {isValidWeight
                  ? 'Criteria weight allocation is valid and balanced.'
                  : 'Total weight must equal exactly 100% before criteria can be saved.'}
              </div>
            </div>
          </div>

          <button
            className="admin-btn admin-btn-secondary"
            style={{ height: '36px', fontSize: '0.8125rem' }}
            onClick={handleAddCriterion}
          >
            <Plus size={16} />
            <span>Add Criterion</span>
          </button>
        </div>
      </div>

      {msg && (
        <div
          style={{
            padding: '0.875rem 1rem',
            borderRadius: '6px',
            backgroundColor: msg.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: msg.type === 'success' ? '#15803d' : '#991b1b',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Criteria Form List */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {criteria.map((item, index) => (
          <div key={item.id || index} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', fontFamily: 'monospace' }}>
                CRITERION #{index + 1} ({item.id})
              </span>
              {criteria.length > 1 && (
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                  onClick={() => handleRemoveCriterion(index)}
                  title="Remove Criterion"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label">Criterion Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={item.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Weight (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="admin-input"
                  value={item.weight}
                  onChange={(e) => handleChange(index, 'weight', e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Maximum Score</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  className="admin-input"
                  value={item.maxScore}
                  onChange={(e) => handleChange(index, 'maxScore', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Description / Guidance for Judges</label>
              <input
                type="text"
                className="admin-input"
                value={item.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                required
              />
            </div>
          </div>
        ))}

        <div style={{ marginTop: '0.5rem' }}>
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ height: '44px', padding: '0 2rem' }}
            disabled={!isValidWeight || saving}
          >
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save Judging Criteria Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
