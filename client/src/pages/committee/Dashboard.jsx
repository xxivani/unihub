import { Link } from "react-router-dom";
import { useApi, useMyClub, Skeletons, isUpcoming, eventDate, fmtDate, priceLabel, initials, IconClock, IconPin } from "../../ui/ui";
import { Thumb } from "../../ui/classic";
import "./dashboard.css";

const money = (n) => `AED ${Number(n || 0).toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
const label = (s = "") => s.toLowerCase().split("_").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");

const Svg = ({ children }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const NAV = [
  ["/committee/dashboard", "Dashboard", <Svg key="a"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></Svg>],
  ["/committee/events", "Events", <Svg key="b"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Svg>],
  ["/committee/roles", "Role openings", <Svg key="c"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M18 8v6M15 11h6" /></Svg>],
  ["/committee/budget-tracker", "Budget", <Svg key="d"><path d="M3 20h18M6 16V9M11 16V5M16 16v-5M21 16V8" /></Svg>],
  ["/committee/image-management", "Images", <Svg key="e"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M21 16l-5-5-8 9" /></Svg>],
];

const Dashboard = () => {
  const { clubId, club } = useMyClub();
  const events = useApi("/events");
  const members = useApi(clubId ? `/committee-members/by-club/${clubId}` : null, [clubId]);
  const stats = useApi(clubId ? `/club-stats?club_id=${clubId}` : null, [clubId]);

  const all = events.data || [];
  const upcoming = all.filter(isUpcoming).sort((a, b) => eventDate(a) - eventDate(b));
  const past = all.filter((e) => !isUpcoming(e));
  const next = upcoming[0];
  const attended = past.map((e) => Number(e.followed) || 0);
  const avg = attended.length ? Math.round(attended.reduce((s, n) => s + n, 0) / attended.length) : 0;
  const sum = stats.data?.budgetSummary;
  const left = sum ? Number(sum.totalBudget) - Number(sum.totalSpent) : null;
  const pct = next && Number(next.capacity) ? Math.min(100, Math.round(((Number(next.followed) || 0) / Number(next.capacity)) * 100)) : 0;
  const team = members.data || [];

  return (
    <div className="db">
      <aside className="db-rail" aria-label="Committee navigation">
        {NAV.map(([to, name, icon]) => (
          <Link key={to} to={to} title={name} aria-label={name} className={to === "/committee/dashboard" ? "is-on" : ""}>{icon}</Link>
        ))}
      </aside>
      <main className="db-main">
        <div className="db-top">
          <div>
            <p>Committee dashboard</p>
            <h1>{club?.club_name || "Your club"}</h1>
          </div>
          <Link to="/committee/events/create" className="db-btn">Create event</Link>
        </div>

        {events.loading ? <Skeletons n={2} /> : (
          <>
            <div className="db-kpis">
              <div className="db-card"><span>Members</span><b>{team.length || "–"}</b><small>on the committee</small></div>
              <div className="db-card"><span>Events held</span><b>{past.length}</b><small>{upcoming.length} coming up</small></div>
              <div className="db-card"><span>Avg. attendance</span><b>{avg}</b><small>per past event</small></div>
              <div className="db-card"><span>Budget left</span><b>{left == null ? "–" : money(left)}</b><small>{sum ? `of ${money(sum.totalBudget)}` : ""}</small></div>
            </div>

            <div className="db-grid">
              <section className="db-card">
                <h2>Next event</h2>
                {next ? (
                  <div className="db-next">
                    <Thumb src={next.image?.thumbnail} name={next.club} />
                    <div>
                      <h3>{next.title}</h3>
                      <p><IconClock /> {fmtDate(eventDate(next))} · {next.time}</p>
                      <p><IconPin /> {next.location}</p>
                      <p className="db-muted">{priceLabel(next.price)} · {Number(next.followed) || 0} of {Number(next.capacity) || 0} spots taken</p>
                      <div className="db-bar"><i style={{ width: `${pct}%` }} /></div>
                    </div>
                  </div>
                ) : <p className="db-muted">No upcoming events. Create one to get started.</p>}
              </section>
              <section className="db-card">
                <h2>Quick links</h2>
                <Link className="db-link" to="/committee/events"><span>Manage events</span><i>→</i></Link>
                <Link className="db-link" to="/committee/roles"><span>Role openings</span><i>→</i></Link>
                <Link className="db-link" to="/committee/budget-tracker"><span>Budget tracker</span><i>→</i></Link>
                <Link className="db-link" to="/committee/image-management"><span>Image management</span><i>→</i></Link>
              </section>
            </div>

            <section className="db-card">
              <h2>Committee members</h2>
              <div className="db-members">
                {team.map((m) => (
                  <div key={m.committee_member_id}>
                    <span className="db-av">{initials(m.committee_member_name)}</span>
                    <b>{m.committee_member_name}</b>
                    <small>{label(m.committee_member_position)}</small>
                  </div>
                ))}
                {!team.length && <p className="db-muted">No members listed yet.</p>}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
