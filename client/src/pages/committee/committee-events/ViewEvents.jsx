import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, useApi, PageHeader, CommitteeNav, SearchBox, Tabs, Badge, Modal, Field, EmptyState, Skeletons, Pager, useToast, isUpcoming, eventDate, fmtDate, priceLabel } from "../../../ui/ui";

const PER_PAGE = 8;
const timeOk = (v) => /^([01]?\d|2[0-3]):[0-5]\d\s*-\s*([01]?\d|2[0-3]):[0-5]\d$/.test(v);

const ViewEvents = () => {
  const { data, loading, error, reload } = useApi("/events");
  const [tab, setTab] = useState("upcoming");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [formError, setFormError] = useState("");
  const [toast, toastNode] = useToast();

  const events = data || [];
  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events
      .filter((e) => (tab === "all" ? true : tab === "upcoming" ? isUpcoming(e) : !isUpcoming(e)))
      .filter((e) => !q || `${e.title} ${e.location}`.toLowerCase().includes(q))
      .sort((a, b) => (tab === "past" ? eventDate(b) - eventDate(a) : eventDate(a) - eventDate(b)));
  }, [events, tab, search]);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const rows = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const save = async (e) => {
    e.preventDefault();
    if (!timeOk(editing.time)) return setFormError("Time must look like 14:00 - 15:30.");
    if (!editing.title.trim() || !editing.location.trim()) return setFormError("Title and location are required.");
    try {
      await api(`/events/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...editing, capacity: Number(editing.capacity) || 0, price: Number(editing.price) || 0 }),
      });
      toast("Event updated");
      setEditing(null);
      reload();
    } catch (err) {
      setFormError(err.message);
    }
  };
  const remove = async () => {
    try {
      await api(`/events/${removing.id}`, { method: "DELETE" });
      toast("Event deleted");
      setRemoving(null);
      reload();
    } catch (err) {
      toast(err.message, true);
    }
  };
  const openEdit = (e) => {
    setFormError("");
    setEditing({ ...e });
  };
  const setField = (k) => (ev) => setEditing({ ...editing, [k]: ev.target.value });

  return (
    <div className="ux-page">
      <PageHeader eyebrow="Committee" title="Manage events" lead="Create, update and review every event your society runs.">
        <Link to="/committee/events/create" className="ux-btn ux-btn-primary">New event</Link>
      </PageHeader>
      <CommitteeNav />
      <div className="ux-wrap ux-body">
        <div className="ux-toolbar">
          <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by title or place" />
          <Tabs options={[["upcoming", "Upcoming"], ["past", "Past"], ["all", "All"]]} value={tab} onChange={(v) => { setTab(v); setPage(1); }} />
          <span className="ux-count">{list.length} events</span>
        </div>

        {loading && <Skeletons n={2} />}
        {error && <EmptyState title="Couldn't load events">{error}</EmptyState>}
        {!loading && !error && list.length === 0 && (
          <EmptyState title="No events here" action={<Link to="/committee/events/create" className="ux-btn ux-btn-primary">Create an event</Link>}>
            Nothing matches this view yet.
          </EmptyState>
        )}
        {rows.length > 0 && (
          <div className="ux-card ux-table-wrap">
            <table className="ux-table">
              <thead>
                <tr><th>Event</th><th>When</th><th>Location</th><th>Price</th><th>Sign-ups</th><th /></tr>
              </thead>
              <tbody>
                {rows.map((e) => {
                  const cap = Number(e.capacity) || 0;
                  const pct = cap ? Math.min(100, Math.round((e.followed / cap) * 100)) : 0;
                  return (
                    <tr key={e.id}>
                      <td className="ux-cell-title">
                        <b style={{ whiteSpace: "normal" }}>{e.title}</b>
                        <small>{e.club}</small>
                      </td>
                      <td className="ux-cell-title"><b>{fmtDate(eventDate(e))}</b><small>{e.time}</small></td>
                      <td>{e.location}</td>
                      <td>{priceLabel(e.price)}</td>
                      <td>
                        <div className="ux-mini-bar">
                          <small>{e.followed} / {cap}</small>
                          <div className={`ux-bar${pct >= 100 ? " is-full" : ""}`}><i style={{ width: `${pct}%` }} /></div>
                        </div>
                      </td>
                      <td>
                        <div className="ux-actions">
                          <Link to={`/event-details?eventid=${e.id}`} className="ux-btn ux-btn-sm">View</Link>
                          <button type="button" className="ux-btn ux-btn-sm" onClick={() => openEdit(e)}>Edit</button>
                          <button type="button" className="ux-btn ux-btn-sm ux-btn-danger" onClick={() => setRemoving(e)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Pager page={page} pages={pages} onChange={setPage} />
      </div>

      {editing && (
        <Modal
          wide
          title={`Edit "${editing.title}"`}
          onClose={() => setEditing(null)}
          actions={
            <>
              <button type="button" className="ux-btn" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" form="edit-event" className="ux-btn ux-btn-primary">Save changes</button>
            </>
          }
        >
          <form id="edit-event" onSubmit={save} noValidate>
            <div className="ux-fields">
              <Field label="Title" wide><input className="ux-input" value={editing.title} onChange={setField("title")} maxLength={100} /></Field>
              <Field label="Time" hint="e.g. 14:00 - 15:30"><input className="ux-input" value={editing.time} onChange={setField("time")} /></Field>
              <Field label="Location"><input className="ux-input" value={editing.location} onChange={setField("location")} /></Field>
              <Field label="Capacity"><input className="ux-input" type="number" min="1" value={editing.capacity} onChange={setField("capacity")} /></Field>
              <Field label="Price (AED)"><input className="ux-input" type="number" min="0" value={editing.price} onChange={setField("price")} /></Field>
              <Field label="Description" wide><textarea className="ux-textarea" value={editing.description} onChange={setField("description")} maxLength={1000} /></Field>
            </div>
            {formError && <div className="ux-error" style={{ marginTop: 14 }}>{formError}</div>}
          </form>
        </Modal>
      )}
      {removing && (
        <Modal
          title="Delete this event?"
          onClose={() => setRemoving(null)}
          actions={
            <>
              <button className="ux-btn" onClick={() => setRemoving(null)}>Cancel</button>
              <button className="ux-btn ux-btn-solid-danger" onClick={remove}>Delete event</button>
            </>
          }
        >
          <p>"{removing.title}" and its {removing.followed} sign-ups will be removed. This can't be undone.</p>
        </Modal>
      )}
      {toastNode}
    </div>
  );
};

export default ViewEvents;
