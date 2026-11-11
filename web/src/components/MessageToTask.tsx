import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

type Source = 'email' | 'whatsapp';
type Stage = 'idle' | 'reading' | 'proposed' | 'created';

const MESSAGES: Record<Source, {
  from: string; initials: string; meta: string; body: React.ReactNode;
  task: { title: string; owner: string; ownerInitials: string; due: string };
}> = {
  email: {
    from: 'Priya Nair',
    initials: 'PN',
    meta: 'Tamarind Café · Revised floor plan · 9:12 am',
    body: (
      <>
        Hi team, the revised floor plan is attached. Could you{' '}
        <mark>send an updated quote with the taller counter by Friday</mark>? We would like to
        confirm before the long weekend.
      </>
    ),
    task: { title: 'Send updated quote with the taller counter', owner: 'Kabir', ownerInitials: 'KS', due: 'Fri' },
  },
  whatsapp: {
    from: 'Arjun, site lead',
    initials: 'AR',
    meta: 'WhatsApp Business · 8:47 am',
    body: (
      <>
        Electrician can only come Thursday 9am. Can someone{' '}
        <mark>confirm the ceiling panels will be up by Wednesday</mark>?
      </>
    ),
    task: { title: 'Confirm ceiling panels are up by Wednesday', owner: 'Sana', ownerInitials: 'SM', due: 'Wed' },
  },
};

const BOARD = {
  todo: [{ title: 'Order pendant lights', owner: 'DR', due: 'Thu' }],
  doing: [
    { title: 'Counter joinery drawings', owner: 'KS', due: 'Wed' },
    { title: 'Source oak panels', owner: 'SM', due: 'Thu' },
  ],
  done: [{ title: 'Site survey', owner: 'AR', due: 'Mon' }],
};

function Card({ title, owner, due, isNew, name }: { title: string; owner: string; due: string; isNew?: boolean; name?: string }) {
  return (
    <div className={`card${isNew ? ' new' : ''}`} style={name ? { viewTransitionName: name } : undefined}>
      <div className="card-title">{title}</div>
      <div className="card-meta">
        <span className="avatar">{owner}</span>
        <span>Tamarind Café</span>
        <span className="due">{due}</span>
      </div>
    </div>
  );
}

export default function MessageToTask() {
  const [source, setSource] = useState<Source>('email');
  const [stage, setStage] = useState<Stage>('idle');
  const timer = useRef<number | undefined>(undefined);
  const m = MESSAGES[source];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Where the browser supports it, the proposed task morphs into the board card.
  const morph = (change: () => void) => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (doc.startViewTransition && !calm) doc.startViewTransition(() => flushSync(change));
    else change();
  };

  const pick = (s: Source) => {
    window.clearTimeout(timer.current);
    setSource(s);
    setStage('idle');
  };
  const makeTask = () => {
    setStage('reading');
    timer.current = window.setTimeout(() => setStage('proposed'), 800);
  };

  return (
    <div className="app">
      <div className="m2t">
        <div className="m2t-msg">
          <div className="tabs" role="tablist" aria-label="Message source">
            {(['email', 'whatsapp'] as Source[]).map(s => (
              <button key={s} type="button" role="tab" aria-selected={source === s} onClick={() => pick(s)}>
                <span className="dot" style={{ '--hue': `var(--${s})` } as React.CSSProperties} />
                {s === 'email' ? 'Email' : 'WhatsApp'}
              </button>
            ))}
          </div>

          <div className="msg">
            <div className="msg-from"><span className="avatar">{m.initials}</span>{m.from}</div>
            <div className="msg-meta">{m.meta}</div>
            <p className={`msg-body${source === 'whatsapp' ? ' bubble' : ''}`}>{m.body}</p>
          </div>

          {stage === 'proposed' && (
            <div className="proposal">
              <div className="label">Aroh suggests a task</div>
              <Card title={m.task.title} owner={m.task.ownerInitials} due={m.task.due} name="new-task" />
              <div className="proposal-actions">
                <button type="button" className="btn small" onClick={() => morph(() => setStage('created'))}>Create task</button>
                <button type="button" className="btn small ghost" onClick={() => setStage('idle')}>Dismiss</button>
              </div>
            </div>
          )}

          <div className="msg-foot" aria-live="polite">
            {stage === 'idle' && <button type="button" className="btn small" onClick={makeTask}>Make task</button>}
            {stage === 'reading' && <span className="note">Reading the message…</span>}
            {stage === 'proposed' && <span className="note">Nothing is created until you approve it.</span>}
            {stage === 'created' && (
              <>
                <span className="chip tint" style={{ '--hue': 'var(--tasks)' } as React.CSSProperties}>Task created</span>
                <span className="note">Assigned to {m.task.owner}, due {m.task.due}.</span>
              </>
            )}
          </div>
        </div>

        <div className="m2t-side">
          <div className="bar">
            <span className="dot" style={{ '--hue': 'var(--projects)' } as React.CSSProperties} />
            Tamarind Café fit-out
            {stage === 'created' && (
              <button type="button" className="linkish replay" onClick={() => morph(() => setStage('idle'))}>Replay</button>
            )}
          </div>
          <div className="board">
            <div className="board-col">
              <h4>To do <span>{BOARD.todo.length + (stage === 'created' ? 1 : 0)}</span></h4>
              {stage === 'created' && <Card title={m.task.title} owner={m.task.ownerInitials} due={m.task.due} isNew name="new-task" />}
              {BOARD.todo.map(c => <Card key={c.title} {...c} />)}
            </div>
            <div className="board-col">
              <h4>In progress <span>{BOARD.doing.length}</span></h4>
              {BOARD.doing.map(c => <Card key={c.title} {...c} />)}
            </div>
            <div className="board-col">
              <h4>Done <span>{BOARD.done.length}</span></h4>
              {BOARD.done.map(c => <Card key={c.title} {...c} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
