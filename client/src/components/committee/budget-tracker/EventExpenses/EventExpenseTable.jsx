import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ExpenseModal from "./ExpenseModal";
import { api, categoryMeta, moneyExact, sumCategories } from "../budgetUtils";

const PAGE_SIZE = 8;

const EventExpensesTable = ({ events = [], clubId, onChanged, notify }) => {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const pages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [page, pages]);

  const rows = events.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const save = async (values) => {
    await api(`/bt_eventRoute/${editing.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...values, club_id: clubId, general_event_id: editing.general_event_id }),
    });
    setEditing(null);
    notify?.("success", "Expenses updated.");
    onChanged?.();
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api(`/bt_eventRoute/${deleting.id}`, { method: "DELETE" });
      setDeleting(null);
      notify?.("success", "Event removed from the budget tracker.");
      onChanged?.();
    } catch (e) {
      notify?.("error", e.message);
    } finally {
      setBusy(false);
    }
  };

  if (!events.length) {
    return (
      <div className="bt-table-empty">
        <strong>No events found</strong>
        <p>Try a different filter, or add an expense to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bt-table-wrap">
        <table className="bt-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Status</th>
              <th>Categories</th>
              <th className="bt-num">Total</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const total = sumCategories(r.categories);
              return (
                <tr key={r.id}>
                  <td>
                    <div className="bt-cell-title">
                      {r.name}
                      {r.general_event_id && <span className="bt-badge bt-badge-linked">Linked</span>}
                    </div>
                  </td>
                  <td className="bt-nowrap">{r.date}</td>
                  <td>
                    <span className={`bt-badge bt-badge-${String(r.status).toLowerCase()}`}>{r.status === "COMPLETED" ? "Completed" : "Ongoing"}</span>
                  </td>
                  <td>
                    <div className="bt-chips">
                      {(r.categories || []).map((c, i) => {
                        const meta = categoryMeta(c.name, i);
                        return (
                          <span key={c.name} className="bt-chip" title={meta.label}>
                            <i style={{ background: meta.color }} />
                            {meta.label} {Number(c.amount).toLocaleString("en-GB")}
                          </span>
                        );
                      })}
                      {!r.categories?.length && <span className="bt-muted">No expenses yet</span>}
                    </div>
                  </td>
                  <td className="bt-num bt-strong">{moneyExact(total)}</td>
                  <td className="bt-actions">
                    <button type="button" className="bt-btn bt-btn-sm" onClick={() => setEditing(r)}>
                      {total === 0 ? "Add" : "Edit"}
                    </button>
                    {!r.general_event_id && (
                      <button type="button" className="bt-btn bt-btn-sm bt-btn-danger" onClick={() => setDeleting(r)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav className="bt-pager" aria-label="Pagination">
          <button type="button" className="bt-btn bt-btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button type="button" className="bt-btn bt-btn-sm" disabled={page === pages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </nav>
      )}

      <ExpenseModal
        open={!!editing}
        initial={editing}
        linked={!!editing?.general_event_id}
        title={editing && sumCategories(editing.categories) > 0 ? "Edit event expenses" : "Add expenses to event"}
        onClose={() => setEditing(null)}
        onSubmit={save}
      />

      {deleting &&
        createPortal(
          <div className="bt-overlay" onMouseDown={(e) => e.target === e.currentTarget && setDeleting(null)}>
            <div className="bt-modal bt-confirm" role="alertdialog" aria-modal="true">
              <h2>Remove from budget tracker?</h2>
              <p className="bt-muted">
                &ldquo;{deleting.name}&rdquo; and its recorded expenses will be removed from the budget tracker.
              </p>
              <div className="bt-modal-actions">
                <button type="button" className="bt-btn" onClick={() => setDeleting(null)}>
                  Cancel
                </button>
                <button type="button" className="bt-btn bt-btn-danger bt-solid" onClick={remove} disabled={busy}>
                  {busy ? "Removing…" : "Remove"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default EventExpensesTable;
