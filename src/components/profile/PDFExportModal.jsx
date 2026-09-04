import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  FileText,
  Download,
  ShieldCheck,
  CheckSquare,
  Square,
  AlertCircle,
  X,
  Sparkles,
  Calendar,
  Lock,
  CheckCircle,
  Eye
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

export default function PDFExportModal({ isOpen, onClose }) {
  const {
    userProfile,
    dailyCheckIn,
    hydrationMl,
    stepCount,
    loggedMeals,
    journalEntries,
    discoveredGratitude,
    activeWorkoutMinutes,
    completedWorkouts,
    voiceRecordings,
    dailyRhythm,
    betterEveryDayScore
  } = useWellness();

  // Export Category Selection State
  const [selectedCategories, setSelectedCategories] = useState({
    profile: true,
    checkIn: true,
    hydration: true,
    movement: true,
    nutrition: true,
    journals: true,
    gratitude: true,
    voice: true,
    insights: true
  });

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'profile', label: '👤 Profile & Wellness Baseline', desc: 'Name, goals, targets, and rhythm preferences', count: 1 },
    { id: 'checkIn', label: '🌱 Daily Check-In & Mood', desc: "Today's mood, energy, sleep score, and body sensations", count: dailyCheckIn ? 1 : 0 },
    { id: 'hydration', label: '💧 Hydration Tracking', desc: `Current: ${hydrationMl || 1250}ml / Goal: ${userProfile.hydrationGoalMl || 2250}ml`, count: 1 },
    { id: 'movement', label: '🏃 Movement & Activity Logs', desc: `${stepCount || 5420} steps, ${activeWorkoutMinutes || 15}m active time`, count: (completedWorkouts || []).length || 1 },
    { id: 'nutrition', label: '🥗 Nourish & Meal Logs', desc: 'Logged meals with calories & protein details', count: (loggedMeals || []).length },
    { id: 'journals', label: '📝 Journal & Write Reflections', desc: 'Private journal entries and emotional reflections', count: (journalEntries || []).length },
    { id: 'gratitude', label: '💛 Gratitude Moments', desc: 'Discovered gratitude cards and reflections', count: (discoveredGratitude || []).length },
    { id: 'voice', label: '🎙️ Voice-Note Metadata', desc: 'Voice logs, transcripts, and duration logs', count: (voiceRecordings || []).length || 2 },
    { id: 'insights', label: '💡 Wellness Score & Summary', desc: `Overall Consistency Score (${betterEveryDayScore || 85}%) and rhythm details`, count: 1 }
  ];

  const toggleCategory = (id) => {
    setSelectedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selectAll = () => {
    const next = {};
    categories.forEach(c => { next[c.id] = true; });
    setSelectedCategories(next);
  };

  const deselectAll = () => {
    const next = {};
    categories.forEach(c => { next[c.id] = false; });
    setSelectedCategories(next);
  };

  const selectedCount = Object.values(selectedCategories).filter(Boolean).length;

  const generatePDFReport = async () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const todayStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const userName = userProfile?.name || 'Rohini';

      let yPos = 20;
      const margin = 18;
      const pageWidth = 210;
      const contentWidth = pageWidth - margin * 2;

      // Header Brand
      doc.setFillColor(45, 106, 79); // Sage Primary
      doc.rect(margin, yPos, contentWidth, 18, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('BETTER EVERY DAY — PERSONAL WELLNESS REPORT', margin + 6, yPos + 11);

      yPos += 26;

      // Metadata Box
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`User: ${userName}`, margin, yPos);
      doc.text(`Generated: ${todayStr}`, margin + 80, yPos);
      doc.text(`Confidential & Private`, margin + 140, yPos);

      yPos += 8;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // 1. Profile & Baseline
      if (selectedCategories.profile) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(45, 106, 79);
        doc.text('1. Profile & Daily Baseline', margin, yPos);
        yPos += 6;

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text(`• Primary Wellness Goal: ${userProfile.wellnessGoal || 'Energy & Vitality'}`, margin + 4, yPos);
        yPos += 5;
        doc.text(`• Daily Hydration Target: ${userProfile.hydrationGoalMl || 2250} ml`, margin + 4, yPos);
        yPos += 5;
        doc.text(`• Daily Step Target: ${userProfile.stepGoal || 8000} steps`, margin + 4, yPos);
        yPos += 5;
        doc.text(`• Daily Schedule Rhythm: Day Starts at ${dailyRhythm?.dayStartTime || '07:00'} | Sleep at ${dailyRhythm?.sleepTime || '23:00'}`, margin + 4, yPos);
        yPos += 9;
      }

      // 2. Daily Check-In & Mood
      if (selectedCategories.checkIn && dailyCheckIn) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(45, 106, 79);
        doc.text('2. Daily Check-In & State', margin, yPos);
        yPos += 6;

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text(`• Mood: ${dailyCheckIn.mood || 'Good'} | Energy Level: ${dailyCheckIn.energy || 4}/5 | Sleep Quality: ${dailyCheckIn.sleep || 4}/5`, margin + 4, yPos);
        yPos += 5;
        if (dailyCheckIn.bodyTags && dailyCheckIn.bodyTags.length > 0) {
          doc.text(`• Body Sensations: ${dailyCheckIn.bodyTags.join(', ')}`, margin + 4, yPos);
          yPos += 5;
        }
        yPos += 4;
      }

      // 3. Hydration & Movement
      if (selectedCategories.hydration || selectedCategories.movement) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(45, 106, 79);
        doc.text('3. Physical Activity & Hydration', margin, yPos);
        yPos += 6;

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        if (selectedCategories.hydration) {
          doc.text(`• Hydration Logged: ${hydrationMl || 1250} ml (${Math.round(((hydrationMl || 1250) / (userProfile.hydrationGoalMl || 2250)) * 100)}% of daily goal)`, margin + 4, yPos);
          yPos += 5;
        }
        if (selectedCategories.movement) {
          doc.text(`• Steps Tracked: ${stepCount || 5420} steps`, margin + 4, yPos);
          yPos += 5;
          doc.text(`• Active Exercise Duration: ${activeWorkoutMinutes || 15} minutes`, margin + 4, yPos);
          yPos += 5;
        }
        yPos += 4;
      }

      // Check page break before nutrition/journals
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      // 4. Nourish & Nutrition
      if (selectedCategories.nutrition && loggedMeals && loggedMeals.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(45, 106, 79);
        doc.text('4. Nutrition & Meal History', margin, yPos);
        yPos += 6;

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        loggedMeals.forEach(meal => {
          doc.text(`• [${meal.mealType}] ${meal.title} (${meal.calories} kcal, Protein: ${meal.protein}g, Carbs: ${meal.carbs}g, Fiber: ${meal.fiber}g)`, margin + 4, yPos);
          yPos += 5;
        });
        yPos += 4;
      }

      // Check page break
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      // 5. Gratitude Entries
      if (selectedCategories.gratitude && discoveredGratitude && discoveredGratitude.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(45, 106, 79);
        doc.text('5. Gratitude Reflections', margin, yPos);
        yPos += 6;

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        discoveredGratitude.slice(0, 5).forEach(g => {
          doc.text(`• "${g.text}" (${g.theme || 'Daily Moment'})`, margin + 4, yPos);
          yPos += 5;
        });
        yPos += 4;
      }

      // Check page break
      if (yPos > 230) {
        doc.addPage();
        yPos = 20;
      }

      // 6. Journal Entries
      if (selectedCategories.journals && journalEntries && journalEntries.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(45, 106, 79);
        doc.text('6. Journal & Reflections', margin, yPos);
        yPos += 6;

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        journalEntries.slice(0, 3).forEach(j => {
          doc.setFont('helvetica', 'bold');
          doc.text(`• ${j.title || 'Reflection'} (${j.date || todayStr}):`, margin + 4, yPos);
          yPos += 4.5;
          doc.setFont('helvetica', 'normal');
          const snippet = j.content ? j.content.slice(0, 140) + '...' : 'Recorded entry';
          doc.text(`  "${snippet}"`, margin + 6, yPos);
          yPos += 6;
        });
        yPos += 4;
      }

      // Footer disclaimer
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text('Privacy Notice: This PDF document was generated strictly on-device by Better Every Day. No health data was transmitted to external cloud servers.', margin, 285);

      // Save PDF
      doc.save(`BetterEveryDay_Wellness_Report_${userName}_${new Date().toISOString().split('T')[0]}.pdf`);

      setIsGenerating(false);
      setDownloadSuccess(true);
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}

      setTimeout(() => {
        setDownloadSuccess(false);
      }, 3500);

    } catch (err) {
      console.error('PDF Generation Error:', err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: 620, maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Export as PDF 📄
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Select what data to include in your personalized wellness document.
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Privacy Guarantee Alert */}
        <div style={{ background: 'var(--accent-primary-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <ShieldCheck size={16} color="var(--accent-primary)" />
            <strong style={{ fontSize: '0.82rem', color: 'var(--accent-primary)' }}>
              Strict Privacy & Explicit Consent Requirement
            </strong>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            Better Every Day never exports private data automatically. Please choose exactly what information you want included in your export below before generating the file.
          </p>
        </div>

        {/* Quick Select Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Selected Categories ({selectedCount} of {categories.length}):
          </span>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={selectAll}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
            >
              Select All
            </button>
            <button
              type="button"
              onClick={deselectAll}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Category Checkboxes List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {categories.map(cat => {
            const isChecked = !!selectedCategories[cat.id];
            return (
              <label
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: isChecked ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
                  border: `1.5px solid ${isChecked ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.1s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {cat.label}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {cat.desc}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* User Confirmation Checkbox */}
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={e => setIsConfirmed(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              I confirm I want to compile and download this health document for my personal records.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <button
            type="button"
            disabled={selectedCount === 0 || !isConfirmed || isGenerating}
            onClick={generatePDFReport}
            className="btn btn-primary"
            style={{
              flex: 1,
              padding: '0.75rem',
              fontWeight: 800,
              gap: '0.4rem',
              opacity: (selectedCount === 0 || !isConfirmed || isGenerating) ? 0.45 : 1
            }}
          >
            <Download size={16} />
            {isGenerating ? 'Compiling PDF...' : `Generate & Download PDF (${selectedCount} items)`}
          </button>

          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
            Cancel
          </button>
        </div>

        {downloadSuccess && (
          <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.84rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
            ✓ PDF Wellness Report downloaded successfully!
          </div>
        )}

      </div>
    </div>
  );
}
