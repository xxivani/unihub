import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import "./ui.css";
import "./classic.css";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ------------------------------------------------------------------ data */
export async function api(path, options = {}) {
  const isForm = typeof FormData !== "undefined" && options.body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: isForm ? options.headers : { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok) throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
  return data;
}

export function useApi(path, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!path) return;
    let off = false;
    setState((s) => ({ ...s, loading: true, error: "" }));
    api(path)
      .then((data) => !off && setState({ data, loading: false, error: "" }))
      .catch((e) => !off && setState({ data: null, loading: false, error: e.message }));
    return () => {
      off = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, tick, ...deps]);
  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}

export const getUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("user"));
  } catch {
    return null;
  }
};

/* --------------------------------------------------------------- formatting */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Accepts ISO strings, "14 November 2026" (en-GB long) and dd/mm/yyyy.
export const toDate = (v) => {
  if (!v) return null;
  if (v instanceof Date) return v;
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(v));
  const d = m ? new Date(+m[3], +m[2] - 1, +m[1]) : new Date(v);
  return isNaN(d) ? null : d;
};
export const eventDate = (e) => toDate(e?.date_iso) || toDate(e?.date);
export const dayOf = (d) => (d ? String(d.getDate()) : "–");
export const monOf = (d) => (d ? MONTHS[d.getMonth()] : "");
export const fmtDate = (v, opts = { day: "numeric", month: "short", year: "numeric" }) => {
  const d = toDate(v);
  return d ? d.toLocaleDateString("en-GB", opts) : "TBC";
};
export const fmtLong = (v) => fmtDate(v, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
export const isUpcoming = (e) => {
  const d = eventDate(e);
  return !d || d >= startOfToday();
};
export const priceLabel = (p) => (!Number(p) ? "Free" : `AED ${Number(p)}`);
export const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("") || "?";
export const pretty = (s = "") =>
  s
    .toLowerCase()
    .split("_")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
export const daysLeft = (v) => {
  const d = toDate(v);
  if (!d) return null;
  return Math.ceil((d - Date.now()) / 86400000);
};

/* ------------------------------------------------------------------ colours */
const TONES = [
  ["#2f5d3a", "#1d3b25"],
  ["#2b5fa8", "#1b3a6b"],
  ["#7a3fa0", "#4b2468"],
  ["#b5532a", "#7c3416"],
  ["#0f7c82", "#0a4f54"],
  ["#a8325e", "#701f3f"],
  ["#6b6f1f", "#454814"],
  ["#475569", "#2b3441"],
];
export const toneFor = (key = "") => {
  let h = 0;
  for (const ch of String(key)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const [c1, c2] = TONES[h % TONES.length];
  return { "--c1": c1, "--c2": c2 };
};

/* -------------------------------------------------------------------- icons */
const Ic = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);
export const IconClock = (p) => <Ic {...p} d={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>} />;
export const IconPin = (p) => <Ic {...p} d={<><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>} />;
export const IconCal = (p) => <Ic {...p} d={<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>} />;
export const IconUsers = (p) => <Ic {...p} d={<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .6 3.3 2.3 3.6 5.2" /></>} />;
export const IconTag = (p) => <Ic {...p} d={<><path d="M3 12V4h8l10 10-8 8L3 12z" /><circle cx="7.5" cy="8.5" r="1" /></>} />;
export const IconMail = (p) => <Ic {...p} d={<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>} />;
export const IconPhone = (p) => <Ic {...p} d={<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />} />;
export const IconArrow = (p) => <Ic {...p} d={<path d="M5 12h14M13 6l6 6-6 6" />} />;
export const IconDoc = (p) => <Ic {...p} d={<><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 13h6M9 17h6" /></>} />;

/* ------------------------------------------------------------- small blocks */
export const Mono = ({ name, src, size, tone }) => (
  <span className={`ux-mono${size === "lg" ? " ux-mono-lg" : ""}`} style={toneFor(tone || name)} aria-hidden="true">
    {src ? <img src={src} alt="" /> : initials(name)}
  </span>
);

export const Badge = ({ children, kind }) => <span className={`ux-badge${kind ? ` ux-badge-${kind}` : ""}`}>{children}</span>;

export const Skeletons = ({ n = 6 }) => (
  <div className="ux-grid">
    {Array.from({ length: n }).map((_, i) => (
      <div className="ux-skel" key={i} />
    ))}
  </div>
);

export const EmptyState = ({ title, children, action }) => (
  <div className="ux-card ux-state">
    <h3>{title}</h3>
    <p>{children}</p>
    {action && <div style={{ marginTop: 16 }}>{action}</div>}
  </div>
);

export const SectionHead = ({ title, sub, to, more = "View all" }) => (
  <div className="ux-section-head">
    <div>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
    {to && (
      <Link to={to} className="ux-more">
        {more} →
      </Link>
    )}
  </div>
);

export const PageHeader = ({ eyebrow, title, lead, crumbs, children }) => (
  <header className="ux-header">
    <div className="ux-wrap">
      <div>
        {crumbs && (
          <p className="ux-crumbs">
            {crumbs.map(([label, to], i) => (
              <span key={label}>
                {i > 0 && " / "}
                {to ? <Link to={to}>{label}</Link> : label}
              </span>
            ))}
          </p>
        )}
        {eyebrow && <p className="ux-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="ux-lead">{lead}</p>}
      </div>
      {children && <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{children}</div>}
    </div>
  </header>
);

export const SearchBox = ({ value, onChange, placeholder = "Search…" }) => (
  <input className="ux-input ux-search" type="search" value={value} placeholder={placeholder} aria-label={placeholder} onChange={(e) => onChange(e.target.value)} />
);

export const Chips = ({ options, value, onChange }) => (
  <div className="ux-chips" role="group">
    {options.map((o) => (
      <button key={o} type="button" className={`ux-chip${value === o ? " is-on" : ""}`} onClick={() => onChange(o)}>
        {o}
      </button>
    ))}
  </div>
);

export const Tabs = ({ options, value, onChange }) => (
  <div className="ux-tabs" role="tablist">
    {options.map(([key, label]) => (
      <button key={key} type="button" role="tab" aria-selected={value === key} className={`ux-tab${value === key ? " is-on" : ""}`} onClick={() => onChange(key)}>
        {label}
      </button>
    ))}
  </div>
);

export const Pager = ({ page, pages, onChange }) =>
  pages > 1 ? (
    <div className="ux-pager">
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        ‹
      </button>
      {Array.from({ length: pages }).map((_, i) => (
        <button key={i} type="button" className={page === i + 1 ? "is-on" : ""} onClick={() => onChange(i + 1)}>
          {i + 1}
        </button>
      ))}
      <button type="button" disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Next page">
        ›
      </button>
    </div>
  ) : null;

export const Field = ({ label, hint, wide, children }) => (
  <label className={`ux-field${wide ? " is-wide" : ""}`}>
    <span>{label}</span>
    {children}
    {hint && <small>{hint}</small>}
  </label>
);

export function Modal({ title, onClose, children, actions, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return createPortal(
    <div className="ux-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ux-modal" role="dialog" aria-modal="true" aria-label={title} style={wide ? { maxWidth: 680 } : undefined}>
        <h2>{title}</h2>
        {children}
        {actions && <div className="ux-modal-actions">{actions}</div>}
      </div>
    </div>,
    document.body
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef();
  const show = useCallback((message, error = false) => {
    setToast({ message, error });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  const node = toast
    ? createPortal(
        <div className={`ux-toast${toast.error ? " is-error" : ""}`} role="status">
          {toast.message}
        </div>,
        document.body
      )
    : null;
  return [show, node];
}

/* ---------------------------------------------------------------- event card */
export function EventCard({ event, followed, onFollow, busy }) {
  const d = eventDate(event);
  const cap = Number(event.capacity) || 0;
  const taken = Number(event.followed) || 0;
  const pct = cap ? Math.min(100, Math.round((taken / cap) * 100)) : 0;
  const full = cap > 0 && taken >= cap;
  return (
    <article className="ux-card ux-event ux-hover">
      <Link to={`/event-details?eventid=${event.id}`} className="ux-cover" style={toneFor(event.club)} aria-label={`Open ${event.title}`}>
        <span className="ux-date">
          <b>{dayOf(d)}</b>
          <span>{monOf(d)}</span>
        </span>
        <span className="ux-cover-tag">{event.club}</span>
      </Link>
      <div className="ux-event-body">
        <h3>
          <Link to={`/event-details?eventid=${event.id}`} style={{ color: "inherit" }}>
            {event.title}
          </Link>
        </h3>
        <p className="ux-meta">
          <IconClock />
          <span>{event.time}</span>
        </p>
        <p className="ux-meta">
          <IconPin />
          <span>{event.location}</span>
        </p>
      </div>
      <div className="ux-event-foot">
        <div className="ux-spots">
          <small>
            {priceLabel(event.price)} · {full ? "Full" : `${Math.max(cap - taken, 0)} spots left`}
          </small>
          <div className={`ux-bar${full ? " is-full" : ""}`}>
            <i style={{ width: `${pct}%` }} />
          </div>
        </div>
        {onFollow && (
          <button type="button" className={`ux-btn ux-btn-sm${followed ? "" : " ux-btn-primary"}`} disabled={busy || (full && !followed)} onClick={() => onFollow(event)}>
            {followed ? "Following" : full ? "Full" : "Follow"}
          </button>
        )}
      </div>
    </article>
  );
}

export function ClubCard({ club, extra }) {
  return (
    <Link to={`/club-details/${club.club_id}`} className="ux-card ux-club ux-hover">
      <div className="ux-club-top">
        <Mono name={club.club_name} src={club.club_thumbnail_url} />
        <Badge>{club.club_category}</Badge>
      </div>
      <h3>{club.club_name}</h3>
      <p className="ux-desc">{club.club_description}</p>
      {extra && <p className="ux-meta">{extra}</p>}
    </Link>
  );
}

/* ------------------------------------------------------------ committee shell */
const COMMITTEE_LINKS = [
  ["/committee/dashboard", "Overview"],
  ["/committee/events", "Events"],
  ["/committee/roles", "Role openings"],
  ["/committee/budget-tracker", "Budget"],
  ["/committee/image-management", "Images"],
];
export function CommitteeNav() {
  const { pathname } = useLocation();
  return (
    <nav className="ux-subnav" aria-label="Committee tools">
      <div className="ux-wrap">
        {COMMITTEE_LINKS.map(([to, label]) => (
          <Link key={to} to={to} className={pathname === to || (to !== "/committee/dashboard" && pathname.startsWith(to)) ? "is-on" : ""}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

// Club the committee user manages (PAWS in the demo). Admins have no fixed club.
export function useMyClub() {
  const user = getUser();
  const member = useApi(user?.id && user.role !== "admin" ? `/committee-members/by-user/${user.id}` : null);
  const clubId = member.data?.club_id || (user?.role === "committee" ? sessionStorage.getItem("selectedClubId") : null);
  const club = useApi(clubId ? `/clubs/${clubId}` : null, [clubId]);
  return { user, member: member.data, clubId, club: club.data };
}

export function useFollowing(user) {
  // follow state is derived from the events' follower arrays
  return (events) => {
    if (!user?.id) return new Set();
    return new Set((events || []).filter((e) => (e.follower || []).some((f) => Number(f.id) === Number(user.id))).map((e) => e.id));
  };
}
