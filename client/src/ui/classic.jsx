import { useState } from "react";
import { Link } from "react-router-dom";
import { pickImage, SAFE } from "./images";

// Image block: the given photo, else a relevant stock photo, else an initials tile. Never overlaps text.
export const Thumb = ({ src, name = "", hint = "", className = "cl-img" }) => {
  const [bad, setBad] = useState(false);
  const url = bad ? SAFE : src || pickImage(name, hint);
  return (
    <div className={className}>
      <img src={url} alt="" loading="lazy" onError={() => setBad(true)} />
    </div>
  );
};

export const Row = ({ img, name, hint, kicker, title, to, meta, desc, children }) => (
  <article className="cl-row">
    {to ? <Link to={to} aria-label={title}><Thumb src={img} name={name || title} hint={hint} /></Link> : <Thumb src={img} name={name || title} hint={hint} />}
    <div className="cl-body">
      {kicker && <p className="cl-kicker">{kicker}</p>}
      <h3>{to ? <Link to={to}>{title}</Link> : title}</h3>
      {meta && <p className="cl-meta">{meta}</p>}
      {desc && <p className="cl-desc">{desc}</p>}
    </div>
    <div className="cl-side">{children}</div>
  </article>
);
