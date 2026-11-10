import { useEffect, useState } from "react";
import { api, initials, prettyRole } from "../budgetUtils";

const ORDER = ["PRESIDENT", "VICE_PRESIDENT", "TREASURER"];
const rank = (p) => {
  const i = ORDER.indexOf(p);
  return i === -1 ? ORDER.length : i;
};

const BTCommitteeMembers = ({ clubId }) => {
  const [members, setMembers] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    if (!clubId) return;
    let cancelled = false;
    setState("loading");
    api(`/committee-members/by-club/${clubId}`)
      .then((list) => {
        if (cancelled) return;
        setMembers([...list].sort((a, b) => rank(a.committee_member_position) - rank(b.committee_member_position)));
        setState("ready");
      })
      .catch(() => !cancelled && setState("error"));
    return () => {
      cancelled = true;
    };
  }, [clubId]);

  if (state === "loading") return <p className="bt-empty">Loading committee…</p>;
  if (state === "error") return <p className="bt-empty">Committee members are unavailable right now.</p>;
  if (!members.length) return <p className="bt-empty">No committee members listed.</p>;

  return (
    <ul className="bt-people">
      {members.map((m) => (
        <li key={m.committee_member_id}>
          <span className="bt-avatar" aria-hidden="true">
            {initials(m.committee_member_name)}
          </span>
          <span className="bt-person">
            <strong>{m.committee_member_name}</strong>
            <small>{prettyRole(m.committee_member_position)}</small>
          </span>
        </li>
      ))}
    </ul>
  );
};

export default BTCommitteeMembers;
