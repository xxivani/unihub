import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, useMyClub, PageHeader, CommitteeNav, Field } from "../../../ui/ui";

const BUDGET_KEYS = [["catering", "Catering"], ["materials", "Materials"], ["prize", "Prizes"], ["transportation", "Transport"], ["venue", "Venue"]];

const CreateEvent = () => {
  const navigate = useNavigate();
  const { club } = useMyClub();
  const [f, setF] = useState({ title: "", date: "", start: "", end: "", location: "", capacity: "", price: "0", description: "", organizer: "", co: "", manager: "", speaker: "", budget: false });
  const [cats, setCats] = useState({ catering: false, materials: false, prize: false, transportation: false, venue: false });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const today = new Date().toISOString().slice(0, 10);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!f.title.trim() || !f.date || !f.start || !f.end || !f.location.trim() || !f.capacity || !f.organizer.trim()) {
      return setError("Please fill in the title, date, times, location, capacity and organiser.");
    }
    if (f.end <= f.start) return setError("The end time must be after the start time.");
    setBusy(true);
    try {
      const when = new Date(`${f.date}T${f.start}`);
      const deadline = new Date(when.getTime() - 86400000).toISOString();
      const fd = new FormData();
      fd.append("title", f.title.trim());
      fd.append("club", club?.club_name || "PAWS");
      fd.append("image", JSON.stringify({ image0: "/assets/images/social.jpeg", image1: "/assets/images/picnic.webp" }));
      fd.append("description", f.description);
      fd.append("location", f.location);
      fd.append("time", `${f.start}-${f.end}`);
      fd.append("date", f.date);
      fd.append("deadline", deadline);
      fd.append("capacity", f.capacity);
      fd.append("price", f.price || 0);
      fd.append("followed", 0);
      fd.append("waiting", 0);
      fd.append("budget_required", f.budget);
      fd.append("budget", JSON.stringify(cats));
      fd.append(
        "team",
        JSON.stringify([
          { role: "Organizer", name: f.organizer },
          { role: "Co-organizer", name: f.co },
          { role: "Manager", name: f.manager },
          { role: "Speaker", name: f.speaker },
        ])
      );
      fd.append("follower", JSON.stringify([]));
      await api("/events", { method: "POST", body: fd });
      navigate("/committee/events");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="ux-page">
      <PageHeader crumbs={[["Events", "/committee/events"], ["New event"]]} eyebrow="Committee" title="Create event" lead={`Publish a new event${club?.club_name ? ` for ${club.club_name}` : ""}. Students will see it straight away.`} />
      <CommitteeNav />
      <div className="ux-wrap ux-body">
        <form className="ux-form" onSubmit={submit} noValidate>
          <section className="ux-card ux-fieldset">
            <h3>Basics</h3>
            <p>What is happening and where.</p>
            <div className="ux-fields">
              <Field label="Event name" wide hint={`${f.title.length}/100`}><input className="ux-input" value={f.title} onChange={set("title")} maxLength={100} placeholder="e.g. Spring Adoption Drive" /></Field>
              <Field label="Location" wide><input className="ux-input" value={f.location} onChange={set("location")} placeholder="e.g. Main Courtyard" /></Field>
              <Field label="Description" wide hint={`${f.description.length}/1000`}><textarea className="ux-textarea" value={f.description} onChange={set("description")} maxLength={1000} placeholder="What should students expect?" /></Field>
            </div>
          </section>

          <section className="ux-card ux-fieldset">
            <h3>Schedule & tickets</h3>
            <p>Sign-ups close 24 hours before the start.</p>
            <div className="ux-fields">
              <Field label="Date"><input className="ux-input" type="date" min={today} value={f.date} onChange={set("date")} /></Field>
              <Field label="Capacity"><input className="ux-input" type="number" min="1" value={f.capacity} onChange={set("capacity")} /></Field>
              <Field label="Starts"><input className="ux-input" type="time" value={f.start} onChange={set("start")} /></Field>
              <Field label="Ends"><input className="ux-input" type="time" value={f.end} onChange={set("end")} /></Field>
              <Field label="Ticket price (AED)" hint="Use 0 for a free event"><input className="ux-input" type="number" min="0" step="1" value={f.price} onChange={set("price")} /></Field>
            </div>
          </section>

          <section className="ux-card ux-fieldset">
            <h3>Event team</h3>
            <p>Shown on the public event page.</p>
            <div className="ux-fields">
              <Field label="Organiser"><input className="ux-input" value={f.organizer} onChange={set("organizer")} /></Field>
              <Field label="Co-organiser"><input className="ux-input" value={f.co} onChange={set("co")} /></Field>
              <Field label="Manager"><input className="ux-input" value={f.manager} onChange={set("manager")} /></Field>
              <Field label="Speaker (optional)"><input className="ux-input" value={f.speaker} onChange={set("speaker")} /></Field>
            </div>
          </section>

          <section className="ux-card ux-fieldset">
            <h3>Budget</h3>
            <p>Track spend for this event in the budget tracker.</p>
            <label className="ux-check" style={{ marginBottom: f.budget ? 14 : 0 }}>
              <input type="checkbox" checked={f.budget} onChange={(e) => setF({ ...f, budget: e.target.checked })} /> This event needs a budget
            </label>
            {f.budget && (
              <div className="ux-checks">
                {BUDGET_KEYS.map(([k, label]) => (
                  <label className="ux-check" key={k}>
                    <input type="checkbox" checked={cats[k]} onChange={(e) => setCats({ ...cats, [k]: e.target.checked })} /> {label}
                  </label>
                ))}
              </div>
            )}
          </section>

          {error && <div className="ux-error">{error}</div>}
          <div className="ux-form-actions">
            <Link to="/committee/events" className="ux-btn">Cancel</Link>
            <button className="ux-btn ux-btn-primary" disabled={busy}>{busy ? "Publishing…" : "Publish event"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
