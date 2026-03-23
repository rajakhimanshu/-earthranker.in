import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';

/* ─── Auth ──────────────────────────────────────────────────────── */
const ADMIN_PASSWORD = 'ER@admin2026#secure';
const SESSION_KEY = 'er_admin_auth';

function formatTs(timestamp) {
  if (!timestamp) return '—';
  const ms =
    typeof timestamp.toMillis === 'function' ? timestamp.toMillis() : timestamp;
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

/* ─── Main Panel ────────────────────────────────────────────────── */
function AdminPanelInner() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query_, setQuery_] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState({ msg: '', type: '' });

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setEntries(snap.docs.map(d => ({ _docId: d.id, ...d.data() })));
      setLoading(false);
    }, err => {
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
      setNotification({ msg: `✓ Deleted "${pendingEntry?.displayName || confirmId}"`, type: 'success' });
      setTimeout(() => setNotification({ msg: '', type: '' }), 4000);
    } catch (err) {
      console.error('DELETE ERROR:', err);
      // Keep error visible until user dismisses
      setNotification({ msg: `❌ Delete failed: ${err.message}`, type: 'error' });
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
          <h1 style={styles.title}>Earth Ranker — Admin Panel</h1>
          <p style={styles.subtitle}>
            Leaderboard Management &nbsp;•&nbsp;
            <span style={{ color: '#4ade80' }}>{entries.length} total entries</span>
            {filtered.length !== entries.length && (
              <span style={{ color: '#facc15' }}> ({filtered.length} shown)</span>
            )}
          </p>
        </div>
        <button
          style={styles.logoutBtn}
          onClick={() => { sessionStorage.removeItem(SESSION_KEY); window.location.reload(); }}
        >
          Log Out
        </button>
      </div>

      {/* Notification */}
      {notification.msg && (
        <div style={{
          ...styles.notification,
          background: notification.type === 'error' ? '#450a0a' : '#14532d',
          border: `1px solid ${notification.type === 'error' ? '#7f1d1d' : '#166534'}`,
          color: notification.type === 'error' ? '#f87171' : '#4ade80',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span>{notification.msg}</span>
          <button onClick={() => setNotification({ msg: '', type: '' })} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1rem', marginLeft: '1rem' }}>×</button>
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Filter by name or country…"
        value={query_}
        onChange={e => setQuery_(e.target.value)}
        style={styles.searchInput}
      />

      {/* No DB warning */}
      {!db && (
        <p style={{ color: '#f87171', padding: '1rem' }}>
          ⚠ Firebase is not initialized — check your environment variables.
        </p>
      )}

      {/* Table */}
      {loading ? (
        <p style={styles.loadingText}>Loading…</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['#', 'Name', 'Score', 'Tier', 'Country', 'Timestamp', 'Doc ID', ''].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ ...styles.td, textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                    No entries found.
                  </td>
                </tr>
              )}
              {filtered.map((e, i) => (
                <tr
                  key={e._docId}
                  style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}
                >
                  <td style={styles.td}>{i + 1}</td>
                  <td style={{ ...styles.td, fontWeight: 600, color: '#e2e8f0' }}>{e.displayName || '—'}</td>
                  <td style={{ ...styles.td, color: '#a78bfa' }}>{typeof e.score === 'number' ? e.score.toFixed(2) : e.score || '—'}</td>
                  <td style={styles.td}>{e.tier || '—'}</td>
                  <td style={styles.td}>{e.country || '—'}</td>
                  <td style={{ ...styles.td, fontSize: '0.75rem', color: '#9ca3af' }}>{formatTs(e.timestamp)}</td>
                  <td style={{ ...styles.td, fontSize: '0.7rem', color: '#6b7280', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e._docId}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => setConfirmId(e._docId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmId && pendingEntry && (
        <div style={styles.overlay}>
          <div style={styles.dialog}>
            <p style={styles.dialogText}>
              Delete <strong style={{ color: '#f87171' }}>{pendingEntry.displayName || confirmId}</strong>?
            </p>
            <p style={styles.dialogSub}>This cannot be undone.</p>
            <div style={styles.dialogBtns}>
              <button
                style={styles.cancelBtn}
                onClick={() => setConfirmId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                style={styles.confirmDeleteBtn}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Root Export ───────────────────────────────────────────────── */
export default function AdminPanel() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  );

  if (!authed) return <LoginScreen onAuth={() => setAuthed(true)} />;
  return <AdminPanelInner />;
}

/* ─── Styles (plain objects — no dependency on any CSS file) ─────── */
const styles = {
  loginWrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a14',
  },
  loginCard: {
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: 12,
    padding: '2.5rem',
    width: 360,
    maxWidth: '90vw',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  loginTitle: {
    fontFamily: 'sans-serif',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#f1f5f9',
    margin: 0,
  },
  loginSub: {
    fontFamily: 'sans-serif',
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: 8,
    border: '1px solid #374151',
    background: '#1f2937',
    color: '#f1f5f9',
    fontFamily: 'sans-serif',
    fontSize: '1rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  loginBtn: {
    padding: '0.75rem',
    borderRadius: 8,
    border: 'none',
    background: '#6c47ff',
    color: '#fff',
    fontFamily: 'sans-serif',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
  },
  errorText: {
    color: '#f87171',
    fontFamily: 'sans-serif',
    fontSize: '0.875rem',
    margin: 0,
  },

  page: {
    minHeight: '100vh',
    background: '#0a0a14',
    color: '#d1d5db',
    fontFamily: "'Inter', sans-serif",
    padding: '1.5rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.25rem',
    borderBottom: '1px solid #1f2937',
    paddingBottom: '1.25rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#f1f5f9',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: 4,
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    borderRadius: 6,
    border: '1px solid #374151',
    background: '#1f2937',
    color: '#9ca3af',
    cursor: 'pointer',
    fontFamily: 'sans-serif',
    fontSize: '0.875rem',
  },
  notification: {
    background: '#14532d',
    border: '1px solid #166534',
    color: '#4ade80',
    borderRadius: 8,
    padding: '0.65rem 1rem',
    marginBottom: '1rem',
    fontFamily: 'sans-serif',
    fontSize: '0.875rem',
  },
  searchInput: {
    padding: '0.65rem 1rem',
    borderRadius: 8,
    border: '1px solid #374151',
    background: '#1f2937',
    color: '#f1f5f9',
    fontFamily: 'sans-serif',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
    maxWidth: 420,
    boxSizing: 'border-box',
    marginBottom: '1.25rem',
  },
  loadingText: {
    color: '#6b7280',
    fontFamily: 'sans-serif',
    padding: '2rem 0',
  },
  tableWrap: {
    overflowX: 'auto',
    borderRadius: 10,
    border: '1px solid #1f2937',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'sans-serif',
    fontSize: '0.875rem',
  },
  th: {
    background: '#111827',
    color: '#9ca3af',
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #1f2937',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '0.65rem 1rem',
    color: '#d1d5db',
    borderBottom: '1px solid #1a2030',
    verticalAlign: 'middle',
  },
  rowEven: { background: 'transparent' },
  rowOdd: { background: 'rgba(255,255,255,0.015)' },
  deleteBtn: {
    padding: '0.35rem 0.75rem',
    borderRadius: 6,
    border: '1px solid #7f1d1d',
    background: '#450a0a',
    color: '#f87171',
    cursor: 'pointer',
    fontFamily: 'sans-serif',
    fontSize: '0.8rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },

  /* Confirm dialog */
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  dialog: {
    background: '#111827',
    border: '1px solid #374151',
    borderRadius: 12,
    padding: '2rem',
    maxWidth: 400,
    width: '90%',
    textAlign: 'center',
  },
  dialogText: {
    fontFamily: 'sans-serif',
    fontSize: '1.1rem',
    color: '#f1f5f9',
    margin: '0 0 0.5rem',
  },
  dialogSub: {
    fontFamily: 'sans-serif',
    fontSize: '0.85rem',
    color: '#6b7280',
    margin: '0 0 1.5rem',
  },
  dialogBtns: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  cancelBtn: {
    padding: '0.6rem 1.5rem',
    borderRadius: 8,
    border: '1px solid #374151',
    background: '#1f2937',
    color: '#9ca3af',
    cursor: 'pointer',
    fontFamily: 'sans-serif',
    fontWeight: 600,
  },
  confirmDeleteBtn: {
    padding: '0.6rem 1.5rem',
    borderRadius: 8,
    border: 'none',
    background: '#dc2626',
    color: '#fff',
    cursor: 'pointer',
    fontFamily: 'sans-serif',
    fontWeight: 700,
  },
};
