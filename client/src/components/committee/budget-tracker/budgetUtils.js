// Shared helpers for the budget tracker pages.

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const CATEGORY_META = {
  catering: { label: "Catering", color: "#2563eb" },
  materials: { label: "Materials", color: "#16a34a" },
  prize: { label: "Prizes", color: "#d97706" },
  venue: { label: "Venue", color: "#7c3aed" },
  transportation: { label: "Transport", color: "#dc2626" },
};
export const CATEGORY_KEYS = Object.keys(CATEGORY_META);
const FALLBACK_COLORS = ["#0891b2", "#be185d", "#4d7c0f", "#475569"];

export const categoryMeta = (name, index = 0) => {
  const key = String(name || "").toLowerCase();
  return (
    CATEGORY_META[key] || {
      label: key ? key[0].toUpperCase() + key.slice(1) : "Other",
      color: FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    }
  );
};

export const money = (n) =>
  `AED ${Number(n || 0).toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;

export const moneyExact = (n) =>
  `AED ${Number(n || 0).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const getUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("") || "?";

export const prettyRole = (role = "") =>
  role
    .toLowerCase()
    .split("_")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");

// "2026/27" for Aug 2026 - Jul 2027
export const academicYear = (d = new Date()) => {
  const y = d.getFullYear();
  const start = d.getMonth() >= 7 ? y : y - 1;
  return `${start}/${String(start + 1).slice(2)}`;
};

// dd/mm/yyyy (as returned by the API) -> yyyy-mm-dd for <input type="date">
export const toInputDate = (value) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  const d = new Date(value);
  return isNaN(d) ? "" : d.toISOString().slice(0, 10);
};

// Small fetch wrapper: JSON in, JSON out, readable errors.
export async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    const err = new Error(data?.message || data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const sumCategories = (categories = []) =>
  categories.reduce((s, c) => s + Number(c.amount || 0), 0);

// The club a committee member is scoped to: URL param, then session.
export const resolveClubId = (search = "") =>
  new URLSearchParams(search).get("club_id") || sessionStorage.getItem("selectedClubId") || null;
