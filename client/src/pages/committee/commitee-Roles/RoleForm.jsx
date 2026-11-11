import { useState } from "react";
import { Link } from "react-router-dom";
import { Field } from "../../../ui/ui";

// Shared by CreateRole and EditRole.
const RoleForm = ({ initial, submitLabel, onSubmit }) => {
  const [f, setF] = useState({ position: "", due_date: "", description: "", eligibility_criteria: "", ...initial });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const min = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!f.position.trim() || !f.due_date || !f.description.trim() || !f.eligibility_criteria.trim()) return setError("All fields are required.");
    if (f.due_date < min && !initial?.position) return setError("The deadline must be at least 7 days from today.");
    setBusy(true);
    try {
      await onSubmit(f);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form className="ux-form" onSubmit={submit} noValidate>
      <section className="ux-card ux-fieldset">
        <h3>Role details</h3>
        <p>This is what students see on the role openings page.</p>
        <div className="ux-fields">
          <Field label="Position title"><input className="ux-input" value={f.position} onChange={set("position")} placeholder="e.g. Social Media Manager" /></Field>
          <Field label="Application deadline" hint="At least 7 days from today"><input className="ux-input" type="date" value={f.due_date} onChange={set("due_date")} /></Field>
          <Field label="Description" wide><textarea className="ux-textarea" value={f.description} onChange={set("description")} placeholder="What will this person do?" /></Field>
          <Field label="Eligibility" wide><textarea className="ux-textarea" style={{ minHeight: 80 }} value={f.eligibility_criteria} onChange={set("eligibility_criteria")} placeholder="Year of study, skills, availability…" /></Field>
        </div>
      </section>
      {error && <div className="ux-error">{error}</div>}
      <div className="ux-form-actions">
        <Link to="/committee/roles" className="ux-btn">Cancel</Link>
        <button className="ux-btn ux-btn-primary" disabled={busy}>{busy ? "Saving…" : submitLabel}</button>
      </div>
    </form>
  );
};

export default RoleForm;
