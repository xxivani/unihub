import { useNavigate, useParams } from "react-router-dom";
import { api, useApi, PageHeader, CommitteeNav, Skeletons, EmptyState } from "../../../ui/ui";
import RoleForm from "./RoleForm";

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: role, loading } = useApi(`/role-openings/${id}`, [id]);

  const save = async (f) => {
    await api(`/role-openings/${id}`, {
      method: "PUT",
      body: JSON.stringify({ position: f.position.trim(), due_date: f.due_date, description: f.description.trim(), eligibility_criteria: f.eligibility_criteria.trim() }),
    });
    navigate("/committee/roles");
  };

  return (
    <div className="ux-page">
      <PageHeader crumbs={[["Role openings", "/committee/roles"], ["Edit"]]} eyebrow="Committee" title="Edit role" />
      <CommitteeNav />
      <div className="ux-wrap ux-body">
        {loading && <Skeletons n={1} />}
        {!loading && !role && <EmptyState title="Role not found">It may have been deleted.</EmptyState>}
        {role && <RoleForm initial={{ position: role.position, due_date: String(role.due_date).slice(0, 10), description: role.description, eligibility_criteria: role.eligibility_criteria }} submitLabel="Save changes" onSubmit={save} />}
      </div>
    </div>
  );
};

export default EditRole;
