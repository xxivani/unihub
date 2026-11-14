import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row } from "../ui/classic";
import { api, useApi, getUser, PageHeader, SearchBox, Chips, Tabs, Skeletons, IconClock, IconPin, fmtDate, priceLabel, EmptyState, Pager, useToast, isUpcoming, eventDate, useFollowing } from "../ui/ui";

const PER_PAGE = 9;

const Events = () => {
  const navigate = useNavigate();
  const user = getUser();
  const { data, loading, error, reload } = useApi("/events");
  const [search, setSearch] = useState("");
  const [club, setClub] = useState("All clubs");
  const [when, setWhen] = useState("upcoming");
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(null);
  const [toast, toastNode] = useToast();

  const events = data || [];
  const followed = useFollowing(user)(events);
  const clubNames = ["All clubs", ...Array.from(new Set(events.map((e) => e.club))).sort()];

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events
      .filter((e) => (when === "all" ? true : when === "upcoming" ? isUpcoming(e) : !isUpcoming(e)))
      .filter((e) => club === "All clubs" || e.club === club)
      .filter((e) => !q || `${e.title} ${e.club} ${e.location}`.toLowerCase().includes(q))
      .sort((a, b) => (when === "past" ? eventDate(b) - eventDate(a) : eventDate(a) - eventDate(b)));
  }, [events, search, club, when]);

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const follow = async (e) => {
    if (!user) return navigate("/auth");
    setBusy(e.id);
    try {
      await api(`/events/${followed.has(e.id) ? "unfollow" : "follow"}/${e.id}`, { method: "POST", body: JSON.stringify(user) });
      toast(followed.has(e.id) ? `Unfollowed ${e.title}` : `You're going to ${e.title}`);
      reload();
    } catch (err) {
      toast(err.message, true);
    } finally {
      setBusy(null);
    }
  };

  const reset = (fn) => (v) => {
    fn(v);
    setPage(1);
  };

  return (
    <div className="ux-page cl">
      <PageHeader title="Events" lead="Socials, talks, workshops and competitions run by student societies." />
      <div className="ux-wrap ux-body">
        <div className="cl-filters">
          <SearchBox value={search} onChange={reset(setSearch)} placeholder="Search events, clubs or places" />
          <Tabs options={[["upcoming", "Upcoming"], ["past", "Past"], ["all", "All"]]} value={when} onChange={reset(setWhen)} />
          <span className="ux-count">{list.length} event{list.length === 1 ? "" : "s"}</span>
        </div>
        <div style={{ marginBottom: 22 }}>
          <Chips options={clubNames} value={club} onChange={reset(setClub)} />
        </div>

        {loading && <Skeletons n={4} />}
        {error && <EmptyState title="Couldn't load events">{error}</EmptyState>}
        {!loading && !error && shown.length === 0 && <EmptyState title="No events match">Try a different search or filter.</EmptyState>}
        <div className="cl-list">
          {shown.map((e) => {
            const cap = Number(e.capacity) || 0;
            const taken = Number(e.followed) || 0;
            const full = cap > 0 && taken >= cap && !followed.has(e.id);
            return (
              <Row key={e.id} img={e.image?.thumbnail} name={e.club} hint={e.title} title={e.title} to={`/event-details?eventid=${e.id}`}
                kicker={`${e.club} · ${priceLabel(e.price)}`}
                meta={<><span><IconClock />{fmtDate(eventDate(e))} · {e.time}</span><span><IconPin />{e.location}</span></>}
                desc={e.description}>
                <Link to={`/event-details?eventid=${e.id}`} className="ux-btn ux-btn-primary">Details</Link>
                {isUpcoming(e) && (
                  <button type="button" className="ux-btn" disabled={busy === e.id || full} onClick={() => follow(e)}>
                    {followed.has(e.id) ? "Following" : full ? "Full" : "Follow"}
                  </button>
                )}
                <small>{cap ? `${Math.max(cap - taken, 0)} spots left` : ""}</small>
              </Row>
            );
          })}
        </div>
        <Pager page={page} pages={pages} onChange={(p) => { setPage(p); window.scrollTo(0, 0); }} />
      </div>
      {toastNode}
    </div>
  );
};

export default Events;
