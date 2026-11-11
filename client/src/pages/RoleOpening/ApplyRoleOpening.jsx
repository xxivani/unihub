import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, useApi, getUser, PageHeader, Field, Mono, Badge, EmptyState, Skeletons, fmtDate, daysLeft } from "../../ui/ui";

const ApplyRoleOpening = () => {
  const { index: id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const role = useApi(`/role-openings/${id}`, [id]);
  const club = useApi(role.data ? `/clubs/${role.data.club_id}` : null, [role.data?.club_id]);
  const [form, setForm] = useState({ name: "", phone: "", email: user?.email || "", why: "" });
  const [cv, setCv] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const r = role.data;
  if (role.loading) return <div className="ux-page cl"><div className="ux-wrap ux-body"><Skeletons n={2} /></div></div>;
  if (!r)
    return (
      <div className="ux-page cl">
        <div className="ux-wrap ux-body">
          <EmptyState title="Role not found" action={<Link to="/roles" className="ux-btn ux-btn-primary">All roles</Link>}>
            This opening may have been removed.
          </EmptyState>
        </div>
      </div>
    );
  const open = r.status === "ONGOING";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) return navigate("/auth");
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || form.why.trim().length < 20) {
      setError("Please complete every field. Your statement should be at least 20 characters.");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("role_opening_id", r.role_opening_id);
      fd.append("user_id", user.id);
      fd.append("user_name", form.name);
      fd.append("user_phone", form.phone);
      fd.append("user_email", form.email);
      fd.append("applicant_suitability", form.why);
      if (cv) fd.append("cv", cv);
      await api("/role-opening-registrations", { method: "POST", body: fd });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ux-page cl">
      <PageHeader crumbs={[["Role openings", "/roles"], [r.position]]} eyebrow={club.data?.club_name} title={r.position} lead={r.description}>
        <Badge kind={open ? "ok" : "muted"}>{open ? `${daysLeft(r.due_date)} days left` : "Closed"}</Badge>
      </PageHeader>
      <div className="ux-wrap ux-body">
        <div className="ux-detail">
          {done ? (
            <div className="ux-card ux-card-pad ux-state" style={{ color: "var(--text)" }}>
              <h3>Application sent</h3>
              <p style={{ color: "var(--muted)" }}>Thanks, {form.name.split(" ")[0] || "there"}. The {club.data?.club_name || "committee"} team will review it and get back to you by email.</p>
              <div style={{ marginTop: 18, display: "flex", gap: 10, justifyContent: "center" }}>
                <Link to="/roles" className="ux-btn ux-btn-primary">More roles</Link>
                <Link to="/" className="ux-btn">Home</Link>
              </div>
            </div>
          ) : (
            <form className="ux-card ux-fieldset" onSubmit={submit} noValidate>
              <h3>Your application</h3>
              <p>Tell the committee a little about yourself.</p>
              <div className="ux-fields">
                <Field label="Full name"><input className="ux-input" value={form.name} onChange={set("name")} autoComplete="name" /></Field>
                <Field label="Phone number"><input className="ux-input" value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="+971 50 123 4567" /></Field>
                <Field label="Email address" wide><input className="ux-input" type="email" value={form.email} onChange={set("email")} autoComplete="email" /></Field>
                <Field label="Why should we choose you?" wide hint={`${form.why.length} characters`}>
                  <textarea className="ux-textarea" value={form.why} onChange={set("why")} placeholder="Relevant experience, what you would bring to the role…" />
                </Field>
                <Field label="CV (optional)" wide hint={cv ? cv.name : "PDF, up to 5 MB"}>
                  <input className="ux-input" type="file" accept=".pdf" onChange={(e) => setCv(e.target.files?.[0] || null)} />
                </Field>
              </div>
              {error && <div className="ux-error" style={{ marginTop: 16 }}>{error}</div>}
              <div className="ux-form-actions" style={{ marginTop: 20 }}>
                <Link to="/roles" className="ux-btn">Cancel</Link>
                <button className="ux-btn ux-btn-primary" disabled={busy || !open}>{busy ? "Sending…" : open ? "Submit application" : "Applications closed"}</button>
              </div>
            </form>
          )}

          <aside className="ux-detail-side">
            <div className="ux-card ux-card-pad">
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <Mono name={club.data?.club_name || r.position} />
                <div>
                  <b style={{ display: "block" }}>{club.data?.club_name}</b>
                  <small style={{ color: "var(--muted)" }}>Deadline {fmtDate(r.due_date)}</small>
                </div>
              </div>
              <h3 className="ux-card-title">Eligibility</h3>
              <p className="ux-prose" style={{ fontSize: ".92rem" }}>{r.eligibility_criteria || "Open to all students."}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ApplyRoleOpening;
