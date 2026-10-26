import { Link } from "react-router";
import usePageMetadata from "../../hooks/usePageMetadata";
import "./Notfound.css";

export default function Notfound() {
  usePageMetadata(
    "Page Not Found — Mustafa Portfolio",
    "The page you requested could not be found.",
    false,
  );

  return (
    <main className="not-found-page">
      <p className="not-found-eyebrow">404 — PAGE NOT FOUND</p>
      <h1>Somewhere off the map.</h1>
      <p>The page may have moved, or the link may be out of date.</p>
      <Link to="/">Return to the portfolio</Link>
    </main>
  );
}
