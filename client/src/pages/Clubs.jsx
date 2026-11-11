import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Row } from "../ui/classic";
import { useApi, getUser, PageHeader, SearchBox, Chips, Skeletons, EmptyState } from "../ui/ui";

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
    <div className="ux-page cl">
      <PageHeader title="Clubs" lead="Student-run societies across academics, arts, tech and social causes.">
        {user?.role === "admin" && <Link to="/create-club" className="ux-btn ux-btn-primary">Add club</Link>}
      </PageHeader>
      <div className="ux-wrap ux-body">
        <div className="cl-filters">
          <SearchBox value={search} onChange={setSearch} placeholder="Search clubs" />
          <span className="ux-count">{list.length} clubs</span>
        </div>
        <div style={{ marginBottom: 22 }}>
          <Chips options={cats} value={cat} onChange={setCat} />
        </div>
        {loading && <Skeletons n={4} />}
        {error && <EmptyState title="Couldn't load clubs">{error}</EmptyState>}
        {!loading && !error && list.length === 0 && <EmptyState title="No clubs found">Try a different search.</EmptyState>}
        <div className="cl-list">
          {list.map((c) => (
            <Row key={c.club_id} img={c.club_thumbnail_url} name={c.club_name} title={c.club_name} to={`/club-details/${c.club_id}`}
              kicker={c.club_category} desc={c.club_description}
              meta={<span>{countFor(c.club_name)} event{countFor(c.club_name) === 1 ? "" : "s"} this term</span>}>
              <Link to={`/club-details/${c.club_id}`} className="ux-btn ux-btn-primary">View club</Link>
            </Row>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clubs;
