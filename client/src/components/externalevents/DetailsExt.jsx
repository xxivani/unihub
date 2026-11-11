import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, useApi, getUser, PageHeader, Skeletons, EmptyState, useToast, IconCal, IconClock, IconPin, IconTag, IconUsers, toDate, fmtLong, pretty, initials } from "../../ui/ui";

const DetailsExt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const { data: e, loading, reload } = useApi(`/external-events/${id}`, [id]);
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, toastNode] = useToast();

  if (loading) return <div className="ux-page cl"><div className="ux-wrap ux-body"><Skeletons n={2} /></div></div>;
  if (!e)
    return (
      <div className="ux-page cl">
        <div className="ux-wrap ux-body">
          <EmptyState title="Event not found" action={<Link to="/external-events" className="ux-btn ux-btn-primary">All external events</Link>}>
            It may have been removed.
          </EmptyState>
        </div>
      </div>
    );

  const cap = Number(e.external_event_max_number_of_attendees) || 0;
  const taken = Number(e.external_event_number_of_attendees) || 0;
  const pct = cap ? Math.min(100, Math.round((taken / cap) * 100)) : 0;
  const full = taken >= cap && !joined;
  const time = toDate(e.external_event_time);
  const people = [
    ["Organiser", e.external_event_organizer],
    ["Co-organiser", e.external_event_corganizer],
    ["Manager", e.external_event_manager],
    ["Speaker", e.external_event_speaker],
  ].filter(([, n]) => n);

  const toggle = async () => {
    if (!user) return navigate("/auth");
    setBusy(true);
    try {
      await api(`/external-events/${e.external_event_id}/${joined ? "unfollow" : "signup"}`, { method: "POST", body: JSON.stringify(user) });
      setJoined(!joined);
      toast(joined ? "Registration cancelled" : "You're registered!");
      reload();
    } catch (err) {
      toast(err.message, true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ux-page cl">
      <PageHeader crumbs={[["External events", "/external-events"], [e.external_event_name]]} eyebrow={pretty(e.external_event_category)} title={e.external_event_name} />
      <div className="ux-wrap ux-body">
        <div className="ux-detail">
          <div style={{ display: "grid", gap: 20 }}>
            <section className="ux-card ux-card-pad">
              <h3 className="ux-card-title">About this event</h3>
              <p className="ux-prose">{e.external_event_description}</p>
            </section>
            {people.length > 0 && (
              <section className="ux-card ux-card-pad">
                <h3 className="ux-card-title">Hosted by</h3>
                <div className="ux-team">
                  {people.map(([role, name]) => (
                    <div className="ux-person" key={role}>
                      <span className="ux-avatar">{initials(name)}</span>
                      <span><b>{name}</b><small>{role}</small></span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          <aside className="ux-detail-side">
            <div className="ux-card ux-card-pad">
              <ul className="ux-facts">
                <li><IconCal /><span><small>Date</small>{fmtLong(e.external_event_date)}</span></li>
                <li><IconClock /><span><small>Starts</small>{time ? time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "TBC"}</span></li>
                <li><IconPin /><span><small>Location</small>{e.external_event_location}</span></li>
                <li><IconTag /><span><small>Ticket</small>{e.external_event_ticket_amount}</span></li>
                <li><IconUsers /><span><small>Registered</small>{taken} of {cap}</span></li>
              </ul>
              <div className={`ux-bar${full ? " is-full" : ""}`} style={{ marginBottom: 18 }}><i style={{ width: `${pct}%` }} /></div>
              <button type="button" className={`ux-btn ux-btn-block${joined ? "" : " ux-btn-primary"}`} disabled={busy || full} onClick={toggle}>
                {joined ? "Registered · tap to cancel" : full ? "Event is full" : "Register"}
              </button>
            </div>
            <Link to="/external-events" className="ux-btn ux-btn-ghost">← All external events</Link>
          </aside>
        </div>
      </div>
      {toastNode}
    </div>
  );
};

export default DetailsExt;
