import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

const footerLinks = [
  { label: "Catalogue", to: "/", hash: "catalogue" },
  { label: "Foundries", to: "/foundries", hash: undefined },
  { label: "Method", to: "/method", hash: undefined },
  { label: "Licensing", to: "/licensing", hash: undefined },
] as const;

const footerImages = [
  {
    src: "https://images.unsplash.com/photo-1667327484119-9f87d0644e48?auto=format&fit=crop&fm=jpg&q=86&w=2400",
    alt: "Friends spending a day by the sea",
  },
  {
    src: "https://images.unsplash.com/photo-1771079257233-e0325432763d?auto=format&fit=crop&fm=jpg&q=86&w=2400",
    alt: "Sunlight crossing a patterned modern structure",
  },
  {
    src: "https://images.unsplash.com/photo-1754444551497-441b8437af04?auto=format&fit=crop&fm=jpg&q=86&w=2400",
    alt: "City architecture illuminated by sunlight",
  },
  {
    src: "https://images.unsplash.com/photo-1770318364085-c9678580ef82?auto=format&fit=crop&fm=jpg&q=86&w=2400",
    alt: "Geometric building facade beneath a blue sky",
  },
  {
    src: "https://images.unsplash.com/photo-1653930813790-a738d53f0891?auto=format&fit=crop&fm=jpg&q=86&w=2400",
    alt: "Architectural shadows crossing a quiet interior",
  },
  {
    src: "https://images.unsplash.com/photo-1774388263540-8e5c58fbaddb?auto=format&fit=crop&fm=jpg&q=86&w=2400",
    alt: "Photographic film rolls in warm natural light",
  },
] as const;

function getDailyFooterImage(date: Date) {
  const localDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const dayNumber = Math.floor(localDay / 86_400_000);
  return footerImages[dayNumber % footerImages.length];
}

export function Footer() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const dailyImage = getDailyFooterImage(today);

  return (
    <footer className="tm-site-footer" aria-label="Site footer">
      <img
        className="tm-site-footer-image"
        src={dailyImage.src}
        alt={dailyImage.alt}
        loading="lazy"
        decoding="async"
      />
      <div className="tm-site-footer-shade" aria-hidden="true" />
      <div className="tm-site-footer-grain" aria-hidden="true" />

      <div className="tm-site-footer-inner">
        <div className="tm-site-footer-topline">
          <span>Type pairing with design logic</span>
          <span>Independent typography catalogue</span>
        </div>

        <div className="tm-site-footer-main">
          <div>
            <p className="tm-site-footer-kicker">Make type choices with intention.</p>
            <Link
              to="/"
              hash="catalogue"
              className="tm-site-footer-title"
              aria-label="Explore the TypeMatch catalogue"
            >
              <span>TypeMatch</span>
              <span className="tm-site-footer-title-studio">Studio</span>
            </Link>
          </div>

          <nav className="tm-site-footer-nav" aria-label="Footer navigation">
            <span className="tm-site-footer-label">Explore</span>
            {footerLinks.map((link) => (
              <Link key={link.label} to={link.to} hash={link.hash} className="tm-site-footer-link">
                {link.label}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="tm-site-footer-bottom">
          <span>© {currentYear} TypeMatch Studio</span>
          <span>Analysis · Pairing · Criteria</span>
        </div>
      </div>
    </footer>
  );
}
