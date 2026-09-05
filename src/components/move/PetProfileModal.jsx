import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { X, Plus, Trash2, Edit2, Check, Sparkles, AlertCircle } from 'lucide-react';

const PET_TYPES = [
  { id: 'Dog', name: 'Dog', icon: '🐶' },
  { id: 'Cat', name: 'Cat', icon: '🐱' },
  { id: 'Rabbit', name: 'Rabbit', icon: '🐰' },
  { id: 'Bird', name: 'Bird', icon: '🦜' },
  { id: 'Horse', name: 'Horse', icon: '🐴' },
  { id: 'Other', name: 'Other', icon: '🐾' }
];

export default function PetProfileModal({ isOpen, onClose }) {
  const { petProfiles = [], addPetProfile, updatePetProfile, deletePetProfile } = useWellness();

  const [isAdding, setIsAdding] = useState(false);
  const [editingPetId, setEditingPetId] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('Dog');
  const [customType, setCustomType] = useState('');
  const [icon, setIcon] = useState('🐶');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingPetId(null);
    setName('');
    setType('Dog');
    setCustomType('');
    setIcon('🐶');
  };

  const handleStartEdit = (pet) => {
    setEditingPetId(pet.id);
    setIsAdding(false);
    setName(pet.name);
    setType(PET_TYPES.some(t => t.id === pet.type) ? pet.type : 'Other');
    setCustomType(!PET_TYPES.some(t => t.id === pet.type) ? pet.type : '');
    setIcon(pet.icon || '🐾');
  };

  const handleSavePet = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalType = (type === 'Other' && customType.trim()) ? customType.trim() : type;

    if (editingPetId) {
      updatePetProfile(editingPetId, {
        name: name.trim(),
        type: finalType,
        icon
      });
      setEditingPetId(null);
    } else {
      addPetProfile({
        name: name.trim(),
        type: finalType,
        icon
      });
      setIsAdding(false);
    }
  };

  const handleDeletePet = (petId, keepHistory) => {
    deletePetProfile(petId, keepHistory);
    setConfirmDeleteId(null);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 520,
          background: 'var(--bg-glass-card)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid var(--accent-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem'
              }}
            >
              🐾
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Manage Pet Profiles
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.1rem 0 0 0' }}>
                Add your dogs, cats, rabbits, horses, or any companion animal.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Add / Edit Form */}
        {(isAdding || editingPetId) ? (
          <form onSubmit={handleSavePet} style={{ background: 'var(--bg-secondary)', padding: '1.1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {editingPetId ? 'Edit Pet Profile' : 'Add New Pet 🐾'}
              </strong>
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingPetId(null); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.76rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>

            {/* Name */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Pet Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Luna, Felix, Barnaby, Storm"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-field"
                style={{ width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.86rem' }}
                autoFocus
              />
            </div>

            {/* Pet Type Picker */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Pet Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                {PET_TYPES.map(t => {
                  const active = type === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setType(t.id);
                        setIcon(t.icon);
                      }}
                      style={{
                        padding: '0.5rem 0.4rem',
                        borderRadius: 'var(--radius-md)',
                        border: active ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                        color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <span>{t.icon}</span>
                      <span>{t.name}</span>
                    </button>
                  );
                })}
              </div>

              {type === 'Other' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter custom pet type (e.g. Guinea Pig, Ferret, Parrot)"
                    value={customType}
                    onChange={e => setCustomType(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', fontSize: '0.82rem' }}
                  />
                </div>
              )}
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ flex: 1, padding: '0.6rem', fontSize: '0.84rem' }}
              >
                <Check size={14} />
                <span>{editingPetId ? 'Save Changes' : 'Add Pet Profile'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div style={{ marginBottom: '1.25rem' }}>
            <button
              type="button"
              onClick={handleStartAdd}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '0.85rem', fontWeight: 800, gap: '0.35rem', justifyContent: 'center' }}
            >
              <Plus size={16} /> Add a Pet
            </button>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {confirmDeleteId && (
          <div style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--accent-rose)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1.25rem', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-rose)', fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.4rem' }}>
              <AlertCircle size={16} /> Delete Pet Profile?
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.85rem 0', lineHeight: 1.45 }}>
              Choose what happens to past activity records logged with this pet:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => handleDeletePet(confirmDeleteId, true)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'center' }}
              >
                Keep past records in Move & history
              </button>
              <button
                type="button"
                onClick={() => handleDeletePet(confirmDeleteId, false)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'center', color: 'var(--accent-rose)' }}
              >
                Delete pet AND remove past Pet Play records
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.74rem', cursor: 'pointer', padding: '0.2rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Saved Pets List */}
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.55rem' }}>
            Your Pets
          </label>

          {petProfiles.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {petProfiles.map(pet => (
                <div
                  key={pet.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                      {pet.icon || '🐾'}
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)', display: 'block' }}>
                        {pet.name}
                      </strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {pet.type}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(pet)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.74rem', gap: '0.25rem' }}
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(pet.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.74rem', color: 'var(--accent-rose)' }}
                      title="Delete pet"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              No pets added yet. Click "+ Add a Pet" above to add your companion! 🐾
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClose}
            style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}
          >
            Done ✨
          </button>
        </div>

      </div>
    </div>
  );
}
