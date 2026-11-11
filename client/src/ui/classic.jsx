import { Link } from "react-router-dom";
import { toneFor } from "./ui";

// Image block: photo if we have one, otherwise a coloured tile with initials. Never overlaps text.
export const Thumb = ({ src, name = "", className = "cl-img" }) => (
  <div className={className} style={toneFor(name)}>
    {src ? <img src={src} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} /> : null}
    {!src && <span>{name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}</span>}
  </div>
);

export const Row = ({ img, name, kicker, title, to, meta, desc, children }) => (
  <article className="cl-row">
    {to ? <Link to={to} aria-label={title}><Thumb src={img} name={name || title} /></Link> : <Thumb src={img} name={name || title} />}
    <div className="cl-body">
      {kicker && <p className="cl-kicker">{kicker}</p>}
      <h3>{to ? <Link to={to}>{title}</Link> : title}</h3>
      {meta && <p className="cl-meta">{meta}</p>}
      {desc && <p className="cl-desc">{desc}</p>}
    </div>
    <div className="cl-side">{children}</div>
  </article>
);
