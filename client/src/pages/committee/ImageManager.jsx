import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { api, useApi, getUser, useMyClub, useToast, Skeletons, EmptyState, fmtDate, eventDate, toDate } from "../../ui/ui";
import { Thumb } from "../../ui/classic";
import "./imagemanager.css";

const SLOTS = 8;
const readFile = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

const ImageManager = () => {
  const user = getUser();
  const isAdmin = user?.role === "admin";
  const { club } = useMyClub();
  const events = useApi("/events");
  const external = useApi(isAdmin ? "/external-events" : null);
  const imgs = useApi("/image-management");
  const query = new URLSearchParams(useLocation().search);
  const [name, setName] = useState(query.get("event_name") || "");
  const [busy, setBusy] = useState(false);
  const [toast, toastNode] = useToast();

  const list = useMemo(() => {
    if (isAdmin) return (external.data || []).map((e) => ({ key: e.external_event_name, title: e.external_event_name, date: toDate(e.external_event_date), type: "External" }));
    return (events.data || [])
      .filter((e) => !club?.club_name || e.club === club.club_name)
      .sort((a, b) => eventDate(b) - eventDate(a))
      .map((e) => ({ key: e.title, title: e.title, date: eventDate(e), type: "Internal" }));
  }, [isAdmin, events.data, external.data, club]);

  useEffect(() => {
    if (!name && list.length) setName(list[0].key);
  }, [list, name]);

  const all = imgs.data || [];
  const forEvent = (n) => all.filter((i) => i.eventName === n).sort((a, b) => a.position - b.position);
  const current = list.find((e) => e.key === name);
  const slots = forEvent(name);
  const bySlot = (p) => slots.find((i) => Number(i.position) === p);

  const act = async (fn, okMsg) => {
    setBusy(true);
    try {
      await fn();
      await imgs.reload();
      if (okMsg) toast(okMsg);
    } catch (e) {
      toast(e.message || "Something went wrong", true);
    } finally {
      setBusy(false);
    }
  };

  const add = (file) =>
    act(async () => {
      if (!file) return;
      const free = Array.from({ length: SLOTS }, (_, i) => i + 1).find((p) => !bySlot(p));
      if (!free) throw new Error("All 8 slots are used. Delete one first.");
      const URL = await readFile(file);
      const row = await api("/image-management", { method: "POST", body: JSON.stringify({ eventName: name, eventType: current?.type, position: free }) });
      await api(`/image-management/${row.id}`, { method: "PUT", body: JSON.stringify({ URL }) });
    }, "Image added");

  const remove = (img) => act(() => api(`/image-management/${img.id}`, { method: "DELETE" }), "Image deleted");

  const makeCover = (img) =>
    act(async () => {
      const cover = bySlot(1);
      if (cover && cover.id !== img.id) await api(`/image-management/${cover.id}`, { method: "PUT", body: JSON.stringify({ position: img.position }) });
      await api(`/image-management/${img.id}`, { method: "PUT", body: JSON.stringify({ position: 1 }) });
    }, "Cover updated");

  const loading = !imgs.data || (isAdmin ? !external.data : !events.data);

  return (
    <div className="im">
      <div className="im-wrap">
        <h1>Image management</h1>
        <p className="im-lead">Pick an event, then add up to {SLOTS} photos. The first photo is the cover.</p>
        {loading ? <Skeletons n={2} /> : list.length === 0 ? <EmptyState title="No events yet">Create an event first, then add photos to it here.</EmptyState> : (
          <div className="im-grid">
            <nav className="im-list" aria-label="Events">
              {list.map((e) => {
                const n = forEvent(e.key);
                return (
                  <button key={e.key} type="button" className={`im-item${e.key === name ? " is-on" : ""}`} onClick={() => setName(e.key)}>
                    <Thumb src={n[0]?.URL} name={e.title} className="cl-img im-th" />
                    <span><b>{e.title}</b><small>{e.date ? fmtDate(e.date, { day: "numeric", month: "short" }) : ""} · {n.length} image{n.length === 1 ? "" : "s"}</small></span>
                  </button>
                );
              })}
            </nav>
            <section className="im-panel">
              <div className="im-head">
                <div><h2>{current?.title}</h2><small>{slots.length} of {SLOTS} images used</small></div>
              </div>
              <div className="im-slots">
                {Array.from({ length: SLOTS }, (_, i) => i + 1).map((p) => {
                  const img = bySlot(p);
                  return img ? (
                    <figure key={p} className="im-slot">
                      <img src={img.URL} alt="" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
                      {p === 1 && <span className="im-tag">Cover</span>}
                      <figcaption>
                        {p !== 1 && <button type="button" disabled={busy} onClick={() => makeCover(img)}>Make cover</button>}
                        <button type="button" disabled={busy} className="is-danger" onClick={() => remove(img)}>Delete</button>
                      </figcaption>
                    </figure>
                  ) : (
                    <label key={p} className={`im-add${busy ? " is-busy" : ""}`}>
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" disabled={busy} onChange={(e) => { add(e.target.files[0]); e.target.value = ""; }} />
                      <span>+ Add image</span>
                    </label>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </div>
      {toastNode}
    </div>
  );
};

export default ImageManager;
