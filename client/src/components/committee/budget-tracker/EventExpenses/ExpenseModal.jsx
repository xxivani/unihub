import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CATEGORY_META, CATEGORY_KEYS, moneyExact, toInputDate } from "../budgetUtils";

const blank = { name: "", date: "", status: "ONGOING", description: "", categories: {} };

// Create / edit form for a budget-tracker event. `onSubmit` may throw to show an inline error.
const ExpenseModal = ({ open, title, initial, linked = false, requireCategory = false, onClose, onSubmit }) => {
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setBusy(false);
    if (initial) {
      const cats = {};
      (initial.categories || []).forEach((c) => (cats[c.name] = String(c.amount ?? "")));
      setForm({
        name: initial.name || "",
        date: toInputDate(initial.date),
        status: initial.status || "ONGOING",
        description: initial.description || "",
        categories: cats,
      });
    } else {
      setForm(blank);
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const toggle = (key, on) =>
    setForm((f) => {
      const cats = { ...f.categories };
      if (on) cats[key] = cats[key] ?? "";
      else delete cats[key];
      return { ...f, categories: cats };
    });
  const total = Object.values(form.categories).reduce((s, v) => s + (parseFloat(v) || 0), 0);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Event name is required.");
    if (!form.date) return setError("Please choose a date.");
    if (requireCategory && Object.keys(form.categories).length === 0) return setError("Select at least one expense category.");
    setBusy(true);
    setError("");
    try {
      await onSubmit({
        name: form.name.trim(),
        date: form.date,
        status: form.status,
        description: form.description.trim(),
        categories: Object.entries(form.categories).map(([name, amount]) => ({
          name,
          amount: Math.max(0, parseFloat(amount) || 0),
        })),
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setBusy(false);
    }
  };

  return createPortal(
    <div className="bt-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="bt-modal" role="dialog" aria-modal="true" aria-label={title} onSubmit={submit}>
        <h2>{title}</h2>

        {linked && <p className="bt-note">This event is linked to the main events list, so its name and date are managed there.</p>}

        <label className="bt-field">
          <span>Event name</span>
          <input className="bt-input" value={form.name} disabled={linked} onChange={(e) => set("name", e.target.value)} />
        </label>

        <div className="bt-field-row">
          <label className="bt-field">
            <span>Date</span>
            <input className="bt-input" type="date" value={form.date} disabled={linked} onChange={(e) => set("date", e.target.value)} />
          </label>
          <label className="bt-field">
            <span>Status</span>
            <select className="bt-input" value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </label>
        </div>

        <label className="bt-field">
          <span>Description</span>
          <textarea className="bt-input" rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </label>

        <div className="bt-field">
          <span>Expense categories</span>
        </div>
        <div className="bt-cat-list">
          {CATEGORY_KEYS.map((key) => {
            const on = form.categories[key] !== undefined;
            return (
              <div className="bt-cat" key={key}>
                <label>
                  <input type="checkbox" checked={on} onChange={(e) => toggle(key, e.target.checked)} />
                  {CATEGORY_META[key].label}
                </label>
                {on ? (
                  <input
                    className="bt-input"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="AED"
                    value={form.categories[key]}
                    onChange={(e) => setForm((f) => ({ ...f, categories: { ...f.categories, [key]: e.target.value } }))}
                  />
                ) : (
                  <span />
                )}
              </div>
            );
          })}
        </div>

        <div className="bt-modal-total">
          <span>Total</span>
          <span>{moneyExact(total)}</span>
        </div>

        {error && (
          <p className="bt-form-error" role="alert">
            {error}
          </p>
        )}

        <div className="bt-modal-actions">
          <button type="button" className="bt-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="bt-btn bt-btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
};

export default ExpenseModal;
