import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { calculateScore } from '../data/rarityData';
import { normaliseAnswers } from './Result';
import { generateAIStory } from '../utils/groqStory';

/* ─── Auth ──────────────────────────────────────────────────────── */
const ADMIN_PASSWORD = 'ER@admin2026#secure';
const SESSION_KEY = 'er_admin_auth';

function formatTs(timestamp) {
  if (!timestamp) return '—';
  const ms = typeof timestamp.toMillis === 'function' ? timestamp.toMillis() : timestamp;
  return new Date(ms).toLocaleString();
}

/* ─── Login Screen ──────────────────────────────────────────────── */
function LoginScreen({ onAuth }) {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onAuth();
    } else {
      setError('Access denied.');
      setPwd('');
    }
  }

  return (
    <div style={styles.loginWrap}>
      <form onSubmit={handleSubmit} style={styles.loginCard}>
        <h1 style={styles.loginTitle}>🔒 Admin Access</h1>
        <p style={styles.loginSub}>Earth Ranker — Administration</p>
        <input
          type="password"
          placeholder="Enter admin password"
          value={pwd}
          onChange={e => { setPwd(e.target.value); setError(''); }}
          style={styles.input}
          autoFocus
        />
        {error && <p style={styles.errorText}>{error}</p>}
        <button type="submit" style={styles.loginBtn}>Authenticate</button>
      </form>
    </div>
  );
}

