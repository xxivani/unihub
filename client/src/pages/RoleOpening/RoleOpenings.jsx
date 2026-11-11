import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApi, PageHeader, SearchBox, Chips, Tabs, Mono, Badge, Skeletons, EmptyState, fmtDate, toDate, daysLeft } from "../../ui/ui";

const RoleOpenings = () => {
  const roles = useApi("/role-openings");
  const clubs = useApi("/clubs");
  const [search, setSearch] = useState("");
  const [club, setClub] = useState("All clubs");
  const [status, setStatus] = useState("open");

  const clubName = (id) => (clubs.data || []).find((c) => c.club_id === id)?.club_name || "";
  const all = roles.data || [];
  const names = ["All clubs", ...Array.from(new Set(all.map((r) => clubName(r.club_id)).filter(Boolean))).sort()];

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all
      .filter((r) => (status === "all" ? true : status === "open" ? r.status === "ONGOING" : r.status !== "ONGOING"))
      .filter((r) => club === "All clubs" || clubName(r.club_id) === club)
      .filter((r) => !q || `${r.position} ${r.description}`.toLowerCase().includes(q))
      .sort((a, b) => toDate(a.due_date) - toDate(b.due_date));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, clubs.data, search, club, status]);

  return (
    <div className="ux-page">
      <PageHeader eyebrow="Get involved" title="Role openings" lead="Societies are looking for people to help run them. Pick a role that suits your skills and apply in a couple of minutes." />
      <div className="ux-wrap ux-body">
        <div className="ux-toolbar">
          <SearchBox value={search} onChange={setSearch} placeholder="Search roles" />
          <Tabs
            options={[
              ["open", "Open"],
              ["closed", "Closed"],
              ["all", "All"],
            ]}
            value={status}
            onChange={setStatus}
          />
          <span className="ux-count">{list.length} roles</span>
        </div>
        <div style={{ marginBottom: 24 }}>
          <Chips options={names} value={club} onChange={setClub} />
        </div>

        {roles.loading && <Skeletons n={3} />}
        {!roles.loading && list.length === 0 && <EmptyState title="No roles found">Try changing the filters.</EmptyState>}
        <div className="ux-list">
          {list.map((r) => {
            const open = r.status === "ONGOING";
            const left = daysLeft(r.due_date);
            return (
              <article className="ux-card ux-row ux-hover" key={r.role_opening_id}>
                <div style={{ display: "flex", gap: 16, minWidth: 0 }}>
                  <Mono name={clubName(r.club_id)} />
                  <div style={{ minWidth: 0 }}>
                    <h3>{r.position}</h3>
                    <p className="ux-meta" style={{ marginBottom: 8 }}>
                      <span>{clubName(r.club_id)}</span>
                    </p>
                    <p className="ux-desc">{r.description}</p>
                    <p className="ux-row-meta">
                      <span>Deadline {fmtDate(r.due_date)}</span>
                      {open && left != null && <span>{left} days left</span>}
                      <span>{r.number_of_registrations ?? 0} applicants</span>
                    </p>
                    {r.eligibility_criteria && (
                      <p className="ux-meta" style={{ marginTop: 8 }}>
                        <span style={{ whiteSpace: "normal" }}>Eligibility: {r.eligibility_criteria}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="ux-row-side">
                  <Badge kind={open ? "ok" : "muted"}>{open ? "Open" : "Closed"}</Badge>
                  {open ? (
                    <Link to={`/roles/apply/${r.role_opening_id}`} className="ux-btn ux-btn-primary">
                      Apply now
                    </Link>
                  ) : (
                    <button className="ux-btn" disabled>
                      Applications closed
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoleOpenings;
