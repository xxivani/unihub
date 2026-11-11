import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApi, getUser, PageHeader, SearchBox, Chips, Skeletons, EmptyState, Badge, toneFor, toDate, dayOf, monOf, pretty, IconClock, IconPin, IconTag } from "../ui/ui";

const timeOf = (v) => {
  const d = toDate(v);
  return d ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";
};

const ExternalEvents = () => {
  const user = getUser();
  const { data, loading, error } = useApi("/external-events");
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const events = data || [];
  const cats = ["All", ...Array.from(new Set(events.map((e) => pretty(e.external_event_category)))).sort()];
  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events
      .filter((e) => cat === "All" || pretty(e.external_event_category) === cat)
      .filter((e) => !q || `${e.external_event_name} ${e.external_event_location} ${e.external_event_organizer}`.toLowerCase().includes(q))
      .sort((a, b) => toDate(a.external_event_date) - toDate(b.external_event_date));
  }, [events, search, cat]);

  return (
    <div className="ux-page">
      <PageHeader eyebrow="Beyond campus" title="External events" lead="Hackathons, career fairs, volunteering days and competitions hosted by partner organisations across the region.">
        {user?.role === "admin" && (
          <Link to="/create-external-event" className="ux-btn ux-btn-primary">
            Add event
          </Link>
        )}
      </PageHeader>
      <div className="ux-wrap ux-body">
        <div className="ux-toolbar">
          <SearchBox value={search} onChange={setSearch} placeholder="Search external events" />
          <span className="ux-count">{list.length} events</span>
        </div>
        <div style={{ marginBottom: 24 }}>
          <Chips options={cats} value={cat} onChange={setCat} />
        </div>
        {loading && <Skeletons n={6} />}
        {error && <EmptyState title="Couldn't load events">{error}</EmptyState>}
        {!loading && !error && list.length === 0 && <EmptyState title="No events found">Try another filter.</EmptyState>}
        <div className="ux-grid">
          {list.map((e) => {
            const d = toDate(e.external_event_date);
            const cap = Number(e.external_event_max_number_of_attendees) || 0;
            const taken = Number(e.external_event_number_of_attendees) || 0;
            const pct = cap ? Math.min(100, Math.round((taken / cap) * 100)) : 0;
            return (
              <Link key={e.external_event_id} to={`/external-events/${e.external_event_id}`} className="ux-card ux-event ux-hover">
                <div className="ux-cover" style={toneFor(e.external_event_category)}>
                  <span className="ux-date">
                    <b>{dayOf(d)}</b>
                    <span>{monOf(d)}</span>
                  </span>
                  <span className="ux-cover-tag">{pretty(e.external_event_category)}</span>
                </div>
                <div className="ux-event-body">
                  <h3>{e.external_event_name}</h3>
                  <p className="ux-meta"><IconClock /><span>{timeOf(e.external_event_time)}</span></p>
                  <p className="ux-meta"><IconPin /><span>{e.external_event_location}</span></p>
                  <p className="ux-meta"><IconTag /><span>{e.external_event_organizer}</span></p>
                </div>
                <div className="ux-event-foot">
                  <div className="ux-spots">
                    <small>{e.external_event_ticket_amount} · {Math.max(cap - taken, 0)} spots left</small>
                    <div className="ux-bar"><i style={{ width: `${pct}%` }} /></div>
                  </div>
                  <Badge>Details</Badge>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExternalEvents;
