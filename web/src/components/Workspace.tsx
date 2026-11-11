import { useState } from 'react';

// Demo data for a fictional company, Northfield Interiors.
type App = 'email' | 'whatsapp' | 'projects' | 'tasks' | 'calendar' | 'people';

const APPS: { id: App; name: string }[] = [
  { id: 'email', name: 'Email' },
  { id: 'whatsapp', name: 'WhatsApp' },
  { id: 'projects', name: 'Projects' },
  { id: 'tasks', name: 'Tasks' },
  { id: 'calendar', name: 'Calendar' },
  { id: 'people', name: 'People' },
];

const ITEMS: { app: App; who: string; what: string; tag: string }[] = [
  { app: 'email', who: 'Priya Nair', what: 'Revised floor plan attached. Can we lock the counter height by Friday?', tag: 'Needs reply' },
  { app: 'whatsapp', who: 'Arjun, site lead', what: 'Electrician can only come Thursday morning. OK to move the ceiling work?', tag: 'Needs reply' },
  { app: 'tasks', who: 'Due today', what: 'Send Tamarind Café quote, version 3', tag: 'Tamarind Café' },
  { app: 'email', who: 'Hollis Timber Supply', what: 'Invoice 4471 for oak panels', tag: 'Filed to Accounts' },
  { app: 'calendar', who: '11:00', what: 'Site visit at Tamarind Café', tag: '1 hr' },
  { app: 'whatsapp', who: 'Meera, Lotus Dental', what: 'Loved the mood board. When can you start?', tag: 'Waiting on you' },
  { app: 'projects', who: 'Tamarind Café fit-out', what: '7 of 12 tasks done, on track for the 28th', tag: 'On track' },
  { app: 'tasks', who: 'Due tomorrow', what: 'Order pendant lights for Lotus Dental', tag: 'Lotus Dental' },
  { app: 'people', who: 'Dev Rao', what: 'Away Thursday and Friday', tag: 'Absence' },
  { app: 'projects', who: 'Lotus Dental reception', what: 'Waiting on client sign-off for the mood board', tag: 'Blocked' },
];

const DAY: { time: string; app: App; text: string }[] = [
  { time: '09:30', app: 'tasks', text: 'Send Tamarind Café quote, version 3' },
  { time: '11:00', app: 'calendar', text: 'Site visit at Tamarind Café' },
  { time: '14:00', app: 'email', text: 'Reply to Priya about counter height' },
  { time: '15:30', app: 'tasks', text: 'Order pendant lights for Lotus Dental' },
];

const hue = (app: App) => ({ '--hue': `var(--${app})` }) as React.CSSProperties;

export default function Workspace() {
  const [view, setView] = useState<App | 'today'>('today');
  const rows = view === 'today' ? ITEMS.slice(0, 8) : ITEMS.filter(i => i.app === view);
  const title = view === 'today' ? 'Today' : APPS.find(a => a.id === view)!.name;

  return (
    <div className="app" aria-label="The Aroh workspace, shown with demo data">
      <div className="app-bar">
        <span className="org">Northfield Interiors</span>
        <span className="ask">Ask Aroh about your work</span>
      </div>
      <div className="ws">
        <nav className="ws-side" aria-label="Apps">
          <button type="button" aria-pressed={view === 'today'} onClick={() => setView('today')}>
            <span className="dot" style={{ '--hue': 'var(--paper)' } as React.CSSProperties} />
            Today
          </button>
          {APPS.map(a => (
            <button key={a.id} type="button" aria-pressed={view === a.id} onClick={() => setView(a.id)}>
              <span className="dot" style={hue(a.id)} />
              {a.name}
              <span className="count">{ITEMS.filter(i => i.app === a.id).length}</span>
            </button>
          ))}
        </nav>

        <div className="ws-main">
          <div className="ws-head">
            <h3>{title}</h3>
            <span>{rows.length} items, sorted by Aroh</span>
          </div>
          <ul className="ws-list" key={view}>
            {rows.map((r, n) => (
              <li key={r.what} style={{ animationDelay: `${n * 30}ms` }}>
                <span className="dot" style={hue(r.app)} />
                <span className="who">{r.who}</span>
                <span className="what">{r.what}</span>
                <span className="chip">{r.tag}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="ws-day" aria-label="Your day">
          <h3>Your day, planned</h3>
          <ol>
            {DAY.map(d => (
              <li key={d.time}>
                {d.time}
                <span className="block" style={hue(d.app)}>{d.text}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
