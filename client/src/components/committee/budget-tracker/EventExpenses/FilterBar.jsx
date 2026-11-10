const ITEMS = [
  { label: "All events", key: "all" },
  { label: "Ongoing", key: "ONGOING" },
  { label: "Completed", key: "COMPLETED" },
];

const FilterBar = ({ value = "all", onChange }) => (
  <div className="bt-seg" role="tablist" aria-label="Filter by status">
    {ITEMS.map((item) => (
      <button
        key={item.key}
        type="button"
        role="tab"
        aria-selected={value === item.key}
        className={value === item.key ? "is-active" : ""}
        onClick={() => onChange(item.key)}
      >
        {item.label}
      </button>
    ))}
  </div>
);

export default FilterBar;
