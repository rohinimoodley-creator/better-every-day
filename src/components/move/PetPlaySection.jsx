import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import LogPetPlayModal from './LogPetPlayModal';
import PetProfileModal from './PetProfileModal';
import PetPlayHistoryModal from './PetPlayHistoryModal';
import ContextualPip from '../mascot/ContextualPip';
import {
  Heart,
  Plus,
  Clock,
  BookOpen,
  Settings,
  Sparkles,
  ChevronRight,
  Activity
} from 'lucide-react';

export default function PetPlaySection() {
  const {
    petProfiles = [],
    petPlayLogs = [],
    getPetPlayStats
  } = useWellness();

  const [selectedPetId, setSelectedPetId] = useState('all');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const stats = getPetPlayStats 
    ? getPetPlayStats(selectedPetId) 
    : { totalMinutes: 120, totalHours: 2.0, sessionCount: 3, breakdownList: [], insight: '' };

  const currentPet = petProfiles.find(p => p.id === selectedPetId);

  return (
    <div
      className="card-glass"
      style={{
        padding: '1.4rem',
        border: '1px solid var(--border-glass)',
        position: 'relative'
      }}
    >
      {/* 1. Header & Meaningful Philosophy */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(46, 125, 90, 0.15) 0%, rgba(217, 93, 57, 0.15) 100%)',
              border: '1px solid var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              flexShrink: 0
            }}
          >
            🐾
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Pet Play
              </h3>
              <span className="pill-badge primary" style={{ fontSize: '0.66rem', padding: '1px 6px' }}>
                Movement & Companionship
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
              You were spending time with someone you love — and you moved together too. 🐾💚
            </p>
          </div>
        </div>

        {/* Quick Log CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={() => setIsLogModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', gap: '0.35rem', fontWeight: 800 }}
          >
            <Plus size={14} /> Log Pet Activity
          </button>
        </div>
      </div>

      {/* Contextual Pet Play Pip */}
      <ContextualPip context="pet_play" layout="subtle" size={32} style={{ marginBottom: '1rem' }} />

      {/* 2. Pet Selector Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.15rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          <button
            type="button"
            onClick={() => setSelectedPetId('all')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              border: selectedPetId === 'all' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: selectedPetId === 'all' ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
              color: selectedPetId === 'all' ? 'var(--accent-primary)' : 'var(--text-primary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🐾 All Pets
          </button>

          {petProfiles.map(pet => {
            const active = selectedPetId === pet.id;
            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => setSelectedPetId(pet.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  border: active ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: active ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                  color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{pet.icon || '🐾'}</span>
                <span>{pet.name}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-pill)', gap: '0.25rem' }}
            title="Add or manage pet profiles"
          >
            <Plus size={12} /> Add Pet
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsProfileModalOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.74rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <Settings size={12} /> Manage Pets
        </button>
      </div>

      {/* 3. Weekly Summary Card */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.15rem 1.25rem',
          marginBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>
              THIS WEEK
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {selectedPetId === 'all' ? '🐾 All Pets & Me' : `${currentPet?.icon || '🐾'} ${currentPet?.name || 'Pet'} & Me`}
            </h4>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
              {stats.totalHours >= 1 ? `${stats.totalHours} hr` : `${stats.totalMinutes} min`}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              active time together
            </span>
          </div>
        </div>

        {/* Activity Breakdown List */}
        {stats.breakdownList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.85rem' }}>
            {stats.breakdownList.slice(0, 4).map((act, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-tertiary)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                    {act.name}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    ({act.count} {act.count === 1 ? 'time' : 'times'})
                  </span>
                </div>

                <span style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '0.82rem' }}>
                  {act.minutes >= 60 
                    ? `${Math.floor(act.minutes / 60)} hr${act.minutes % 60 > 0 ? ` ${act.minutes % 60}m` : ''}` 
                    : `${act.minutes} min`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.85rem' }}>
            No activities recorded with {selectedPetId === 'all' ? 'your pets' : (currentPet?.name || 'your pet')} yet this week. Tap "+ Log Pet Activity" to add one!
          </div>
        )}

        {/* Gentle Celebratory Insight Badge */}
        {stats.insight && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'var(--accent-primary-light)',
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              color: 'var(--accent-primary)',
              fontWeight: 700
            }}
          >
            <Sparkles size={13} style={{ flexShrink: 0 }} />
            <span>{stats.insight}</span>
          </div>
        )}
      </div>

      {/* 4. Progressive Disclosure History Link */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => setIsHistoryModalOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-primary)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <BookOpen size={13} />
          <span>Review Pet Play History</span>
        </button>
      </div>

      {/* Modals */}
      <LogPetPlayModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onOpenManagePets={() => setIsProfileModalOpen(true)}
        defaultPetId={selectedPetId !== 'all' ? selectedPetId : petProfiles[0]?.id}
      />

      <PetProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <PetPlayHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        initialPetId={selectedPetId}
      />

    </div>
  );
}
