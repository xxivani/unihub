import { useState } from "react";
import ExpenseModal from "./ExpenseModal";
import { api } from "../budgetUtils";

// "Add expense" button + create modal.
function EventAddExpenseButton({ clubId, onAddEvent, notify }) {
  const [open, setOpen] = useState(false);

  const create = async (values) => {
    await api("/bt_eventRoute", {
      method: "POST",
      body: JSON.stringify({ ...values, club_id: clubId }),
    });
    setOpen(false);
    notify?.("success", "Event added to the budget tracker.");
    onAddEvent?.();
  };

  return (
    <>
      <button type="button" className="bt-btn bt-btn-primary" onClick={() => setOpen(true)} disabled={!clubId}>
        + Add expense
      </button>
      <ExpenseModal open={open} title="Add event expense" requireCategory onClose={() => setOpen(false)} onSubmit={create} />
    </>
  );
}

export default EventAddExpenseButton;
