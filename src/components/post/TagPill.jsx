import { Link } from "react-router-dom";

export default function TagPill({ tag }) {
  const name = typeof tag === "string" ? tag : tag?.name;
  const slug = typeof tag === "string" ? tag.toLowerCase().replace(/\s+/g, "-") : tag?.slug;

  return <Link className="tag-pill" to={`/tag/${slug}`}>{name}</Link>;
}