/* ─── Edit Modal ────────────────────────────────────────────────── */
function EditModal({ entry, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...entry });
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { _docId, ...updateData } = formData;
      await updateDoc(doc(db, 'leaderboard', _docId), updateData);
      onSave(`✓ Updated "${formData.displayName}" successfully`);
      onClose();
    } catch (err) {
      alert('Update failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = (formData.allSkills || []).filter((_, i) => i !== index);
    setFormData({ ...formData, allSkills: updatedSkills, skills: updatedSkills });
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const updatedSkills = [...(formData.allSkills || []), newSkill.trim()];
    setFormData({ ...formData, allSkills: updatedSkills, skills: updatedSkills });
    setNewSkill('');
  };

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.dialog, maxWidth: 600, textAlign: 'left' }}>
        <h2 style={{ ...styles.title, fontSize: '1.25rem', marginBottom: '1.5rem' }}>Master Control: Edit User</h2>

        <div style={styles.grid}>
          <div style={styles.field}>
            <label style={styles.label}>Display Name</label>
            <input
              style={styles.input}
              value={formData.displayName || ''}
              onChange={e => setFormData({ ...formData, displayName: e.target.value })}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Country</label>
            <input
              style={styles.input}
              value={formData.country || ''}
              onChange={e => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Score (0-100)</label>
            <input
              type="number"
              style={styles.input}
              value={formData.score || 0}
              onChange={e => setFormData({ ...formData, score: parseFloat(e.target.value) })}
            />
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <label style={styles.label}>Skills Management</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              style={styles.input}
              placeholder="Add new skill..."
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
            />
            <button onClick={addSkill} style={{ ...styles.loginBtn, width: 'auto', padding: '0 1.5rem' }}>Add</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto', padding: '0.5rem', background: '#0a0a14', borderRadius: '8px' }}>
            {(formData.allSkills || []).map((skill, i) => (
              <span key={i} style={styles.skillChip}>
                {skill}
                <button onClick={() => removeSkill(i)} style={styles.skillRemove}>×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Skill Cap Override */}
        <div style={{ marginTop: '1.5rem' }}>
          <label style={styles.label}>Max Skills to Count (Owner Override)</label>
          <input
            type="number"
            style={styles.input}
            value={formData.maxSkillsOverride || 3}
            onChange={e => setFormData({
              ...formData,
              maxSkillsOverride: parseInt(e.target.value) || 3
            })}
            min="3"
            max="10"
          />
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.3rem' }}>
            Default = 3 (normal rule). Set to 4+ only for your own profile.
          </p>
        </div>

        <div style={{ ...styles.dialogBtns, marginTop: '2rem' }}>
          <button style={styles.cancelBtn} onClick={onClose} disabled={saving}>Cancel</button>
          <button style={{ ...styles.confirmDeleteBtn, background: '#4ade80' }} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Panel ────────────────────────────────────────────────── */
function AdminPanelInner() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query_, setQuery_] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [notification, setNotification] = useState({ msg: '', type: '' });

  const handleNotify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification({ msg: '', type: '' }), 4000);
  };

  // ─── Builds the quiz-format object that normaliseAnswers() expects.
  // Handles ALL legacy field name variants stored in Firestore.
  function buildQuizAnswers(d) {
    // Resolve skills from whichever field variant is present and non-empty
    const skills =
      (Array.isArray(d.skills) && d.skills.length > 0) ? d.skills :
        (Array.isArray(d.allSkills) && d.allSkills.length > 0) ? d.allSkills :
          (Array.isArray(d.topSkills) && d.topSkills.length > 0) ? d.topSkills :
            [];

    return {
      // normaliseAnswers reads: raw.hand → handedness
      hand: d.handedness || d.hand || '',
      // normaliseAnswers reads: raw.blood → bloodType
      blood: d.bloodType || d.blood || '',
      eyeColor: d.eyeColor || '',
      hairColor: d.hairColor || '',
      country: d.country || '',
      gender: d.gender || '',
      // normaliseAnswers applies EDUCATION_MAP to raw.education
      education: d.education || '',
      // normaliseAnswers calls getAgeBucket(raw.age) to produce ageGroup
      age: d.age || '',
      // Also pass ageGroup directly — normaliseAnswers uses it as fallback when age is absent
      ageGroup: d.ageGroup || '',
      skills,
      bDay: d.bDay || d.birthDay || '',
      bMonth: d.bMonth || d.birthMonth || '',
      bYear: d.bYear || d.birthYear || '',
      nameInitial: d.nameInitial || '',
      moles: Array.isArray(d.moleLocations) ? d.moleLocations : [],
      maxSkillsOverride: d.maxSkillsOverride,
    };
  }

  const handleRecalculateSingle = async (entry) => {
    handleNotify(`Recalculating "${entry.displayName}"...`, 'info');
    try {
      // Step 1: build quiz-format answers from whatever is stored
      const quizAnswers = buildQuizAnswers(entry);

      // Step 2: normalise (maps hand→handedness, blood→bloodType, age→ageGroup bucket, education key)
      const normAnswers = normaliseAnswers(quizAnswers);

      // Step 3: calculate (normaliseAnswers already handles ageGroup fallback via buildQuizAnswers)
      const result = calculateScore(normAnswers);

      // Step 4: regenerate AI story — wrapped in its OWN try-catch so a story API
      // failure never blocks the score update from being saved.
      let newStory = entry.aiStory || ''; // default: keep the existing story
      try {
        const profileForAI = {
          userName: entry.displayName,
          country: normAnswers.country || '',
          age: quizAnswers.age || '',
          education: normAnswers.education || '',
          bloodType: normAnswers.bloodType || '',
          eyeColor: normAnswers.eyeColor || '',
          hairColor: normAnswers.hairColor || '',
          handedness: normAnswers.handedness || '',
          skills: quizAnswers.skills || [],
          score: result.score,
          tier: result.rarityTier,
          oneIn: result.oneIn,
          estimatedRank: result.estimatedRank,
          topPercentile: result.topPercentile,
        };
        const generated = await generateAIStory(profileForAI);
        if (generated) newStory = generated;
      } catch (aiErr) {
        console.warn(`AI story generation failed for "${entry.displayName}", keeping existing story.`, aiErr);
        handleNotify(`⚠️ Score updated, but AI story failed (kept old). ${aiErr.message}`, 'info');
      }

      // Step 6: write back — also normalise field names for future recalcs
      const updateData = {
        score: Number(result.score.toFixed(2)),
        tier: result.rarityTier,
        tierEmoji: result.tierEmoji,
        oneIn: result.oneIn,
        estimatedRank: result.estimatedRank,
        topPercentile: Number(result.topPercentile.toFixed(6)),
        aiStory: newStory,
        // Write normalised field names so future recalcs always work
        handedness: normAnswers.handedness || '',
        bloodType: normAnswers.bloodType || '',
        ageGroup: normAnswers.ageGroup || '',
        education: normAnswers.education || '',
        skills: quizAnswers.skills,
        allSkills: quizAnswers.skills,
        topSkills: result.traitBreakdown
          ?.filter(t => t.isSkill && t.counted)
          ?.slice(0, 3)
          ?.map(t => t.value) || [],
      };
      
      // Persist admin skill cap override
      if (quizAnswers.maxSkillsOverride != null) {
        updateData.maxSkillsOverride = quizAnswers.maxSkillsOverride;
      }
      
      await updateDoc(doc(db, 'leaderboard', entry._docId), updateData);

      handleNotify(`✅ "${entry.displayName}" updated!`, 'success');
    } catch (err) {
      console.error('Recalculate failed:', err);
      handleNotify(`❌ Error: ${err.message}`, 'error');
    }
  };

  const handleRecalculateAll = async () => {
    if (!window.confirm(
      'This will re-calculate scores AND regenerate AI Stories for ALL entries. Continue?'
    )) return;

    setMigrating(true);
    let successCount = 0;
    let failedCount = 0;

    try {
      const querySnapshot = await getDocs(collection(db, 'leaderboard'));

      for (const docSnap of querySnapshot.docs) {
        try {
          const data = docSnap.data();

          // Same pipeline as handleRecalculateSingle
          const quizAnswers = buildQuizAnswers(data);
          // normaliseAnswers handles ageGroup fallback automatically via buildQuizAnswers
          const normAnswers = normaliseAnswers(quizAnswers);
          const result = calculateScore(normAnswers);

          // Regenerate AI story with small delay to avoid rate limits
          let newStory = data.aiStory || '';
          try {
            await new Promise(r => setTimeout(r, 500));
            const profileForAI = {
              userName: data.displayName,
              country: normAnswers.country || '',
              age: quizAnswers.age || '',
              education: normAnswers.education || '',
              bloodType: normAnswers.bloodType || '',
              eyeColor: normAnswers.eyeColor || '',
              hairColor: normAnswers.hairColor || '',
              handedness: normAnswers.handedness || '',
              skills: quizAnswers.skills || [],
              score: result.score,
              tier: result.rarityTier,
              oneIn: result.oneIn,
              estimatedRank: result.estimatedRank,
              topPercentile: result.topPercentile,
            };
            newStory = await generateAIStory(profileForAI);
          } catch (aiErr) {
            console.warn(`AI story failed for ${data.displayName}, keeping old.`, aiErr);
          }

          const updateData = {
            score: Number(result.score.toFixed(2)),
            tier: result.rarityTier,
            tierEmoji: result.tierEmoji,
            oneIn: result.oneIn,
            estimatedRank: result.estimatedRank,
            topPercentile: Number(result.topPercentile.toFixed(6)),
            aiStory: newStory,
            handedness: normAnswers.handedness || '',
            bloodType: normAnswers.bloodType || '',
            ageGroup: normAnswers.ageGroup || '',
            education: normAnswers.education || '',
            skills: quizAnswers.skills,
            allSkills: quizAnswers.skills,
            topSkills: result.traitBreakdown
              ?.filter(t => t.isSkill && t.counted)
              ?.slice(0, 3)
              ?.map(t => t.value) || [],
          };
          
          if (quizAnswers.maxSkillsOverride != null) {
            updateData.maxSkillsOverride = quizAnswers.maxSkillsOverride;
          }
          
          await updateDoc(doc(db, 'leaderboard', docSnap.id), updateData);

          successCount++;
        } catch (docErr) {
          console.error('Failed to update doc:', docSnap.id, docErr);
          failedCount++;
        }
      }

      handleNotify(
        `✅ Done! ${successCount} updated, ${failedCount} failed.`,
        'success'
      );
    } catch (err) {
      console.error('Migration error:', err);
      handleNotify(`❌ Migration failed: ${err.message}`, 'error');
    } finally {
      setMigrating(false);
    }
  };

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const rawEntries = snap.docs.map(d => ({ _docId: d.id, ...d.data() }));
      // ── Leaderboard sort: score → oneIn → trait count → skill count ───────────
      const NON_DATA_KEYS = new Set([
        '_docId', 'id', 'displayName', 'score', 'tier', 'tierEmoji',
        'oneIn', 'estimatedRank', 'topPercentile', 'aiStory',
        'topSkills', 'hand', 'blood',
      ]);
      const countTraits = (entry) =>
        Object.keys(entry).filter(k => !NON_DATA_KEYS.has(k) && entry[k] !== '' && entry[k] !== null && entry[k] !== undefined).length;

      const sorted = [...rawEntries].sort((a, b) => {
        // Primary: score (higher = rarer)
        if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
        // Tiebreaker 1: oneIn (higher = rarer)
        if ((b.oneIn || 0) !== (a.oneIn || 0)) return (b.oneIn || 0) - (a.oneIn || 0);
        // Tiebreaker 2: trait count (more complete profile = more trustworthy)
        const aTraits = countTraits(a);
        const bTraits = countTraits(b);
        if (bTraits !== aTraits) return bTraits - aTraits;
        // Tiebreaker 3: skill count (more diverse = higher rank)
        const aSkills = (a.allSkills || a.skills || []).length;
        const bSkills = (b.allSkills || b.skills || []).length;
        return bSkills - aSkills;
      });
      setEntries(sorted);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return unsub;
  }, []);

  const filtered = entries.filter(e => {
    if (!query_) return true;
    const q = query_.toLowerCase();
    return (
      (e.displayName || '').toLowerCase().includes(q) ||
      (e.country || '').toLowerCase().includes(q)
    );
  });

  const pendingEntry = entries.find(e => e._docId === confirmId);

  async function handleDelete() {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'leaderboard', confirmId));
      handleNotify(`✓ Deleted "${pendingEntry?.displayName || confirmId}"`);
    } catch (err) {
      handleNotify(`❌ Delete failed: ${err.message}`, 'error');
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Earth Ranker — Admin Master Panel</h1>
          <p style={styles.subtitle}>
            Sorted by Score &nbsp;•&nbsp;
            <span style={{ color: '#4ade80' }}>{entries.length} total entries</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            style={{ ...styles.logoutBtn, background: '#1e3a8a', color: '#fff', borderColor: '#1e40af' }}
            onClick={handleRecalculateAll}
            disabled={migrating}
          >
            {migrating ? 'Recalculating...' : '🔄 Recalculate All'}
          </button>
          <button
            style={styles.logoutBtn}
            onClick={() => { sessionStorage.removeItem(SESSION_KEY); window.location.reload(); }}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification.msg && (
        <div style={{
          ...styles.notification,
          background: notification.type === 'error' ? '#450a0a' : '#14532d',
          border: `1px solid ${notification.type === 'error' ? '#7f1d1d' : '#166534'}`,
          color: notification.type === 'error' ? '#f87171' : '#4ade80',
        }}>
          <span>{notification.msg}</span>
          <button
            onClick={() => setNotification({ msg: '', type: '' })}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1.2rem', marginLeft: '1rem' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search users..."
        value={query_}
        onChange={e => setQuery_(e.target.value)}
        style={styles.searchInput}
      />

      {/* Table */}
      {loading ? (
        <p style={styles.loadingText}>Loading database...</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Rank', 'Name', 'Country', 'Rarity (1 in X)', 'Tier', 'Score', 'Skills', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={e._docId} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={{ ...styles.td, fontWeight: 600, color: '#e2e8f0' }}>{e.displayName || '—'}</td>
                  <td style={styles.td}>{e.country || '—'}</td>
                  <td style={{ ...styles.td, color: '#fbbf24' }}>{e.oneIn?.toLocaleString() || '—'}</td>
                  <td style={styles.td}>{e.tier || '—'}</td>
                  <td style={styles.td}>{e.score?.toFixed(2) ?? '—'}</td>
                  <td style={styles.td}>{e.allSkills?.length || e.skills?.length || e.topSkills?.length || 0}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        style={{ ...styles.deleteBtn, background: '#1e3a8a', borderColor: '#1e40af', color: '#93c5fd' }}
                        onClick={() => setEditEntry(e)}
                      >
                        Edit
                      </button>
                      <button
                        style={{ ...styles.deleteBtn, background: '#14532d', borderColor: '#166534', color: '#4ade80' }}
                        onClick={() => handleRecalculateSingle(e)}
                      >
                        Recalc
                      </button>
                      <button style={styles.deleteBtn} onClick={() => setConfirmId(e._docId)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {editEntry && <EditModal entry={editEntry} onClose={() => setEditEntry(null)} onSave={handleNotify} />}

      {confirmId && pendingEntry && (
        <div style={styles.overlay}>
          <div style={styles.dialog}>
            <p style={styles.dialogText}>Delete <strong>{pendingEntry.displayName}</strong>?</p>
            <div style={styles.dialogBtns}>
              <button style={styles.cancelBtn} onClick={() => setConfirmId(null)}>Cancel</button>
              <button style={styles.confirmDeleteBtn} onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  if (!authed) return <LoginScreen onAuth={() => setAuthed(true)} />;
  return <AdminPanelInner />;
}

/* ─── Styles ────────────────────────────────────────────────────── */
const styles = {
  loginWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a14' },
  loginCard: { background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: '2.5rem', width: 360, display: 'flex', flexDirection: 'column', gap: '1rem' },
  loginTitle: { color: '#f1f5f9', margin: 0, fontSize: '1.5rem' },
  loginSub: { color: '#6b7280', fontSize: '0.875rem', margin: 0 },
  input: { padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#f1f5f9', width: '100%', boxSizing: 'border-box' },
  loginBtn: { padding: '0.75rem', borderRadius: 8, border: 'none', background: '#6c47ff', color: '#fff', fontWeight: 700, cursor: 'pointer' },
  errorText: { color: '#f87171', fontSize: '0.875rem' },
  page: { minHeight: '100vh', background: '#0a0a14', color: '#d1d5db', padding: '1.5rem', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #1f2937', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontSize: '1.5rem', color: '#f1f5f9', margin: 0 },
  subtitle: { color: '#6b7280', fontSize: '0.875rem', marginTop: 4 },
  logoutBtn: { padding: '0.5rem 1rem', borderRadius: 6, border: '1px solid #374151', background: '#1f2937', color: '#9ca3af', cursor: 'pointer' },
  notification: { borderRadius: 8, padding: '0.65rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  searchInput: { padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#f1f5f9', width: '100%', maxWidth: 400, marginBottom: '1.5rem' },
  loadingText: { color: '#6b7280', padding: '2rem 0' },
  tableWrap: { overflowX: 'auto', borderRadius: 10, border: '1px solid #1f2937' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' },
  th: { background: '#111827', color: '#9ca3af', padding: '1rem', textAlign: 'left', textTransform: 'uppercase', fontSize: '0.75rem', borderBottom: '1px solid #1f2937' },
  td: { padding: '1rem', borderBottom: '1px solid #1a2030' },
  rowEven: { background: 'transparent' },
  rowOdd: { background: 'rgba(255,255,255,0.015)' },
  deleteBtn: { padding: '0.4rem 0.8rem', borderRadius: 6, border: '1px solid #7f1d1d', background: '#450a0a', color: '#f87171', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  dialog: { background: '#111827', border: '1px solid #374151', borderRadius: 12, padding: '2rem', width: '100%', maxWidth: 480 },
  dialogText: { fontSize: '1.1rem', color: '#f1f5f9', marginBottom: '1.5rem' },
  dialogBtns: { display: 'flex', gap: '1rem' },
  cancelBtn: { padding: '0.6rem 1.5rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#9ca3af', cursor: 'pointer' },
  confirmDeleteBtn: { padding: '0.6rem 1.5rem', borderRadius: 8, border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer', fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 },
  skillChip: { background: '#6c47ff20', color: '#a78bfa', border: '1px solid #6c47ff40', borderRadius: '6px', padding: '0.2rem 0.6rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' },
  skillRemove: { background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1rem', padding: 0 },
};