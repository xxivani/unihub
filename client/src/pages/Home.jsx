import { Link } from "react-router-dom";
import { Thumb } from "../ui/classic";
import { useApi, isUpcoming, eventDate, fmtDate, toDate, priceLabel, IconClock, IconPin } from "../ui/ui";

const Home = () => {
  const events = useApi("/events");
  const news = useApi("/news");

  const now = Date.now();
  const upcoming = (events.data || []).filter(isUpcoming).sort((a, b) => eventDate(a) - eventDate(b));
  const week = upcoming.filter((e) => eventDate(e) - now < 14 * 86400000);
  const featured = (week.length >= 3 ? week : upcoming).slice(0, 3);
  const latest = [...(news.data || [])].sort((a, b) => toDate(b.news_created_at) - toDate(a.news_created_at)).slice(0, 3);

  return (
    <div className="ux-page cl" style={{ paddingTop: 56 }}>
      <section className="cl-hero" style={{ backgroundImage: "url(/assets/images/hero.jpeg)" }}>
        <div>
          <h1><span>ENGAGE.</span><span>EXPLORE.</span><span>UNWIND.</span></h1>
          <p>Clubs, events and committee roles at the University of Birmingham Dubai, in one place.</p>
          <div className="cl-hero-cta">
            <Link to="/events" className="ux-btn ux-btn-gold">Browse events</Link>
            <Link to="/clubs" className="ux-btn ux-btn-ghost">Find a club</Link>
          </div>
        </div>
      </section>

      <section className="cl-section">
        <h2 className="cl-title">Events upcoming</h2>
        <div className="cl-cards">
          {featured.map((e) => (
            <article className="cl-card" key={e.id}>
              <Link to={`/event-details?eventid=${e.id}`} aria-label={e.title}><Thumb src={e.image?.thumbnail} name={e.club} hint={e.title} /></Link>
              <div className="cl-card-body">
                <p className="cl-kicker">{e.club} · {priceLabel(e.price)}</p>
                <h3><Link to={`/event-details?eventid=${e.id}`}>{e.title}</Link></h3>
                <p className="cl-meta"><span><IconClock />{fmtDate(eventDate(e))} · {e.time}</span></p>
                <p className="cl-meta"><span><IconPin />{e.location}</span></p>
                <p className="cl-desc">{e.description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="cl-center"><Link to="/events" className="ux-btn ux-btn-gold" style={{ padding: "14px 56px" }}>VIEW ALL EVENTS</Link></div>
      </section>

      <section className="cl-section" style={{ paddingTop: 80 }}>
        <div className="cl-about">
          <div>
            <h2 className="cl-title" style={{ marginBottom: 16 }}>About us</h2>
            <h3>Our aim</h3>
            <p>University life gets overwhelming when clubs, events and roles are scattered across a dozen sites. UniHub puts them in one place, so you can see what is on, join in and take on a role without jumping between tabs.</p>
            <p>Club leaders get a dashboard to run events, post roles, track budgets and manage event photos.</p>
          </div>
          <div className="cl-pic" style={{ backgroundImage: "url(/assets/images/student-casual.jpeg)" }} role="img" aria-label="Students on campus" />
        </div>
      </section>

      <section className="cl-section" style={{ paddingTop: 80 }}>
        <div className="cl-news">
          <h2 className="cl-title">Latest news</h2>
          <div className="cl-news-grid">
            {latest.map((n) => (
              <div className="cl-news-card" key={n.news_id}>
                <small>{n.news_author} · {fmtDate(n.news_created_at)}</small>
                <h4>{n.news_title}</h4>
                <p>{n.news_content}</p>
              </div>
            ))}
          </div>
          <div className="cl-center"><Link to="/news" className="ux-btn ux-btn-gold" style={{ padding: "14px 56px" }}>VIEW ALL NEWS</Link></div>
        </div>
      </section>
      <div className="cl-end" />
    </div>
  );
};

export default Home;
