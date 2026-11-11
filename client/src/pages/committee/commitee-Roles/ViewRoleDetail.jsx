import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, useApi, PageHeader, CommitteeNav, Badge, EmptyState, Skeletons, Tabs, useToast, fmtDate, initials, IconMail, IconPhone, IconDoc } from "../../../ui/ui";

const kind = (s) => (s === "SELECTED" ? "ok" : s === "REJECTED" ? "bad" : "warn");
const label = (s) => s.charAt(0) + s.slice(1).toLowerCase();

const ViewRoleDetail = () => {
  const { id } = useParams();
  const role = useApi(`/role-openings/${id}`, [id]);
  const regs = useApi("/role-opening-registrations");
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState(null);
  const [toast, toastNode] = useToast();

  useEffect(() => {
    if (regs.data) setRows(regs.data.filter((r) => String(r.role_opening_id) === String(id)));
  }, [regs.data, id]);

  const shown = rows.filter((r) => filter === "ALL" || r.status === filter);
  const current = rows.find((r) => r.role_opening_registration_id === selectedId) || shown[0];
  const count = (s) => rows.filter((r) => r.status === s).length;

  const decide = async (status) => {
    try {
      await api(`/role-opening-registrations/${current.role_opening_registration_id}`, { method: "PUT", body: JSON.stringify({ status }) });
      setRows(rows.map((r) => (r.role_opening_registration_id === current.role_opening_registration_id ? { ...r, status } : r)));
      toast(`${current.user_name} marked as ${label(status).toLowerCase()}`);
    } catch (e) {
      toast(e.message, true);
    }
  };

  return (
    <div className="ux-page">
      <PageHeader crumbs={[["Role openings", "/committee/roles"], [role.data?.position || "Applicants"]]} eyebrow="Applicants" title={role.data?.position || "Role"} lead={role.data ? `${rows.length} applications · ${count("PENDING")} awaiting review · closes ${fmtDate(role.data.due_date)}` : undefined} />
      <CommitteeNav />
      <div className="ux-wrap ux-body">
        {regs.loading && <Skeletons n={2} />}
        {!regs.loading && rows.length === 0 && <EmptyState title="No applications yet">Students' applications will show up here.</EmptyState>}
        {rows.length > 0 && (
          <>
            <div className="ux-toolbar">
              <Tabs options={[["ALL", `All (${rows.length})`], ["PENDING", `Pending (${count("PENDING")})`], ["SELECTED", `Selected (${count("SELECTED")})`], ["REJECTED", `Rejected (${count("REJECTED")})`]]} value={filter} onChange={setFilter} />
            </div>
            <div className="ux-detail ux-detail-wide">
              <div className="ux-card" style={{ overflow: "hidden" }}>
                {shown.map((r) => (
                  <button
                    key={r.role_opening_registration_id}
                    type="button"
                    onClick={() => setSelectedId(r.role_opening_registration_id)}
                    style={{ display: "flex", width: "100%", gap: 12, alignItems: "center", padding: "14px 18px", border: 0, borderBottom: "1px solid var(--border)", background: current?.role_opening_registration_id === r.role_opening_registration_id ? "var(--accent-soft)" : "transparent", color: "var(--text)", font: "inherit", textAlign: "left", cursor: "pointer" }}
                  >
                    <span className="ux-avatar">{initials(r.user_name)}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <b style={{ display: "block", fontSize: ".92rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.user_name}</b>
                      <small style={{ color: "var(--muted)" }}>{fmtDate(r.created_at)}</small>
                    </span>
                    <Badge kind={kind(r.status)}>{label(r.status)}</Badge>
                  </button>
                ))}
                {shown.length === 0 && <p style={{ padding: 20, color: "var(--muted)" }}>No applications in this view.</p>}
              </div>

              {current && (
                <div className="ux-card ux-card-pad">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <span className="ux-avatar" style={{ width: 52, height: 52, fontSize: "1rem" }}>{initials(current.user_name)}</span>
                      <div>
                        <h3 style={{ fontSize: "1.2rem" }}>{current.user_name}</h3>
                        <Badge kind={kind(current.status)}>{label(current.status)}</Badge>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" className="ux-btn ux-btn-primary" disabled={current.status === "SELECTED"} onClick={() => decide("SELECTED")}>Select</button>
                      <button type="button" className="ux-btn ux-btn-danger" disabled={current.status === "REJECTED"} onClick={() => decide("REJECTED")}>Reject</button>
                    </div>
                  </div>
                  <ul className="ux-facts">
                    <li><IconMail /><span><small>Email</small>{current.user_email}</span></li>
                    <li><IconPhone /><span><small>Phone</small>{current.user_phone}</span></li>
                  </ul>
                  <h4 style={{ fontSize: ".8rem", color: "var(--muted) !important", textTransform: "uppercase", letterSpacing: ".08em", margin: "0 0 8px" }}>Why they applied</h4>
                  <p className="ux-prose" style={{ marginBottom: 18 }}>{current.applicant_suitability}</p>
                  {current.applicant_cv_url && (
                    <a className="ux-btn ux-btn-sm" href={current.applicant_cv_url} target="_blank" rel="noopener noreferrer"><IconDoc /> View CV</a>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {toastNode}
    </div>
  );
};

export default ViewRoleDetail;
