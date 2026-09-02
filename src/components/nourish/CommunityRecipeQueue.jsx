import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Sparkles, CheckCircle, Clock, ShieldCheck, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CommunityRecipeQueue({ isOpen, onClose }) {
  const { moderationQueue, submitCommunityRecipe, approveModerationItem } = useWellness();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Dinner');
  const [calories, setCalories] = useState(450);
  const [protein, setProtein] = useState(25);
  const [carbs, setCarbs] = useState(40);
  const [fat, setFat] = useState(15);
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'queue'

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    submitCommunityRecipe({
      title,
      category,
      calories: Number(calories),
      macros: { protein: Number(protein), carbs: Number(carbs), fat: Number(fat), fiber: 8 },
      description
    });

    setTitle('');
    setDescription('');
    setActiveTab('queue');

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem' }}>Community Recipes & Kitchen 👩‍🍳</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Share your favorite wellness creations with fellow members.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('submit')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeTab === 'submit' ? 'var(--accent-primary-light)' : 'transparent',
              color: activeTab === 'submit' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Submit Recipe
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeTab === 'queue' ? 'var(--accent-primary-light)' : 'transparent',
              color: activeTab === 'queue' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <ShieldCheck size={14} /> Moderation Queue ({moderationQueue.length})
          </button>
        </div>

        {activeTab === 'submit' ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Recipe Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lemon Herb Roasted Cauliflower Steak"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="input-field"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Meal Category
                </label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="select-field">
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Calories (est)
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={e => setCalories(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Protein (g)</label>
                <input type="number" value={protein} onChange={e => setProtein(e.target.value)} className="input-field" />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Carbs (g)</label>
                <input type="number" value={carbs} onChange={e => setCarbs(e.target.value)} className="input-field" />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Fat (g)</label>
                <input type="number" value={fat} onChange={e => setFat(e.target.value)} className="input-field" />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Description & Nourishing Highlights
              </label>
              <textarea
                rows="3"
                placeholder="Why do you love this dish? Mention key wholesome ingredients..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="textarea-field"
              />
            </div>

            <div style={{ background: 'var(--accent-primary-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              ℹ️ <strong>Quality & Safety:</strong> Submissions enter our community moderation queue for recipe validation before going public.
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Submit for Moderation Review
            </button>
          </form>
        ) : (
          <div>
            {moderationQueue.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <CheckCircle size={32} color="var(--accent-primary)" style={{ marginBottom: '0.5rem' }} />
                <p>The moderation queue is all clear! All recipes are published.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {moderationQueue.map(item => (
                  <div 
                    key={item.id}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span className="pill-badge orange" style={{ fontSize: '0.7rem' }}>
                        <Clock size={11} /> {item.status === 'pending_moderation' ? 'Pending Review' : 'Approved'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.date}</span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>{item.title}</h4>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Submitted by: <strong>{item.submittedBy}</strong> • {item.category} • {item.calories} kcal ({item.macros.protein}g Pro)
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      {item.notes}
                    </p>

                    <button
                      onClick={() => approveModerationItem(item.id)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <ShieldCheck size={13} /> Approve & Publish to Community
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
