import { useState } from "react";
import { Link } from "react-router-dom";
import { api, useApi, PageHeader, CommitteeNav, Badge, Modal, EmptyState, Skeletons, useToast, fmtDate, toDate, daysLeft } from "../../../ui/ui";

const ViewRoles = () => {
  const { data, loading, error, reload } = useApi("/role-openings");
  const [removing, setRemoving] = useState(null);
  const [toast, toastNode] = useToast();
  const roles = [...(data || [])].sort((a, b) => (a.status === b.status ? toDate(a.due_date) - toDate(b.due_date) : a.status === "ONGOING" ? -1 : 1));

  const remove = async () => {
    try {
      await api(`/role-openings/${removing.role_opening_id}`, { method: "DELETE" });
      toast("Role deleted");
      setRemoving(null);
      reload();
    } catch (e) {
      toast(e.message, true);
    }
  };

  return (
    <div className="ux-page">
      <PageHeader eyebrow="Committee" title="Role openings" lead="Recruit for your team and review applicants.">
        <Link to="/committee/roles/create" className="ux-btn ux-btn-primary">Post a role</Link>
      </PageHeader>
      <CommitteeNav />
      <div className="ux-wrap ux-body">
        {loading && <Skeletons n={2} />}
        {error && <EmptyState title="Couldn't load roles">{error}</EmptyState>}
        {!loading && !error && roles.length === 0 && (
          <EmptyState title="No roles yet" action={<Link to="/committee/roles/create" className="ux-btn ux-btn-primary">Post a role</Link>}>
            Post your first opening to start receiving applications.
          </EmptyState>
        )}
        {roles.length > 0 && (
          <div className="ux-card ux-table-wrap">
            <table className="ux-table">
              <thead>
                <tr><th>Position</th><th>Deadline</th><th>Applicants</th><th>Status</th><th /></tr>
              </thead>
              <tbody>
                {roles.map((r) => {
                  const open = r.status === "ONGOING";
                  return (
                    <tr key={r.role_opening_id}>
                      <td className="ux-cell-title"><b>{r.position}</b><small>{(r.description || "").slice(0, 70)}{(r.description || "").length > 70 ? "…" : ""}</small></td>
                      <td className="ux-cell-title"><b>{fmtDate(r.due_date)}</b><small>{open ? `${daysLeft(r.due_date)} days left` : "Closed"}</small></td>
                      <td><b>{r.number_of_registrations}</b></td>
                      <td><Badge kind={open ? "ok" : "muted"}>{open ? "Open" : "Closed"}</Badge></td>
                      <td>
                        <div className="ux-actions">
                          <Link to={`/committee/roles/view/${r.role_opening_id}`} className="ux-btn ux-btn-sm">Applicants</Link>
                          {open && <Link to={`/committee/roles/edit/${r.role_opening_id}`} className="ux-btn ux-btn-sm">Edit</Link>}
                          <button type="button" className="ux-btn ux-btn-sm ux-btn-danger" onClick={() => setRemoving(r)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {removing && (
        <Modal
          title="Delete this role?"
          onClose={() => setRemoving(null)}
          actions={
            <>
              <button className="ux-btn" onClick={() => setRemoving(null)}>Cancel</button>
              <button className="ux-btn ux-btn-solid-danger" onClick={remove}>Delete role</button>
            </>
          }
        >
          <p>"{removing.position}" and its {removing.number_of_registrations} applications will be removed.</p>
        </Modal>
      )}
      {toastNode}
    </div>
  );
};

export default ViewRoles;
