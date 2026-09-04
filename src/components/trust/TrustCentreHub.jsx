import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import PDFExportModal from '../profile/PDFExportModal';
import {
  Shield,
  ShieldCheck,
  Watch,
  Smartphone,
  Cloud,
  RefreshCw,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Zap,
  Footprints,
  Droplets,
  Utensils,
  Moon,
  Sparkles,
  Layers,
  History,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TrustCentreHub() {
  const {
    userProfile,
    connectedDevices,
    toggleDeviceConnection,
    syncDeviceNow,
    syncStatus,
    lastSyncTime,
    triggerManualSync,
    dataAnomalies,
    resolveAnomaly,
    duplicateSuggestions,
    resolveDuplicateActivity,
    auditLogs,
    voiceAudioRetention,
    updateVoiceAudioRetention,
    eraseAllUserData
  } = useWellness();

  const [activeTrustTab, setActiveTrustTab] = useState('devices'); // 'devices' | 'tracked' | 'integrity' | 'privacy' | 'export'
  const [selectedPermissionDevice, setSelectedPermissionDevice] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleManualSyncAll = () => {
    triggerManualSync();
    try {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  };

  const handleExportFullArchive = () => {
    const archiveBundle = {
      userProfile,
      connectedDevices,
      auditLogs,
      exportedAt: new Date().toISOString(),
      platform: 'Better Every Day Trust Archive',
      dataOwnershipGuarantee: 'All wellness data is owned exclusively by the user.'
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(archiveBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `better_every_day_trust_archive_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', paddingBottom: '3.5rem' }}>
      {/* Header Banner */}
      <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.25rem' }}>
              <ShieldCheck size={12} /> Data Trust & Reliability
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.2rem 0' }}>
              Trust Centre & Connected Services 🔐
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              "You own your information. We prioritize transparency, privacy by default, and accurate multi-source data."
            </p>
          </div>

          {/* Sync Status Badge & Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Status</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: syncStatus === 'synced' ? 'var(--accent-primary)' : 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: syncStatus === 'synced' ? 'var(--accent-primary)' : 'var(--accent-secondary)' }} />
                {syncStatus === 'synced' ? '🟢 Synced' : syncStatus === 'syncing' ? '🔄 Syncing...' : '⚠️ Sync Alert'}
              </div>
            </div>

            <button
              onClick={handleManualSyncAll}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.3rem', fontSize: '0.78rem' }}
              title="Sync All Services"
            >
              <RefreshCw size={13} className={syncStatus === 'syncing' ? 'animate-spin' : ''} /> Sync Now
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Nav Tabs Toolbar */}
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.35rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.6rem'
        }}
      >
        {[
          { id: 'devices', label: `⌚ Connected Devices (${connectedDevices.filter(d => d.connected).length})` },
          { id: 'tracked', label: `📊 What I Track` },
          { id: 'integrity', label: `🔄 Data Integrity & Duplicates (${duplicateSuggestions.filter(d => d.status === 'pending').length})` },
          { id: 'privacy', label: `🛡️ Privacy Boundaries` },
          { id: 'export', label: `📦 Export & Account Erasure` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTrustTab(tab.id)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeTrustTab === tab.id ? 'var(--accent-primary-light)' : 'transparent',
              color: activeTrustTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          TAB 1: CONNECTED DEVICES & WEARABLES
          ========================================================================= */}
      {activeTrustTab === 'devices' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            ⌚ <strong>Multi-Device Architecture:</strong> Connect your smartwatch or health platform. The app requests only the permissions needed and never shares device data without your explicit consent.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {connectedDevices.map(dev => (
              <div key={dev.id} className="card-glass" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>{dev.icon}</span>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{dev.name}</h4>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{dev.category}</span>
                      </div>
                    </div>

                    <span className={`pill-badge ${dev.connected ? 'primary' : 'gray'}`} style={{ fontSize: '0.68rem' }}>
                      {dev.connected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>

                  {dev.connected && (
                    <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Last synced: {dev.lastSynced}</span>
                      {dev.batteryPercent && <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>🔋 {dev.batteryPercent}%</span>}
                    </div>
                  )}

                  {/* Permissions Summary */}
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    <strong>Active Permissions:</strong>
                    <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0 }}>
                      {dev.permissions.map((p, idx) => (
                        <li key={idx} style={{ color: p.granted ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {p.name} {p.granted ? '✓' : '(Not Granted)'}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <button
                    onClick={() => toggleDeviceConnection(dev.id)}
                    className={`btn btn-sm ${dev.connected ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ flex: 1, fontSize: '0.75rem' }}
                  >
                    {dev.connected ? 'Disconnect' : 'Connect Device'}
                  </button>
                  {dev.connected && (
                    <button
                      onClick={() => syncDeviceNow(dev.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                      title="Sync this device"
                    >
                      <RefreshCw size={13} className={dev.status === 'syncing' ? 'animate-spin' : ''} />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedPermissionDevice(dev)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                    title="View why permissions are needed"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: WHAT I TRACK
          ========================================================================= */}
      {activeTrustTab === 'tracked' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            📊 <strong>Transparent Tracking Attribution:</strong> Every data point tracks its origin so you always know if information came from your own manual entry, your watch, or voice AI.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
            {[
              { title: 'Walking & Steps', icon: '🚶', source: 'Smartwatch + Phone Sensors', note: 'Smartwatch takes priority when present.' },
              { title: 'Hydration & Water', icon: '💧', source: 'Manual User Logs & Voice AI', note: 'Never modified without your confirmation.' },
              { title: 'Meals & Nourishment', icon: '🥗', source: 'Manual Meal Logger', note: 'Dishes and plant diversity tracked locally.' },
              { title: 'Mind & Gratitude', icon: '💛', source: 'Manual Journal & Voice Discoveries', note: 'AI suggestions require your approval.' },
              { title: 'Sleep & Recovery', icon: '🌙', source: 'Smartwatch Auto-Detect', note: 'Used only for gentle morning rhythm suggestions.' },
              { title: 'Menstrual Rhythm', icon: '🌸', source: 'Private Voluntary Log', note: '100% locally controlled. Excluded from AI if disabled.' }
            ].map((item, idx) => (
              <div key={idx} className="card-glass" style={{ padding: '1.15rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', margin: 0 }}>{item.title}</h4>
                    <span className="pill-badge primary" style={{ fontSize: '0.65rem' }}>
                      {item.source}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: DATA INTEGRITY, DUPLICATES & ANOMALIES
          ========================================================================= */}
      {activeTrustTab === 'integrity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Duplicate Resolution Section */}
          <div>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} color="var(--accent-primary)" /> Duplicate Activity Detection
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0' }}>
              When a smartwatch and a manual entry cover the same time window, the system suggests combining them rather than doubling your stats.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {duplicateSuggestions.map(dup => (
                <div key={dup.id} className="card-glass" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.92rem' }}>{dup.category}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{dup.timestamp}</span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0' }}>
                    {dup.neutralPrompt}
                  </p>

                  <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.85rem', fontSize: '0.78rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <strong>Source A ({dup.itemA.source}):</strong>
                      <div>{dup.itemA.title} • {dup.itemA.steps} steps (~{dup.itemA.calories} kcal)</div>
                    </div>
                    <div>
                      <strong>Source B ({dup.itemB.source}):</strong>
                      <div>{dup.itemB.title} • {dup.itemB.steps} steps (~{dup.itemB.calories} kcal)</div>
                    </div>
                  </div>

                  {dup.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button onClick={() => resolveDuplicateActivity(dup.id, 'combine')} className="btn btn-primary btn-sm">
                        Combine into Single Log
                      </button>
                      <button onClick={() => resolveDuplicateActivity(dup.id, 'keep_both')} className="btn btn-secondary btn-sm">
                        Keep Both
                      </button>
                      <button onClick={() => resolveDuplicateActivity(dup.id, 'ignore')} className="btn btn-secondary btn-sm">
                        Ignore
                      </button>
                    </div>
                  ) : (
                    <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
                      Resolved: {dup.status.toUpperCase()} ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Anomaly Review Section */}
          <div>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} color="var(--accent-secondary)" /> Non-Accusatory Anomaly Review
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0' }}>
              We flag unusual sensor spikes neutrally without policing or accusing you.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {dataAnomalies.map(anom => (
                <div key={anom.id} className="card-glass" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.92rem' }}>{anom.metric}: {anom.detectedValue}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{anom.timestamp}</span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0' }}>
                    {anom.neutralExplanation}
                  </p>

                  {anom.status === 'pending_review' ? (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button onClick={() => resolveAnomaly(anom.id, 'confirmed')} className="btn btn-primary btn-sm">
                        Confirm Real Activity
                      </button>
                      <button onClick={() => resolveAnomaly(anom.id, 'corrected')} className="btn btn-secondary btn-sm">
                        Correct Sensor Spike
                      </button>
                      <button onClick={() => resolveAnomaly(anom.id, 'dismissed')} className="btn btn-secondary btn-sm">
                        Dismiss
                      </button>
                    </div>
                  ) : (
                    <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
                      Status: {anom.status.toUpperCase()} ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Audit History Log */}
          <div>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <History size={16} color="var(--accent-primary)" /> Internal Audit Trail (Corrections & Voice AI)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {auditLogs.map(log => (
                <div key={log.id} style={{ background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: 'var(--accent-primary)' }}>[{log.category}]</strong> {log.original} → <em>{log.modified}</em>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: PRIVACY BOUNDARIES & VOICE RETENTION
          ========================================================================= */}
      {activeTrustTab === 'privacy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Voice Audio Privacy & Retention */}
          <div className="card-glass" style={{ padding: '1.35rem' }}>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.4rem 0' }}>🎙️ Voice Recording Audio Retention</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              Choose what happens to raw audio files after your voice journal or log is transcribed into text.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
              {[
                { id: 'transcribe_and_delete', label: 'Transcribe & Delete (Default)', desc: 'Converts speech to text locally and deletes the audio immediately.' },
                { id: 'save_recordings', label: 'Save Audio Recordings', desc: 'Allows you to listen back to your voice logs in your private journal.' },
                { id: 'dont_retain', label: 'Do Not Retain', desc: 'Zero temporary buffer storage.' }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => updateVoiceAudioRetention(opt.id)}
                  style={{
                    background: voiceAudioRetention === opt.id ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                    border: `2px solid ${voiceAudioRetention === opt.id ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer'
                  }}
                >
                  <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)', display: 'block' }}>{opt.label}</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{opt.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Privacy Summary */}
          <div className="card-glass" style={{ padding: '1.35rem' }}>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.4rem 0' }}>🛡️ Social & Community Boundaries</h4>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
              <li><strong>Zero Forced Visibility:</strong> Selecting a gym does not expose your workout schedule or presence.</li>
              <li><strong>Private Stats by Default:</strong> Weight, calories, and cycle data are excluded from social circles and leaderboards.</li>
              <li><strong>Friends-Only Invitations:</strong> Only mutual followers can propose calendar activities.</li>
            </ul>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: DATA EXPORT & ACCOUNT ERASURE
          ========================================================================= */}
      {activeTrustTab === 'export' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* PDF Export Section (Privacy-first granular selection) */}
          <div className="card-glass" style={{ padding: '1.35rem', background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, var(--accent-primary-light) 100%)', border: '1.5px solid var(--accent-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <span className="pill-badge primary" style={{ fontSize: '0.68rem' }}>
                    <FileText size={12} /> Printable Document
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                  Export as PDF Report 📄
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                  Compile your wellness tracking, journals, gratitude moments, and movement history into a clean, structured PDF.
                </p>
              </div>

              <button 
                type="button"
                onClick={() => setIsPDFModalOpen(true)}
                className="btn btn-primary"
                style={{ gap: '0.35rem', fontWeight: 800, boxShadow: '0 3px 12px rgba(45, 106, 79, 0.25)' }}
              >
                <Download size={15} /> Choose & Export PDF
              </button>
            </div>
          </div>

          {/* Full Archive Export */}
          <div className="card-glass" style={{ padding: '1.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <Download size={18} color="var(--accent-primary)" />
              <h4 style={{ fontSize: '1.05rem', margin: 0 }}>Full Wellness JSON Archive</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Download your complete raw wellness history and device configurations in open JSON format.
            </p>

            <button onClick={handleExportFullArchive} className="btn btn-secondary">
              <Download size={14} /> Download Complete JSON Archive
            </button>
          </div>

          {/* Complete Account Wipe */}
          <div className="card-glass" style={{ padding: '1.35rem', borderLeft: '4px solid var(--accent-rose)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <Trash2 size={18} color="var(--accent-rose)" />
              <h4 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--accent-rose)' }}>Erase All Data & Reset Account</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Permanently wipe all local wellness data, journals, gratitude logs, streaks, and AI context memories from this device.
            </p>

            <button onClick={() => setIsDeleteModalOpen(true)} className="btn btn-secondary" style={{ color: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' }}>
              Erase Everything
            </button>
          </div>
        </div>
      )}

      {/* PERMISSION REASONS DETAIL MODAL */}
      {selectedPermissionDevice && (
        <div className="modal-backdrop" onClick={() => setSelectedPermissionDevice(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Permissions for {selectedPermissionDevice.name}</h3>
              <button onClick={() => setSelectedPermissionDevice(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              We only request permissions that directly serve a user-facing feature.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {selectedPermissionDevice.permissions.map((p, idx) => (
                <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>{p.name}</strong>
                    <span className={`pill-badge ${p.granted ? 'primary' : 'gray'}`} style={{ fontSize: '0.68rem' }}>
                      {p.granted ? 'Granted' : 'Optional'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                    <strong>Why requested:</strong> {p.reason}
                  </p>
                </div>
              ))}
            </div>

            <button onClick={() => setSelectedPermissionDevice(null)} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
              Understood
            </button>
          </div>
        </div>
      )}

      {/* ACCOUNT WIPE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', color: 'var(--accent-rose)' }}>
              <AlertTriangle size={22} />
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Confirm Data Deletion</h3>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
              This will permanently delete your check-ins, journal entries, streaks, gratitude logs, and connected device tokens from this browser. This cannot be undone.
            </p>

            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Type <strong>DELETE</strong> below to confirm:
            </p>

            <input
              type="text"
              placeholder="DELETE"
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              className="input-field"
              style={{ marginBottom: '1rem' }}
            />

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={eraseAllUserData}
                disabled={deleteConfirmText !== 'DELETE'}
                className="btn btn-primary"
                style={{ flex: 1, background: 'var(--accent-rose)', opacity: deleteConfirmText === 'DELETE' ? 1 : 0.4 }}
              >
                Permanently Erase
              </button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF EXPORT MODAL */}
      {isPDFModalOpen && (
        <PDFExportModal
          isOpen={isPDFModalOpen}
          onClose={() => setIsPDFModalOpen(false)}
        />
      )}
    </div>
  );
}
