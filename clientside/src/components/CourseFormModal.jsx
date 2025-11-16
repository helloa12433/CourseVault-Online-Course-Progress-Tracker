import React, { useState, useEffect } from 'react';
import API from '../api.js';

export default function CourseFormModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    title:'', platform:'', link:'', category:'General', status:'Not Started', progress:0, notes:''
  });
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [loadingProv, setLoadingProv] = useState(false);

  useEffect(() => {
    if (initial) setForm({...initial});
    else setForm({ title:'', platform:'', link:'', category:'General', status:'Not Started', progress:0, notes:'' });
  }, [initial]);

  if (!open) return null;
  const submit = e => { e.preventDefault(); onSave(form); };

  const fetchMeta = async (url) => {
    if (!url) return;
    try {
      setLoadingMeta(true);
      const res = await API.get('/metadata', { params: { url } });
      const data = res.data;
      setForm(f => ({
        ...f,
        title: data.title || f.title,
        platform: data.platform || f.platform,
        category: data.category || f.category,
        status: data.status || f.status,
        progress: (typeof data.progress === 'number' ? data.progress : f.progress),
        notes: data.notes || f.notes
      }));
      setLoadingMeta(false);
      // After metadata, try provider-stored progress
      await fetchProviderProgress(url, data.platform?.toLowerCase?.() || 'udemy');
    } catch (err) {
      setLoadingMeta(false);
      console.warn('metadata fetch failed', err);
    }
  };

  const fetchProviderProgress = async (url, platform = 'udemy') => {
    try {
      setLoadingProv(true);
      const res = await API.get('/provider/progress', { params: { url, provider: platform } });
      setLoadingProv(false);
      if (res.data && res.data.data) {
        const p = res.data.data;
        setForm(f => ({
          ...f,
          progress: (typeof p.progress === 'number' ? p.progress : f.progress),
          status: p.status || f.status,
          notes: p.notes ? (f.notes ? `${f.notes}\n\n[Sync] ${p.notes}` : p.notes) : f.notes
        }));
      }
    } catch (err) {
      setLoadingProv(false);
      console.warn('provider progress fetch failed', err);
    }
  };

  // Called when Link input loses focus
  const onLinkBlur = (value) => {
    try {
      const u = new URL(value);
      if (u.protocol.startsWith('http')) fetchMeta(value);
    } catch (e) { /* invalid URL - ignore */ }
  };

  return (
    <div className="modal">
      <div className="box">
        <h3>{initial ? 'Edit Course' : 'Add Course'}</h3>
        <form onSubmit={submit}>
          <label>Title</label>
          <input className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
          <label>Platform</label>
          <input className="input" value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})} />
          <label>Link</label>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <input
              className="input"
              value={form.link}
              onChange={e=>setForm({...form,link:e.target.value})}
              onBlur={e => onLinkBlur(e.target.value)}
              placeholder="https://..."
            />
            <button type="button" className="btn ghost" onClick={() => fetchMeta(form.link)}>
              {loadingMeta ? 'Meta...' : (loadingProv ? 'Sync...' : 'Auto-fill')}
            </button>
          </div>

          <label>Category</label>
          <input className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
          <label>Status</label>
          <select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <label>Progress (0-100)</label>
          <input className="input" type="number" min="0" max="100" value={form.progress} onChange={e=>setForm({...form,progress:Number(e.target.value)})} />
          <label>Notes</label>
          <textarea className="input" rows="3" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button className="btn primary" type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
