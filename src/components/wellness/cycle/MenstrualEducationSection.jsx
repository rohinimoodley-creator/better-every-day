import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Heart, 
  Footprints, 
  Utensils, 
  Moon, 
  Brain, 
  Droplet, 
  Calendar as CalendarIcon,
  ShieldCheck,
  Info
} from 'lucide-react';

export default function MenstrualEducationSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePhaseTab, setActivePhaseTab] = useState('menstrual');

  return (
    <div 
      className="card-glass" 
      id="menstrual-education-section"
      style={{ 
        marginTop: '1.5rem',
        padding: '1.4rem',
        border: '1px solid rgba(214, 64, 98, 0.25)',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(214, 64, 98, 0.04) 100%)',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      {/* Section Toggle Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🌸</span>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Understand Your Menstrual Cycle
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
              Simple, scientifically accurate guide to hormones, phases, and daily rhythms.
            </p>
          </div>
        </div>

        <button 
          type="button"
          aria-label={isOpen ? 'Collapse Education' : 'Expand Education'}
          style={{
            background: 'var(--bg-tertiary)',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            padding: '0.4rem 0.85rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <span>{isOpen ? 'Close Guide' : 'Learn More'}</span>
          {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {/* Expanded Educational Content */}
      {isOpen && (
        <div style={{ marginTop: '1.35rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.35rem', animation: 'fadeIn 0.2s ease-out' }}>
          
          {/* 1. Biology & Hormones in Plain English */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-rose)' }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: 'var(--text-primary)' }}>
              What is the Menstrual Cycle? 🔬
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 0.6rem 0' }}>
              The <strong>menstrual cycle</strong> is a natural monthly rhythm orchestrated by your reproductive and nervous systems. It prepares your body for the possibility of pregnancy each month, guided primarily by natural chemical signals called <strong>hormones</strong>.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem', marginTop: '0.5rem' }}>
              <div style={{ background: 'var(--bg-card)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ fontSize: '0.82rem', color: 'var(--accent-rose)', display: 'block', marginBottom: '0.2rem' }}>
                  What are Hormones?
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  <strong>Hormones</strong> are chemical messengers in your body. They travel through your bloodstream and gently tell different organs when to rest, build energy, or release an egg.
                </span>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ fontSize: '0.82rem', color: 'var(--accent-purple)', display: 'block', marginBottom: '0.2rem' }}>
                  The Two Key Players
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  <strong>Estrogen</strong> builds the uterine lining and boosts mental energy. <strong>Progesterone</strong> stabilizes the lining, promotes relaxation, and supports calming sleep.
                </span>
              </div>
            </div>
          </div>

          {/* 2. The Four Main Phases (Interactive Tabs) */}
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
              The Four Phases of the Cycle 🔄
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0' }}>
              Every cycle moves through four distinct phases. Click each phase to learn what happens inside your body:
            </p>

            {/* Phase Switcher */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem', marginBottom: '0.85rem' }}>
              {[
                { id: 'menstrual', label: 'Menstrual', icon: '🩸', color: '#d64062' },
                { id: 'follicular', label: 'Follicular', icon: '🌱', color: '#52b788' },
                { id: 'ovulation', label: 'Ovulation', icon: '🌸', color: '#f4a261' },
                { id: 'luteal', label: 'Luteal', icon: '🌙', color: '#7b61ff' }
              ].map(p => (
                <button
                  key={p.id}
                  id={`edu-phase-tab-${p.id}`}
                  type="button"
                  onClick={() => setActivePhaseTab(p.id)}
                  style={{
                    padding: '0.5rem 0.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: activePhaseTab === p.id ? `2px solid ${p.color}` : '1px solid var(--border-subtle)',
                    background: activePhaseTab === p.id ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
                    color: activePhaseTab === p.id ? 'var(--text-primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.2rem',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{p.icon}</span>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700 }}>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Phase Detail Cards */}
            {activePhaseTab === 'menstrual' && (
              <div className="card-glass" style={{ padding: '1rem', borderLeft: '4px solid #d64062' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🩸</span>
                  <strong style={{ fontSize: '0.92rem', color: '#d64062' }}>
                    Menstrual Phase (Days 1–5 approx)
                  </strong>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 0.5rem 0' }}>
                  This is when your period occurs. Because pregnancy did not happen in the previous cycle, the uterus gently sheds its soft inner lining through the vagina. Both estrogen and progesterone levels are low.
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                  💡 <strong>Common Experiences:</strong> Some people experience cramps, fatigue, mild headaches, or a desire for quiet rest. Others feel minimal changes. Experiences can differ each month.
                </div>
              </div>
            )}

            {activePhaseTab === 'follicular' && (
              <div className="card-glass" style={{ padding: '1rem', borderLeft: '4px solid #52b788' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🌱</span>
                  <strong style={{ fontSize: '0.92rem', color: '#52b788' }}>
                    Follicular Phase (Days 6–13 approx)
                  </strong>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 0.5rem 0' }}>
                  This phase starts on the first day of your period and continues until ovulation. Inside your ovaries, tiny fluid-filled sacs called <strong>follicles</strong> mature, each containing an egg. <strong>Estrogen</strong> steadily rises, thickening the uterine lining and renewing physical vitality.
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                  💡 <strong>Common Experiences:</strong> Many people notice rising stamina, mental clarity, and an openness to new workouts or social plans as estrogen builds.
                </div>
              </div>
            )}

            {activePhaseTab === 'ovulation' && (
              <div className="card-glass" style={{ padding: '1rem', borderLeft: '4px solid #f4a261' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🌸</span>
                  <strong style={{ fontSize: '0.92rem', color: '#f4a261' }}>
                    Ovulation Phase (Around Day 14)
                  </strong>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 0.5rem 0' }}>
                  <strong>Ovulation</strong> is the moment a mature follicle releases an egg into the fallopian tube. This is the fertility window when pregnancy can occur if sperm is present. The egg survives for about 12 to 24 hours.
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                  💡 <strong>Common Experiences:</strong> Some people notice clear, stretchy discharge, a slight rise in body temperature, or a confidence boost; others notice no physical signs at all.
                </div>
              </div>
            )}

            {activePhaseTab === 'luteal' && (
              <div className="card-glass" style={{ padding: '1rem', borderLeft: '4px solid #7b61ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🌙</span>
                  <strong style={{ fontSize: '0.92rem', color: '#7b61ff' }}>
                    Luteal Phase (Days 15–28 approx)
                  </strong>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 0.5rem 0' }}>
                  After ovulation, the empty follicle becomes the <em>corpus luteum</em> and produces <strong>progesterone</strong>. Progesterone keeps the uterine lining ready for a fertilized egg. If pregnancy does not happen, progesterone and estrogen drop, signaling the start of the next period.
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                  💡 <strong>Common Experiences:</strong> You may notice increased appetite, cravings for comforting foods, or shifts in mood and sleep (premenstrual syndrome / PMS). Giving yourself extra compassion helps.
                </div>
              </div>
            )}
          </div>

          {/* 3. Cycle Phases are NOT Personality Types */}
          <div style={{ background: 'rgba(64, 145, 108, 0.08)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Heart size={13} /> Phases Are Context, Not Personality Types
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', lineHeight: 1.45 }}>
              Some people notice noticeable shifts in energy or appetite during different phases, while others feel steady throughout the month. Better Every Day uses your cycle as an optional contextual layer—never as rigid rules.
            </p>
          </div>

          {/* 4. How Cycle Works with Better Every Day */}
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: 'var(--text-primary)' }}>
              How Cycle Connects with Your Wellness Hubs 🔗
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0' }}>
              When cycle sync is enabled, Better Every Day offers gentle, coordinated suggestions behind the scenes:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-primary)' }}>
                  <Footprints size={14} /> <span>Cycle + Move</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                  Suggests restorative stretching during menstruation and stamina workouts during follicular/ovulation, while always letting you choose.
                </p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-primary)' }}>
                  <Utensils size={14} /> <span>Cycle + Nourish</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                  Highlights iron-rich warm meals during periods and magnesium-rich soothing foods during luteal cravings without strict diets.
                </p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-primary)' }}>
                  <Moon size={14} /> <span>Cycle + Rest</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                  Considers hormonal shifts alongside your actual sleep logs to suggest calming soundscapes and earlier wind-down times.
                </p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-primary)' }}>
                  <Brain size={14} /> <span>Cycle + Mind</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                  Offers gentle self-compassion prompts without assuming your cycle is always the sole cause of emotional fluctuations.
                </p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-primary)' }}>
                  <Droplet size={14} /> <span>Cycle + Hydrate</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                  Balances hydration goals with physical activity, weather, and electrolyte balance across the month.
                </p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-primary)' }}>
                  <CalendarIcon size={14} /> <span>Cycle + Calendar</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                  Portrays phase indicators and predicted windows across your monthly schedule so you can plan life alongside your rhythm.
                </p>
              </div>
            </div>
          </div>

          {/* 5. Non-Medical Disclaimer */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-sm)', fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
            <Info size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Educational Note:</strong> This guide provides general biological information about menstrual cycles. It does not diagnose medical conditions, predict fertility guarantees, or replace personalized medical consultation. If you experience severe pain, unusual bleeding, or sudden cycle changes, always consult a healthcare provider.
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
