import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import EventExpensesTable from "./EventExpenseTable";
import EventAddExpenseButton from "./EventExpensesForm";
import FilterBar from "./FilterBar";
import { api, moneyExact, resolveClubId, sumCategories } from "../budgetUtils";
import "../bt-shared.css";
import "./EventExpenses.css";

const EventExpenses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const clubId = resolveClubId(location.search);

  const [events, setEvents] = useState([]);
  const [clubName, setClubName] = useState("");
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const notify = useCallback((type, message) => {
    setToast({ type, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    if (!clubId) navigate("/committee/budget-tracker", { replace: true });
  }, [clubId, navigate]);

  const load = useCallback(async () => {
    if (!clubId) return;
    try {
      const list = await api(`/bt_eventRoute?club_id=${clubId}`);
      setEvents(list.filter((e) => String(e.club_id) === String(clubId)));
      setError("");
      setStatus("ready");
    } catch (e) {
      setError(e.message || "Failed to load events.");
      setStatus("error");
    }
  }, [clubId]);

  useEffect(() => {
    load();
    if (clubId) {
      api(`/clubs/${clubId}`)
        .then((c) => setClubName(c?.club_name || ""))
        .catch(() => setClubName(""));
    }
  }, [clubId, load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => (filter === "all" || e.status === filter) && (!q || (e.name || "").toLowerCase().includes(q)));
  }, [events, filter, query]);

  const totals = useMemo(
    () => ({
      count: events.length,
      ongoing: events.filter((e) => e.status === "ONGOING").length,
      spent: events.reduce((s, e) => s + sumCategories(e.categories), 0),
    }),
    [events]
  );

  const backUrl = clubId ? `/committee/budget-tracker?club_id=${clubId}` : "/committee/budget-tracker";

  return (
    <div className="bt-page">
      <div className="bt-layout bt-layout-narrow">
        <main className="bt-main">
          <nav className="bt-crumbs" aria-label="Breadcrumb">
            <Link to={backUrl} onClick={() => window.scrollTo(0, 0)}>
              Budget Tracker
            </Link>
            <span>/</span>
            <span>Event expenses</span>
          </nav>

          <header className="bt-header">
            <div>
              <h1 className="bt-title">Event expenses</h1>
              <p className="bt-subtitle">{clubName || "Your club"}</p>
            </div>
            <EventAddExpenseButton clubId={clubId} onAddEvent={load} notify={notify} />
          </header>

          <section className="bt-mini-stats" aria-label="Summary">
            <div className="bt-card">
              <span>Events tracked</span>
              <strong>{totals.count}</strong>
            </div>
            <div className="bt-card">
              <span>Ongoing</span>
              <strong>{totals.ongoing}</strong>
            </div>
            <div className="bt-card">
              <span>Total spent or committed</span>
              <strong>{moneyExact(totals.spent)}</strong>
            </div>
          </section>

          <section className="bt-card bt-table-card">
            <div className="bt-toolbar">
              <FilterBar value={filter} onChange={setFilter} />
              <input
                className="bt-input bt-search"
                type="search"
                placeholder="Search events"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search events"
              />
            </div>

            {status === "loading" && <p className="bt-empty">Loading events…</p>}
            {status === "error" && (
              <div className="bt-alert bt-alert-danger" role="alert">
                {error}{" "}
                <button type="button" className="bt-btn bt-btn-sm" onClick={load}>
                  Retry
                </button>
              </div>
            )}
            {status === "ready" && <EventExpensesTable events={visible} clubId={clubId} onChanged={load} notify={notify} />}
          </section>

          <div>
            <Link to={backUrl} className="bt-btn" onClick={() => window.scrollTo(0, 0)}>
              ← Back to dashboard
            </Link>
          </div>
        </main>
      </div>

      {toast && (
        <div className={`bt-toast ${toast.type === "error" ? "bt-toast-error" : ""}`} role="status">
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default EventExpenses;
