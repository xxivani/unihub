import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApi, getUser, PageHeader, SearchBox, Chips, ClubCard, Skeletons, EmptyState } from "../ui/ui";

const Clubs = () => {
  const user = getUser();
  const { data, loading, error } = useApi("/clubs");
  const events = useApi("/events");
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const clubs = data || [];
  const cats = ["All", ...Array.from(new Set(clubs.map((c) => c.club_category))).sort()];
  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clubs.filter((c) => (cat === "All" || c.club_category === cat) && (!q || `${c.club_name} ${c.club_description}`.toLowerCase().includes(q)));
  }, [clubs, search, cat]);
  const countFor = (name) => (events.data || []).filter((e) => e.club === name).length;

  return (
    <div className="ux-page">
      <PageHeader eyebrow="Communities" title="Clubs & societies" lead="Student-run societies across academics, arts, tech and social causes. Find yours and join.">
        {user?.role === "admin" && (
          <Link to="/create-club" className="ux-btn ux-btn-primary">
            Add club
          </Link>
        )}
      </PageHeader>
      <div className="ux-wrap ux-body">
        <div className="ux-toolbar">
          <SearchBox value={search} onChange={setSearch} placeholder="Search clubs" />
          <Chips options={cats} value={cat} onChange={setCat} />
          <span className="ux-count">{list.length} clubs</span>
        </div>
        {loading && <Skeletons n={6} />}
        {error && <EmptyState title="Couldn't load clubs">{error}</EmptyState>}
        {!loading && !error && list.length === 0 && <EmptyState title="No clubs found">Try a different search.</EmptyState>}
        <div className="ux-grid">
          {list.map((c) => (
            <ClubCard key={c.club_id} club={c} extra={`${countFor(c.club_name)} events this term`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clubs;
