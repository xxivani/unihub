import { Link } from "react-router-dom";
import { useApi, EventCard, ClubCard, SectionHead, Skeletons, isUpcoming, eventDate, fmtDate, toDate, daysLeft, Badge, toneFor, dayOf, monOf, IconClock, IconPin, IconArrow, IconDoc } from "../ui/ui";

const STEPS = [
  ["Find your people", "Browse every society on campus, from STEM and tech to music and animal welfare, and join in one click."],
  ["Never miss an event", "Follow events to save a spot, see what is happening this week and get reminders before the day."],
  ["Take on a role", "Committees post openings all year. Apply for a position and build real leadership experience."],
];

const Home = () => {
  const events = useApi("/events");
  const clubs = useApi("/clubs");
  const news = useApi("/news");
  const roles = useApi("/role-openings");

  const upcoming = (events.data || [])
    .filter(isUpcoming)
    .sort((a, b) => eventDate(a) - eventDate(b));
  const openRoles = (roles.data || []).filter((r) => r.status === "ONGOING").sort((a, b) => toDate(a.due_date) - toDate(b.due_date));
  const latestNews = [...(news.data || [])].sort((a, b) => toDate(b.news_created_at) - toDate(a.news_created_at));
  const clubList = clubs.data || [];
  const clubOf = (id) => clubList.find((c) => c.club_id === id)?.club_name || "";

  return (
    <div className="ux-page">
      <section className="ux-hero">
        <div className="ux-wrap ux-hero-grid">
          <div>
            <p className="ux-eyebrow" style={{ color: "#9fdcae" }}>
              University of Birmingham Dubai
            </p>
            <h1>
              Everything student life, <em>in one place.</em>
            </h1>
            <p className="ux-hero-lead">Discover clubs, follow events, apply for committee roles and keep up with campus news. UniHub connects students and societies, so nothing good goes unnoticed.</p>
            <div className="ux-hero-cta">
              <Link to="/events" className="ux-btn ux-btn-primary">
                Explore events <IconArrow />
              </Link>
              <Link to="/clubs" className="ux-btn ux-btn-ghost">
                Browse clubs
              </Link>
            </div>
          </div>
          <aside className="ux-next" aria-label="Happening next">
            <p className="ux-next-label">Happening next</p>
            {events.loading && <p style={{ color: "rgba(255,255,255,.7)" }}>Loading…</p>}
            {upcoming.slice(0, 4).map((e) => {
              const d = eventDate(e);
              return (
                <Link key={e.id} to={`/event-details?eventid=${e.id}`} className="ux-next-item">
                  <span className="ux-date">
                    <b>{dayOf(d)}</b>
                    <span>{monOf(d)}</span>
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <b>{e.title}</b>
                    <small>
                      {e.club} · {e.time}
                    </small>
                  </span>
                </Link>
              );
            })}
          </aside>
        </div>
      </section>

      <div className="ux-wrap">
        <div className="ux-card ux-stats">
          <div className="ux-stat">
            <b>{clubList.length || "–"}</b>
            <span>Active societies</span>
          </div>
          <div className="ux-stat">
            <b>{events.data ? upcoming.length : "–"}</b>
            <span>Upcoming events</span>
          </div>
          <div className="ux-stat">
            <b>{roles.data ? openRoles.length : "–"}</b>
            <span>Open committee roles</span>
          </div>
          <div className="ux-stat">
            <b>{upcoming.reduce((s, e) => s + (Number(e.followed) || 0), 0) || "–"}</b>
            <span>Spots already booked</span>
          </div>
        </div>
      </div>

      <div className="ux-wrap">
        <section className="ux-section">
          <SectionHead title="Upcoming events" sub="Follow an event to reserve your place." to="/events" />
          {events.loading ? (
            <Skeletons n={3} />
          ) : (
            <div className="ux-grid ux-grid-3">
              {upcoming.slice(0, 3).map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </section>

        <section className="ux-section">
          <SectionHead title="Societies to join" sub="Find a community that fits what you enjoy." to="/clubs" />
          <div className="ux-grid ux-grid-3">
            {clubList.slice(0, 3).map((c) => (
              <ClubCard key={c.club_id} club={c} />
            ))}
          </div>
        </section>

        <section className="ux-section">
          <div className="ux-two">
            <div>
              <SectionHead title="Open roles" sub="Committees are recruiting." to="/roles" />
              <div className="ux-list">
                {openRoles.slice(0, 3).map((r) => (
                  <Link key={r.role_opening_id} to={`/roles/apply/${r.role_opening_id}`} className="ux-card ux-row ux-hover">
                    <div>
                      <h3>{r.position}</h3>
                      <p className="ux-meta">
                        <span>{clubOf(r.club_id)}</span>
                      </p>
                      <p className="ux-row-meta">
                        <span>Apply by {fmtDate(r.due_date)}</span>
                        <span>{daysLeft(r.due_date)} days left</span>
                      </p>
                    </div>
                    <Badge kind="ok">Open</Badge>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <SectionHead title="Latest news" to="/news" />
              <div className="ux-card ux-card-pad">
                <ul className="ux-mini-list">
                  {latestNews.slice(0, 4).map((n) => (
                    <li key={n.news_id}>
                      <div>
                        <b>{n.news_title}</b>
                        <small>
                          {n.news_author} · {fmtDate(n.news_created_at)}
                        </small>
                      </div>
                      <a href={n.news_pdf_url} target="_blank" rel="noopener noreferrer" aria-label="Open PDF" style={{ color: "var(--accent)" }}>
                        <IconDoc />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="ux-section">
          <SectionHead title="How UniHub works" />
          <div className="ux-steps">
            {STEPS.map(([title, text], i) => (
              <div className="ux-card ux-step" key={title}>
                <div className="ux-step-n">{i + 1}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ux-section">
          <div className="ux-cta">
            <div>
              <h2>Run a society? Manage it all here.</h2>
              <p>Committee members can publish events, post role openings and track the club budget from one dashboard.</p>
            </div>
            <Link to="/committee/dashboard" className="ux-btn ux-btn-primary">
              Open committee tools <IconArrow />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
