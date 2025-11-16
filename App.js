
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API || 'http://localhost:4000';

function LeftPanel({ sessions, onNewChat, onSelect, collapsed, setCollapsed }) {
  return (
    <div className={`h-full p-4 border-r ${collapsed ? 'w-16' : 'w-64'}`}>
      <button onClick={() => setCollapsed(!collapsed)} className="mb-4">Toggle</button>
      {!collapsed && <button onClick={onNewChat} className="block mb-4">+ New Chat</button>}
      <div>
        {sessions.map(s => (
          <div key={s.id} className="py-2 cursor-pointer" onClick={() => onSelect(s.id)}>
            {collapsed ? s.id.slice(0,4) : s.title}
          </div>
        ))}
      </div>
    </div>
  );
}

function AnswerTable({ answer }) {
  if (!answer) return null;
  const { table } = answer;
  return (
    <div className="mt-4">
      <h3 className="font-bold">{answer.title}</h3>
      <p>{answer.description}</p>
      <div className="overflow-auto mt-2">
        <table className="min-w-full table-auto border">
          <thead>
            <tr>
              {table.columns.map((c,i)=> <th key={i} className="px-2 border">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r,ri)=> (
              <tr key={ri}>
                {r.map((cell,ci)=> <td key={ci} className="px-2 border">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChatArea({ sessionId }) {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState([]);
  const [likeState, setLikeState] = useState({});

  useEffect(()=> {
    if (!sessionId) return;
    fetch(`${API_BASE}/api/session/${sessionId}/history`).then(r=>r.json()).then(d=>{
      setHistory(d.history || []);
    });
  }, [sessionId]);

  const send = async () => {
    if (!question) return;
    const res = await fetch(`${API_BASE}/api/session/${sessionId}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    setHistory(prev => [...prev, data.entry]);
    setQuestion('');
  };

  return (
    <div className="p-4 flex-1">
      <div>
        <div className="flex">
          <input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ask something..." className="flex-1 p-2 border" />
          <button onClick={send} className="ml-2 p-2 border">Send</button>
        </div>
      </div>

      <div className="mt-6">
        {history.map(h => (
          <div key={h.id} className="mb-6 p-3 border rounded">
            <div className="font-semibold">Q: {h.question}</div>
            <div className="mt-2">
              <AnswerTable answer={h.answer} />
            </div>
            <div className="mt-2">
              <button onClick={()=>setLikeState({...likeState, [h.id]: 'like'})}>👍</button>
              <button onClick={()=>setLikeState({...likeState, [h.id]: 'dislike'})} className="ml-2">👎</button>
              {likeState[h.id] && <span className="ml-3">You: {likeState[h.id]}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

function MainApp() {
  const [sessions, setSessions] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(()=> {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    const r = await fetch(`${API_BASE}/api/sessions`);
    const d = await r.json();
    setSessions(d.sessions || []);
  }

  async function newChat() {
    const r = await fetch(`${API_BASE}/api/new-chat`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({}) });
    const d = await r.json();
    await fetchSessions();
    navigate(`/session/${d.sessionId}`);
  }

  function selectSession(id) {
    navigate(`/session/${id}`);
  }

  return (
    <div className="h-screen flex">
      <LeftPanel sessions={sessions} onNewChat={newChat} onSelect={selectSession} collapsed={collapsed} setCollapsed={setCollapsed} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/session/:id" element={<SessionLoader />} />
      </Routes>
    </div>
  );
}

function Welcome() {
  return <div className="p-8">Welcome — click New Chat to start.</div>;
}

function SessionLoader() {
  const { id } = useParams();
  return <ChatArea sessionId={id} />;
}
