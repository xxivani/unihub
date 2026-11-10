import { money } from "../budgetUtils";

const LatestEventsList = ({ events = [] }) => {
  const rows = events.slice(0, 5).map((e) => ({
    id: e.id,
    name: e.name,
    amount: Number(e.totalExpense ?? e.amount ?? 0),
  }));
  const max = Math.max(1, ...rows.map((r) => r.amount));

  if (!rows.length) return <p className="bt-empty">No events with expenses yet.</p>;

  return (
    <ul className="bt-event-list">
      {rows.map((r) => (
        <li key={r.id}>
          <div className="bt-event-row">
            <span className="bt-event-name">{r.name}</span>
            <span className="bt-event-amount">{money(r.amount)}</span>
          </div>
          <div className="bt-event-bar">
            <span style={{ width: `${(r.amount / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LatestEventsList;
