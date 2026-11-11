import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, useApi, getUser, PageHeader, SearchBox, Skeletons, EmptyState, Badge, Modal, useToast, toneFor, toDate, fmtDate, IconDoc } from "../../ui/ui";

const News = () => {
  const user = getUser();
  const isAdmin = user?.role === "admin";
  const { data, loading, error, reload } = useApi("/news");
  const [search, setSearch] = useState("");
  const [removing, setRemoving] = useState(null);
  const [toast, toastNode] = useToast();

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...(data || [])]
      .filter((n) => !q || `${n.news_title} ${n.news_content} ${n.news_author}`.toLowerCase().includes(q))
      .sort((a, b) => toDate(b.news_created_at) - toDate(a.news_created_at));
  }, [data, search]);

  const feature = !search.trim() ? list[0] : null;
  const rest = feature ? list.slice(1) : list;

  const remove = async () => {
    try {
      await api(`/news/${removing.news_id}`, { method: "DELETE" });
      toast("Post deleted");
      setRemoving(null);
      reload();
    } catch (e) {
      toast(e.message, true);
    }
  };

  const Card = ({ n, big }) => (
    <article className={`ux-card ux-news${big ? "" : " ux-hover"}`}>
      <p className="ux-meta">
        <Badge>{n.news_author}</Badge>
        <span>{fmtDate(n.news_created_at)}</span>
      </p>
      <h3>{n.news_title}</h3>
      <p className="ux-desc" style={big ? { WebkitLineClamp: 5 } : undefined}>{n.news_content}</p>
      <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 8, flexWrap: "wrap" }}>
        {n.news_pdf_url && (
          <a className="ux-btn ux-btn-sm" href={n.news_pdf_url} target="_blank" rel="noopener noreferrer">
            <IconDoc /> Read newsletter
          </a>
        )}
        {isAdmin && (
          <>
            <Link className="ux-btn ux-btn-sm" to={`/news/edit/${n.news_id}`}>Edit</Link>
            <button type="button" className="ux-btn ux-btn-sm ux-btn-danger" onClick={() => setRemoving(n)}>Delete</button>
          </>
        )}
      </div>
    </article>
  );

  return (
    <div className="ux-page">
      <PageHeader eyebrow="Campus updates" title="News" lead="Announcements, newsletters and society updates from across the university.">
        {isAdmin && (
          <Link to="/news/create-news-post" className="ux-btn ux-btn-primary">
            New post
          </Link>
        )}
      </PageHeader>
      <div className="ux-wrap ux-body">
        <div className="ux-toolbar">
          <SearchBox value={search} onChange={setSearch} placeholder="Search news" />
          <span className="ux-count">{list.length} posts</span>
        </div>
        {loading && <Skeletons n={3} />}
        {error && <EmptyState title="Couldn't load news">{error}</EmptyState>}
        {!loading && !error && list.length === 0 && <EmptyState title="No posts found">Try another search.</EmptyState>}

        {feature && (
          <div className="ux-card ux-news-feature">
            <div className="ux-news-art" style={toneFor(feature.news_author)}>Latest · {feature.news_author}</div>
            <Card n={feature} big />
          </div>
        )}
        <div className="ux-grid">
          {rest.map((n) => (
            <Card key={n.news_id} n={n} />
          ))}
        </div>
      </div>
      {removing && (
        <Modal
          title="Delete this post?"
          onClose={() => setRemoving(null)}
          actions={
            <>
              <button className="ux-btn" onClick={() => setRemoving(null)}>Cancel</button>
              <button className="ux-btn ux-btn-solid-danger" onClick={remove}>Delete</button>
            </>
          }
        >
          <p>"{removing.news_title}" will be removed for everyone.</p>
        </Modal>
      )}
      {toastNode}
    </div>
  );
};

export default News;
