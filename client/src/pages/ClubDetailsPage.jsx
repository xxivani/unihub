import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, useApi, getUser, PageHeader, Mono, Badge, EventCard, EmptyState, Skeletons, useToast, IconMail, IconPhone, IconUsers, isUpcoming, eventDate, fmtDate, initials, pretty, daysLeft } from "../ui/ui";

const ClubDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const club = useApi(`/clubs/${id}`, [id]);
  const contact = useApi(`/club-contacts/${id}`, [id]);
  const events = useApi("/events");
  const roles = useApi("/role-openings");
  const committee = useApi(`/committee-members/by-club/${id}`, [id]);
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, toastNode] = useToast();

  useEffect(() => {
    if (!user?.id) return;
    api(`/club-memberships/user/${user.id}`)
      .then((ids) => setJoined((ids || []).map(Number).includes(Number(id))))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const c = club.data;
  if (club.loading) return <div className="ux-page cl"><div className="ux-wrap ux-body"><Skeletons n={2} /></div></div>;
  if (!c)
    return (
      <div className="ux-page cl">
        <div className="ux-wrap ux-body">
          <EmptyState title="Club not found" action={<Link to="/clubs" className="ux-btn ux-btn-primary">All clubs</Link>}>
            We couldn't find that club.
          </EmptyState>
        </div>
      </div>
    );

  const clubEvents = (events.data || []).filter((e) => e.club === c.club_name && isUpcoming(e)).sort((a, b) => eventDate(a) - eventDate(b));
  const clubRoles = (roles.data || []).filter((r) => r.club_id === c.club_id && r.status === "ONGOING");
  const people = committee.data || [];
  const ct = contact.data || {};

  const toggle = async () => {
    if (!user) return navigate("/auth");
    setBusy(true);
    try {
      if (joined) await api("/club-memberships/leave", { method: "POST", body: JSON.stringify({ userId: user.id, clubId: c.club_id }) });
      else await api("/club-memberships", { method: "POST", body: JSON.stringify({ userId: user.id, clubId: c.club_id }) });
      setJoined(!joined);
      toast(joined ? `You left ${c.club_name}` : `Welcome to ${c.club_name}!`);
    } catch (e) {
      toast(e.message, true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ux-page cl">
      <PageHeader crumbs={[["Clubs", "/clubs"], [c.club_name]]} eyebrow={c.club_category} title={c.club_name} lead={c.club_description}>
        <button type="button" className={`ux-btn${joined ? "" : " ux-btn-primary"}`} disabled={busy} onClick={toggle}>
          {joined ? "Member · Leave club" : "Join club"}
        </button>
      </PageHeader>
      <div className="ux-wrap ux-body">
        <div className="ux-detail">
          <div style={{ display: "grid", gap: 24 }}>
            <section>
              <h2 style={{ fontSize: "1.25rem", marginBottom: 16 }}>Upcoming events</h2>
              {events.loading ? (
                <Skeletons n={2} />
              ) : clubEvents.length ? (
                <div className="ux-grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>
                  {clubEvents.map((e) => (
                    <EventCard key={e.id} event={e} />
                  ))}
                </div>
              ) : (
                <EmptyState title="Nothing scheduled">This club has no upcoming events yet.</EmptyState>
              )}
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", marginBottom: 16 }}>Open roles</h2>
              {clubRoles.length ? (
                <div className="ux-list">
                  {clubRoles.map((r) => (
                    <div key={r.role_opening_id} className="ux-card ux-row">
                      <div>
                        <h3>{r.position}</h3>
                        <p className="ux-desc">{r.description}</p>
                        <p className="ux-row-meta">
                          <span>Apply by {fmtDate(r.due_date)}</span>
                          <span>{daysLeft(r.due_date)} days left</span>
                        </p>
                      </div>
                      <Link to={`/roles/apply/${r.role_opening_id}`} className="ux-btn ux-btn-primary ux-btn-sm">
                        Apply
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No open roles">Check back soon.</EmptyState>
              )}
            </section>
          </div>

          <aside className="ux-detail-side">
            <div className="ux-card ux-card-pad">
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 18 }}>
                <Mono name={c.club_name} src={c.club_thumbnail_url} size="lg" />
                <div>
                  <b style={{ display: "block" }}>{c.club_name}</b>
                  <Badge>{c.club_category}</Badge>
                </div>
              </div>
              <h3 className="ux-card-title">Contact</h3>
              <ul className="ux-facts">
                {ct.email && <li><IconMail /><span><small>Email</small>{ct.email}</span></li>}
                {ct.phone && <li><IconPhone /><span><small>Phone</small>{ct.phone}</span></li>}
                {ct.instagram && <li><IconUsers /><span><small>Instagram</small>{ct.instagram}</span></li>}
                {!ct.email && !ct.phone && !ct.instagram && <li><span /><span>No contact details yet.</span></li>}
              </ul>
            </div>
            {people.length > 0 && (
              <div className="ux-card ux-card-pad">
                <h3 className="ux-card-title">Committee</h3>
                <ul className="ux-mini-list">
                  {people.map((p) => (
                    <li key={p.committee_member_id}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span className="ux-avatar">{initials(p.committee_member_name)}</span>
                        <div>
                          <b>{p.committee_member_name}</b>
                          <small>{pretty(p.committee_member_position)}</small>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
      {toastNode}
    </div>
  );
};

export default ClubDetailsPage;
