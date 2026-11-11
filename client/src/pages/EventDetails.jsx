import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api, useApi, getUser, PageHeader, EventCard, Skeletons, EmptyState, useToast, Badge, IconCal, IconClock, IconPin, IconTag, IconUsers, eventDate, fmtLong, priceLabel, initials, isUpcoming, useFollowing } from "../ui/ui";

const EventDetails = () => {
  const navigate = useNavigate();
  const id = new URLSearchParams(useLocation().search).get("eventid");
  const user = getUser();
  const { data: event, loading, error, reload } = useApi(id ? `/events/${id}` : null, [id]);
  const all = useApi("/events");
  const [busy, setBusy] = useState(false);
  const [toast, toastNode] = useToast();

  if (loading) return <div className="ux-page"><div className="ux-wrap ux-body"><Skeletons n={2} /></div></div>;
  if (error || !event)
    return (
      <div className="ux-page">
        <div className="ux-wrap ux-body">
          <EmptyState title="Event not found" action={<Link to="/events" className="ux-btn ux-btn-primary">Back to events</Link>}>
            That event may have been removed.
          </EmptyState>
        </div>
      </div>
    );

  const events = all.data || [];
  const followed = useFollowing(user)([event]).has(event.id);
  const cap = Number(event.capacity) || 0;
  const taken = Number(event.followed) || 0;
  const full = cap > 0 && taken >= cap && !followed;
  const pct = cap ? Math.min(100, Math.round((taken / cap) * 100)) : 0;
  const related = events.filter((e) => e.club === event.club && e.id !== event.id && isUpcoming(e)).sort((a, b) => eventDate(a) - eventDate(b)).slice(0, 3);
  const team = (event.team || []).filter((m) => m.name);
  const past = !isUpcoming(event);

  const toggle = async () => {
    if (!user) return navigate("/auth");
    setBusy(true);
    try {
      await api(`/events/${followed ? "unfollow" : "follow"}/${event.id}`, { method: "POST", body: JSON.stringify(user) });
      toast(followed ? "You've left this event" : "You're going. See you there!");
      reload();
    } catch (e) {
      toast(e.message, true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ux-page">
      <PageHeader crumbs={[["Events", "/events"], [event.title]]} eyebrow={event.club} title={event.title}>
        {past ? <Badge kind="muted">This event has finished</Badge> : null}
      </PageHeader>
      <div className="ux-wrap ux-body">
        <div className="ux-detail">
          <div style={{ display: "grid", gap: 20 }}>
            <section className="ux-card ux-card-pad">
              <h3 className="ux-card-title">About this event</h3>
              <p className="ux-prose">{event.description || "More details coming soon."}</p>
            </section>
            {team.length > 0 && (
              <section className="ux-card ux-card-pad">
                <h3 className="ux-card-title">Event team</h3>
                <div className="ux-team">
                  {team.map((m) => (
                    <div className="ux-person" key={m.role + m.name}>
                      <span className="ux-avatar">{initials(m.name)}</span>
                      <span>
                        <b>{m.name}</b>
                        <small>{m.role}</small>
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="ux-detail-side">
            <div className="ux-card ux-card-pad">
              <ul className="ux-facts">
                <li><IconCal /><span><small>Date</small>{fmtLong(eventDate(event))}</span></li>
                <li><IconClock /><span><small>Time</small>{event.time}</span></li>
                <li><IconPin /><span><small>Location</small>{event.location}</span></li>
                <li><IconTag /><span><small>Price</small>{priceLabel(event.price)}</span></li>
                <li><IconUsers /><span><small>Attendance</small>{taken} of {cap} spots taken</span></li>
              </ul>
              <div className={`ux-bar${full ? " is-full" : ""}`} style={{ marginBottom: 18 }}>
                <i style={{ width: `${pct}%` }} />
              </div>
              <button type="button" className={`ux-btn ux-btn-block${followed ? "" : " ux-btn-primary"}`} disabled={busy || full || past} onClick={toggle}>
                {past ? "Event finished" : followed ? "Following · tap to cancel" : full ? "Event is full" : "Follow this event"}
              </button>
            </div>
            <Link to="/events" className="ux-btn ux-btn-ghost">← All events</Link>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="ux-section">
            <h2 style={{ fontSize: "1.3rem", marginBottom: 18 }}>More from {event.club}</h2>
            <div className="ux-grid ux-grid-3">
              {related.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}
      </div>
      {toastNode}
    </div>
  );
};

export default EventDetails;
