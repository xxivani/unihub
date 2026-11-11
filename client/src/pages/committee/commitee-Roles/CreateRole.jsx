import { useNavigate } from "react-router-dom";
import { api, useMyClub, PageHeader, CommitteeNav } from "../../../ui/ui";
import RoleForm from "./RoleForm";

const CreateRole = () => {
  const navigate = useNavigate();
  const { clubId, club } = useMyClub();
  const create = async (f) => {
    const fd = new FormData();
    fd.append("position", f.position.trim());
    fd.append("due_date", f.due_date);
    fd.append("description", f.description.trim());
    fd.append("eligibility_criteria", f.eligibility_criteria.trim());
    fd.append("club_id", clubId || 2);
    await api("/role-openings", { method: "POST", body: fd });
    navigate("/committee/roles");
  };
  return (
    <div className="ux-page">
      <PageHeader crumbs={[["Role openings", "/committee/roles"], ["New role"]]} eyebrow="Committee" title="Post a role" lead={`Open a new position${club?.club_name ? ` at ${club.club_name}` : ""}.`} />
      <CommitteeNav />
      <div className="ux-wrap ux-body">
        <RoleForm submitLabel="Publish role" onSubmit={create} />
      </div>
    </div>
  );
};

export default CreateRole;
