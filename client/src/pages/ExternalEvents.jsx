import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Row } from "../ui/classic";
import { useApi, getUser, PageHeader, SearchBox, Chips, Skeletons, EmptyState, toDate, fmtDate, pretty, IconClock, IconPin, IconTag } from "../ui/ui";

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
    <div className="ux-page cl">
      <PageHeader title="External events" lead="Hackathons, career fairs, volunteering days and competitions across the region.">
        {user?.role === "admin" && (
          <Link to="/create-external-event" className="ux-btn ux-btn-primary">
            Add event
          </Link>
        )}
      </PageHeader>
      <div className="ux-wrap ux-body">
        <div className="cl-filters">
          <SearchBox value={search} onChange={setSearch} placeholder="Search external events" />
          <span className="ux-count">{list.length} events</span>
        </div>
        <div style={{ marginBottom: 24 }}>
          <Chips options={cats} value={cat} onChange={setCat} />
        </div>
        {loading && <Skeletons n={6} />}
        {error && <EmptyState title="Couldn't load events">{error}</EmptyState>}
        {!loading && !error && list.length === 0 && <EmptyState title="No events found">Try another filter.</EmptyState>}
        <div className="cl-list">
          {list.map((e) => {
            const cap = Number(e.external_event_max_number_of_attendees) || 0;
            const taken = Number(e.external_event_number_of_attendees) || 0;
            return (
              <Row key={e.external_event_id} img={e.external_event_image_url} name={e.external_event_name} title={e.external_event_name}
                to={`/external-events/${e.external_event_id}`}
                kicker={`${pretty(e.external_event_category)} · ${e.external_event_organizer}`}
                meta={<><span><IconClock />{fmtDate(e.external_event_date)} · {timeOf(e.external_event_time)}</span><span><IconPin />{e.external_event_location}</span><span><IconTag />{e.external_event_ticket_amount}</span></>}
                desc={e.external_event_description}>
                <Link to={`/external-events/${e.external_event_id}`} className="ux-btn ux-btn-primary">Details</Link>
                <small>{Math.max(cap - taken, 0)} spots left</small>
              </Row>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExternalEvents;
