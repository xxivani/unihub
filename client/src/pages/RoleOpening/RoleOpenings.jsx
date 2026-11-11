import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Row } from "../../ui/classic";
import { useApi, PageHeader, SearchBox, Chips, Tabs, Skeletons, EmptyState, fmtDate, toDate, daysLeft } from "../../ui/ui";

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
    <div className="ux-page cl">
      <PageHeader title="Role openings" lead="Societies are looking for people to help run them. Pick a role and apply in a couple of minutes." />
      <div className="ux-wrap ux-body">
        <div className="cl-filters">
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
        <div className="cl-list">
          {list.map((r) => {
            const open = r.status === "ONGOING";
            const left = daysLeft(r.due_date);
            return (
              <Row key={r.role_opening_id} name={clubName(r.club_id)} title={r.position}
                kicker={`${clubName(r.club_id)} · ${open ? "Open" : "Closed"}`}
                meta={<><span>Deadline {fmtDate(r.due_date)}</span>{open && left != null && <span>{left} days left</span>}<span>{r.number_of_registrations ?? 0} applicants</span></>}
                desc={r.description}>
                {open ? <Link to={`/roles/apply/${r.role_opening_id}`} className="ux-btn ux-btn-primary">Apply now</Link> : <button className="ux-btn" disabled>Closed</button>}
              </Row>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoleOpenings;
