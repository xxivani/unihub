import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../../committee-dashboard/Sidebar";
import { MonthlyChart, DonutChart } from "../../../charts/BudgetCharts";
import LatestEventsList from "./LatestEventsList";
import BTCommitteeMembers from "./BTCommitteeMembers";
import { api, getUser, money, categoryMeta, academicYear } from "../budgetUtils";
import "../bt-shared.css";
import "./BudgetDashboard.css";

const usageTone = (pct) => (pct >= 90 ? "danger" : pct >= 75 ? "warn" : "ok");

const BudgetDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlClubId = new URLSearchParams(location.search).get("club_id");

  const user = getUser();
  const isAdmin = user?.role === "admin";

  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState(null);
  const [club, setClub] = useState(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error | noclub
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // 1. Work out which club to show. Committee members are pinned to their own club.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let id = urlClubId || sessionStorage.getItem("selectedClubId");
        let list = [];
        if (isAdmin) {
          list = await api("/clubs");
          if (!id && list.length) id = String(list[0].club_id);
        } else if (user?.id) {
          try {
            const member = await api(`/committee-members/by-user/${user.id}`);
            if (member?.club_id) id = String(member.club_id);
          } catch {
            /* fall back to URL / session club */
          }
        }
        if (cancelled) return;
        setClubs(list);
        if (!id) {
          setStatus("noclub");
          return;
        }
        sessionStorage.setItem("selectedClubId", id);
        setClubId(id);
      } catch (e) {
        if (!cancelled) {
          setError(e.message);
          setStatus("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Load the dashboard whenever the club changes.
  useEffect(() => {
    if (!clubId) return;
    let cancelled = false;
    setStatus("loading");
    Promise.all([api(`/bt_dashboardRoute?club_id=${clubId}`), api(`/clubs/${clubId}`).catch(() => null)])
      .then(([dashboard, clubInfo]) => {
        if (cancelled) return;
        setData(dashboard);
        setClub(clubInfo);
        setError("");
        setStatus("ready");
        if (urlClubId !== String(clubId)) {
          navigate({ pathname: location.pathname, search: `?club_id=${clubId}` }, { replace: true });
        }
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message || "Could not load the budget.");
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId, reloadKey]);

  const onClubChange = useCallback((e) => {
    sessionStorage.setItem("selectedClubId", e.target.value);
    setClubId(e.target.value);
  }, []);

  const summary = data?.budgetSummary || { totalBudget: 0, totalSpent: 0, remaining: 0 };
  const total = Number(summary.totalBudget) || 0;
  const spent = Number(summary.totalSpent) || 0;
  const remaining = Number(summary.remaining) || 0;
  const pct = total > 0 ? Math.min(100, Math.round((spent / total) * 100)) : 0;
  const tone = usageTone(total > 0 ? (spent / total) * 100 : 0);

  const breakdown = (data?.expenseBreakdown || []).map((item, i) => ({
    label: categoryMeta(item.category, i).label,
    color: categoryMeta(item.category, i).color,
    value: Number(item.amount) || 0,
  }));
  const breakdownTotal = breakdown.reduce((s, b) => s + b.value, 0);

  const expensesLink = `/committee/budget-tracker/event-expenses${clubId ? `?club_id=${clubId}` : ""}`;

  return (
    <div className="bt-page">
      <div className="bt-layout">
        <aside className="bt-sidebar">
          <Sidebar />
        </aside>

        <main className="bt-main">
          <header className="bt-header">
            <div>
              <h1 className="bt-title">Budget Tracker</h1>
              <p className="bt-subtitle">
                {club?.club_name ? `${club.club_name} · ` : ""}Academic year {academicYear()}
              </p>
            </div>
            <div className="bt-header-actions">
              {isAdmin && clubs.length > 0 && (
                <select className="bt-select" value={clubId || ""} onChange={onClubChange} aria-label="Select club">
                  {clubs.map((c) => (
                    <option key={c.club_id} value={c.club_id}>
                      {c.club_name}
                    </option>
                  ))}
                </select>
              )}
              <Link to={expensesLink} className="bt-btn bt-btn-primary" onClick={() => window.scrollTo(0, 0)}>
                Manage event expenses
              </Link>
            </div>
          </header>

          {status === "noclub" && (
            <div className="bt-card bt-state">
              <h2>No club linked to your account</h2>
              <p>Ask your club president to add you to the committee to see its budget.</p>
            </div>
          )}

          {status === "error" && (
            <div className="bt-card bt-state" role="alert">
              <h2>Couldn&apos;t load the budget</h2>
              <p>{error}</p>
              <button type="button" className="bt-btn bt-btn-primary" onClick={() => (clubId ? setReloadKey((k) => k + 1) : window.location.reload())}>
                Try again
              </button>
            </div>
          )}

          {status === "loading" && (
            <div className="bt-skeletons" aria-busy="true" aria-label="Loading budget">
              <div className="bt-skeleton" />
              <div className="bt-skeleton" />
              <div className="bt-skeleton" />
            </div>
          )}

          {status === "ready" && (
            <>
              <section className="bt-stats" aria-label="Budget summary">
                <article className="bt-card bt-stat">
                  <span className="bt-stat-label">Total budget</span>
                  <strong className="bt-stat-value">{money(total)}</strong>
                  <span className="bt-stat-note">Allocated for this academic year</span>
                </article>
                <article className="bt-card bt-stat">
                  <span className="bt-stat-label">Spent or committed</span>
                  <strong className="bt-stat-value">{money(spent)}</strong>
                  <div className={`bt-progress bt-progress-${tone}`} role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
                    <span style={{ width: `${pct}%` }} />
                  </div>
                  <span className="bt-stat-note">{pct}% of budget used</span>
                </article>
                <article className="bt-card bt-stat">
                  <span className="bt-stat-label">Remaining</span>
                  <strong className={`bt-stat-value ${remaining < 0 ? "bt-negative" : ""}`}>{money(remaining)}</strong>
                  <span className="bt-stat-note">{remaining < 0 ? "Over budget" : "Available to allocate"}</span>
                </article>
              </section>

              {tone !== "ok" && (
                <div className={`bt-alert bt-alert-${tone}`} role="status">
                  {remaining < 0
                    ? `Budget exceeded by ${money(Math.abs(remaining))}.`
                    : `Only ${100 - pct}% of the budget is left. Review upcoming events before committing more spend.`}
                </div>
              )}

              <section className="bt-grid-2">
                <article className="bt-card">
                  <h2 className="bt-card-title">Monthly spending</h2>
                  <p className="bt-card-sub">AED per month, including planned events</p>
                  <MonthlyChart data={data?.monthlyExpenses || []} />
                </article>

                <article className="bt-card">
                  <h2 className="bt-card-title">Spending by category</h2>
                  <p className="bt-card-sub">Share of total spend</p>
                  <div className="bt-donut-wrap">
                    <DonutChart data={breakdown} centerLabel="Total" centerValue={money(breakdownTotal)} />
                    <ul className="bt-legend">
                      {breakdown.map((b) => (
                        <li key={b.label}>
                          <span className="bt-dot" style={{ background: b.color }} />
                          <span className="bt-legend-name">{b.label}</span>
                          <span className="bt-legend-value">{money(b.value)}</span>
                          <span className="bt-legend-pct">{breakdownTotal ? Math.round((b.value / breakdownTotal) * 100) : 0}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </section>

              <section className="bt-grid-2">
                <article className="bt-card">
                  <div className="bt-card-head">
                    <h2 className="bt-card-title">Recent events</h2>
                    <Link to={expensesLink} className="bt-link" onClick={() => window.scrollTo(0, 0)}>
                      View all
                    </Link>
                  </div>
                  <LatestEventsList events={data?.latestEvents || []} />
                </article>

                <article className="bt-card">
                  <h2 className="bt-card-title">Committee</h2>
                  <p className="bt-card-sub">People who can manage this budget</p>
                  <BTCommitteeMembers clubId={clubId} />
                </article>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default BudgetDashboard;
