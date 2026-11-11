import { Link } from "react-router-dom";
import { useApi, useMyClub, PageHeader, CommitteeNav, Badge, Skeletons, isUpcoming, eventDate, fmtDate, toDate, daysLeft, priceLabel } from "../../ui/ui";

const money = (n) => `AED ${Number(n || 0).toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;

const Dashboard = () => {
  const { user, clubId, club } = useMyClub();
  const events = useApi("/events");
  const roles = useApi("/role-openings");
  const regs = useApi("/role-opening-registrations");
  const budget = useApi(clubId ? `/bt_dashboardRoute?club_id=${clubId}` : null, [clubId]);

  const upcoming = (events.data || []).filter(isUpcoming).sort((a, b) => eventDate(a) - eventDate(b));
  const myRoles = roles.data || [];
  const roleIds = new Set(myRoles.map((r) => r.role_opening_id));
  const applications = (regs.data || []).filter((r) => roleIds.has(r.role_opening_id));
  const pending = applications.filter((r) => r.status === "PENDING");
  const openRoles = myRoles.filter((r) => r.status === "ONGOING");
  const sum = budget.data?.budgetSummary;
  const pct = sum?.totalBudget ? Math.round((sum.totalSpent / sum.totalBudget) * 100) : 0;
  const roleName = (id) => myRoles.find((r) => r.role_opening_id === id)?.position || "";
  const signups = upcoming.reduce((s, e) => s + (Number(e.followed) || 0), 0);

  return (
    <div className="ux-page">
      <PageHeader eyebrow="Committee" title={club?.club_name ? `${club.club_name} dashboard` : "Committee dashboard"} lead={`Welcome back${user?.email ? `, ${user.email.split("@")[0]}` : ""}. Here is what needs your attention.`}>
        <Link to="/committee/events/create" className="ux-btn ux-btn-primary">New event</Link>
        <Link to="/committee/roles/create" className="ux-btn">Post a role</Link>
      </PageHeader>
      <CommitteeNav />
      <div className="ux-wrap ux-body">
        <div className="ux-kpis">
          <div className="ux-card ux-kpi"><span>Upcoming events</span><b>{upcoming.length}</b><small>{signups} sign-ups so far</small></div>
          <div className="ux-card ux-kpi"><span>Open roles</span><b>{openRoles.length}</b><small>{applications.length} applications total</small></div>
          <div className="ux-card ux-kpi"><span>Awaiting review</span><b>{pending.length}</b><small>applications pending</small></div>
          <div className="ux-card ux-kpi"><span>Budget used</span><b>{sum ? `${pct}%` : "–"}</b><small>{sum ? `${money(sum.remaining)} remaining` : "loading"}</small></div>
        </div>

        <div className="ux-two">
          <section className="ux-card ux-card-pad">
            <div className="ux-section-head" style={{ marginBottom: 12 }}>
              <h3 className="ux-card-title" style={{ margin: 0 }}>Upcoming events</h3>
              <Link to="/committee/events" className="ux-more">Manage →</Link>
            </div>
            {events.loading ? <Skeletons n={1} /> : (
              <ul className="ux-mini-list">
                {upcoming.slice(0, 5).map((e) => {
                  const cap = Number(e.capacity) || 0;
                  return (
                    <li key={e.id}>
                      <div>
                        <b>{e.title}</b>
                        <small>{fmtDate(eventDate(e))} · {e.time} · {e.location}</small>
                      </div>
                      <Badge kind={cap && e.followed / cap > 0.85 ? "warn" : undefined}>{e.followed}/{cap}</Badge>
                    </li>
                  );
                })}
                {!upcoming.length && <li><small>No upcoming events. Create one to get started.</small></li>}
              </ul>
            )}
          </section>

          <section className="ux-card ux-card-pad">
            <h3 className="ux-card-title">Quick actions</h3>
            <div className="ux-quick">
              <Link to="/committee/events/create">Create event<small>Publish to students</small></Link>
              <Link to="/committee/roles/create">Post a role<small>Recruit for your team</small></Link>
              <Link to="/committee/budget-tracker">Budget tracker<small>Spend & remaining</small></Link>
              <Link to="/committee/image-management">Event images<small>Manage galleries</small></Link>
            </div>
          </section>
        </div>

        <div className="ux-two" style={{ marginTop: 20 }}>
          <section className="ux-card ux-card-pad">
            <div className="ux-section-head" style={{ marginBottom: 12 }}>
              <h3 className="ux-card-title" style={{ margin: 0 }}>Recent applications</h3>
              <Link to="/committee/roles" className="ux-more">All roles →</Link>
            </div>
            <ul className="ux-mini-list">
              {[...applications].sort((a, b) => toDate(b.created_at) - toDate(a.created_at)).slice(0, 5).map((a) => (
                <li key={a.role_opening_registration_id}>
                  <div>
                    <b>{a.user_name}</b>
                    <small>{roleName(a.role_opening_id)} · {fmtDate(a.created_at)}</small>
                  </div>
                  <Badge kind={a.status === "SELECTED" ? "ok" : a.status === "REJECTED" ? "bad" : "warn"}>{a.status.charAt(0) + a.status.slice(1).toLowerCase()}</Badge>
                </li>
              ))}
              {!applications.length && <li><small>No applications yet.</small></li>}
            </ul>
          </section>
          <section className="ux-card ux-card-pad">
            <div className="ux-section-head" style={{ marginBottom: 12 }}>
              <h3 className="ux-card-title" style={{ margin: 0 }}>Closing soon</h3>
            </div>
            <ul className="ux-mini-list">
              {[...openRoles].sort((a, b) => toDate(a.due_date) - toDate(b.due_date)).slice(0, 4).map((r) => (
                <li key={r.role_opening_id}>
                  <div><b>{r.position}</b><small>{daysLeft(r.due_date)} days left · {r.number_of_registrations} applicants</small></div>
                  <Link to={`/committee/roles/view/${r.role_opening_id}`} className="ux-btn ux-btn-sm">Review</Link>
                </li>
              ))}
              {!openRoles.length && <li><small>No open roles.</small></li>}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
