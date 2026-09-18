import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Sparkles, 
  Check, 
  Tag, 
  Calendar, 
  Clock, 
  Heart, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SKINCARE_CATEGORIES } from '../../../data/mockData';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AddEditProductModal({ isOpen, onClose, onSave, editingProduct = null }) {
  if (!isOpen) return null;

  const [name, setName] = useState(editingProduct?.name || '');
  const [brand, setBrand] = useState(editingProduct?.brand || '');
  const [category, setCategory] = useState(editingProduct?.category || 'serum');
  const [customCategory, setCustomCategory] = useState('');
  const [icon, setIcon] = useState(editingProduct?.icon || '🧴');
  const [whenUsed, setWhenUsed] = useState(editingProduct?.whenUsed || 'both');
  const [frequency, setFrequency] = useState(editingProduct?.frequency || 'daily');
  const [selectedDays, setSelectedDays] = useState(editingProduct?.scheduleDays || DAYS_OF_WEEK);
  const [ingredientsInput, setIngredientsInput] = useState((editingProduct?.keyIngredients || []).join(', '));
  const [notes, setNotes] = useState(editingProduct?.notes || '');
  const [photo, setPhoto] = useState(editingProduct?.photo || '');
  const [isFavorite, setIsFavorite] = useState(editingProduct?.isFavorite || false);

  // AI recognition helper preview state
  const [isAiAssisting, setIsAiAssisting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const iconsList = ['🧼', '💧', '🧪', '🧴', '☀️', '✨', '🧖‍♀️', '👁️', '🩹', '🫧', '👄', '🌿', '🌸', '🍵', '🥑', '⭐'];

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleDay = (day) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleAiLookup = () => {
    if (!name.trim()) return;
    setIsAiAssisting(true);
    setTimeout(() => {
      setIsAiAssisting(false);
      const lower = (name + ' ' + brand).toLowerCase();
      let suggestedCat = 'serum';
      let suggestedIngredients = [];
      let suggestedWhen = 'both';

      if (lower.includes('cleanse') || lower.includes('wash')) {
        suggestedCat = 'cleanser';
        suggestedIngredients = ['Gentle Surfactants', 'Glycerin', 'Ceramides'];
      } else if (lower.includes('sun') || lower.includes('spf')) {
        suggestedCat = 'sunscreen';
        suggestedWhen = 'morning';
        suggestedIngredients = ['Broad Spectrum UV Filters', 'Antioxidants'];
      } else if (lower.includes('moistur') || lower.includes('cream') || lower.includes('lotion')) {
        suggestedCat = 'moisturiser';
        suggestedIngredients = ['Ceramides', 'Squalane', 'Hyaluronic Acid'];
      } else if (lower.includes('bha') || lower.includes('aha') || lower.includes('exfoli')) {
        suggestedCat = 'exfoliant';
        suggestedWhen = 'evening';
        suggestedIngredients = ['Salicylic Acid (BHA)', 'Green Tea Extract'];
      } else if (lower.includes('vitamin c') || lower.includes('glow')) {
        suggestedCat = 'serum';
        suggestedWhen = 'morning';
        suggestedIngredients = ['L-Ascorbic Acid (Vitamin C)', 'Ferulic Acid'];
      } else {
        suggestedIngredients = ['Hyaluronic Acid', 'Niacinamide', 'Panthenol'];
      }

      setAiSuggestions({
        category: suggestedCat,
        whenUsed: suggestedWhen,
        ingredients: suggestedIngredients.join(', ')
      });
    }, 600);
  };

  const handleApplyAiSuggestion = () => {
    if (!aiSuggestions) return;
    setCategory(aiSuggestions.category);
    setWhenUsed(aiSuggestions.whenUsed);
    if (!ingredientsInput.trim()) {
      setIngredientsInput(aiSuggestions.ingredients);
    }
    setAiSuggestions(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const keyIngredients = ingredientsInput
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    const productPayload = {
      ...(editingProduct || {}),
      name: name.trim(),
      brand: brand.trim(),
      category: category === 'custom' && customCategory.trim() ? customCategory.trim() : category,
      icon,
      photo: photo || null,
      whenUsed,
      frequency,
      scheduleDays: frequency === 'daily' ? DAYS_OF_WEEK : selectedDays,
      keyIngredients,
      notes: notes.trim(),
      isFavorite
    };

    onSave(productPayload);
    onClose();

    try {
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 } });
    } catch(err) {}
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2200,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        className="card-glass" 
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-glass-card, #ffffff)',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
                🧴 Skincare Shelf
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
              {editingProduct ? 'Edit Skincare Product' : 'Add Skincare Product'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
              Add what you currently use. You are always in control of your routine.
            </p>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem', borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          
          {/* 1. Name & Brand */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hydrating Gentle Cleanser"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
                Brand (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. CeraVe, La Roche-Posay"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.9rem' }}
              />
            </div>
          </div>

          {/* Optional AI Auto-Detect Info Preview */}
          {name.trim().length > 3 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                💡 Need quick autofill suggestions for this product?
              </span>
              <button
                type="button"
                onClick={handleAiLookup}
                disabled={isAiAssisting}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', gap: '0.25rem' }}
              >
                <Sparkles size={12} color="var(--accent-primary)" />
                <span>{isAiAssisting ? 'Checking...' : 'Suggest Details'}</span>
              </button>
            </div>
          )}

          {/* AI Suggestion Banner with explicit user confirmation requirement */}
          {aiSuggestions && (
            <div style={{ background: 'var(--accent-primary-light)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--accent-primary)', animation: 'fadeIn 0.2s ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={13} /> Suggested Details (Review & Confirm):
                </span>
                <button
                  type="button"
                  onClick={() => setAiSuggestions(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={13} />
                </button>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
                Category: <strong>{aiSuggestions.category}</strong> • Routine: <strong>{aiSuggestions.whenUsed}</strong> • Ingredients: <strong>{aiSuggestions.ingredients}</strong>
              </p>
              <button
                type="button"
                onClick={handleApplyAiSuggestion}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.75rem', gap: '0.3rem' }}
              >
                <Check size={12} /> Apply Suggested Details
              </button>
            </div>
          )}

          {/* 2. Category & Icon */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="select-field"
                style={{ fontSize: '0.88rem' }}
              >
                {SKINCARE_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Category Input if selected */}
            {category === 'custom' && (
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
                  Custom Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Essence, Face Oil"
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.88rem' }}
                />
              </div>
            )}

            {/* Icon Picker */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
                Display Icon
              </label>
              <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.2rem', scrollbarWidth: 'none' }}>
                {iconsList.map(ic => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 'var(--radius-sm)',
                      border: icon === ic ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: icon === ic ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Photo Attachment */}
          <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Camera size={14} color="var(--accent-primary)" />
                Optional Product Photo
              </label>
              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto('')}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 700 }}
                >
                  Remove Photo
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {photo ? (
                <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1.5px solid var(--accent-primary)', flexShrink: 0 }}>
                  <img src={photo} alt="Product preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px dashed var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                  <Camera size={20} />
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                  Upload a photo of your bottle or bottle label (stored locally on device).
                </span>
              </div>
            </div>
          </div>


          {/* 3. When is it used (Routine assignment) */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
              When is it used in your flow?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
              {[
                { id: 'morning', label: '☀️ Morning Only', desc: 'Daytime step' },
                { id: 'evening', label: '🌙 Evening Only', desc: 'Night step' },
                { id: 'both', label: '☀️🌙 Both', desc: 'AM & PM' },
                { id: 'weekly', label: '📅 Weekly / Custom', desc: 'Ritual step' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setWhenUsed(opt.id)}
                  style={{
                    padding: '0.55rem 0.4rem',
                    borderRadius: 'var(--radius-md)',
                    border: whenUsed === opt.id ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: whenUsed === opt.id ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                    color: whenUsed === opt.id ? 'var(--accent-primary)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}
                >
                  <div>{opt.label}</div>
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Frequency & Schedule Days */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
              Usage Frequency
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginBottom: '0.6rem' }}>
              {[
                { id: 'daily', label: 'Every Day 🔄' },
                { id: 'specific_days', label: 'Specific Days (e.g. Mon/Wed/Fri) 📅' },
                { id: 'as_needed', label: 'As Needed / Flexible 🌿' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFrequency(f.id)}
                  style={{
                    padding: '0.5rem 0.4rem',
                    borderRadius: 'var(--radius-md)',
                    border: frequency === f.id ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: frequency === f.id ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                    color: frequency === f.id ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Day Selector if specific days */}
            {frequency === 'specific_days' && (
              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Select which days you apply this product:
                </span>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {DAYS_OF_WEEK.map(d => {
                    const isSelected = selectedDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleToggleDay(d)}
                        style={{
                          flex: 1,
                          minWidth: 40,
                          padding: '0.4rem 0.3rem',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                          background: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                          color: isSelected ? '#ffffff' : 'var(--text-primary)',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 5. Key Ingredients / Tags */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
              Key Ingredients / Attributes (Optional, comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Hyaluronic Acid, Niacinamide, Ceramides, SPF 50+"
              value={ingredientsInput}
              onChange={e => setIngredientsInput(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.86rem' }}
            />
          </div>

          {/* 6. Notes & Application Tips */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
              Personal Notes & Application Tips (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Apply 3 drops to damp skin, pat gently"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.84rem', resize: 'vertical' }}
            />
          </div>

          {/* Non-medical confirmation notice */}
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '3px solid var(--accent-primary)', paddingLeft: '0.6rem' }}>
            <ShieldCheck size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
            <span>Product details are for your personal routine organization. Better Every Day does not diagnose skin conditions or evaluate therapeutic suitability.</span>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1.5, fontWeight: 800 }}>
              {editingProduct ? 'Save Changes' : 'Add to Shelf & Routine'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
