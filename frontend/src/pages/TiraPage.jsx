import { useEffect, useRef, useState } from "react";
import { products, navLinks } from "../data/products";
import "./TiraPage.css";

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke="#333"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="#333" strokeWidth="2" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="#888" strokeWidth="2" />
    <path d="M21 21l-4.35-4.35" stroke="#888" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function TiraPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const [popupIndex, setPopupIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const searchWrapRef = useRef(null);
  const touchStartX = useRef(0);

  // close search results on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setSearchResultsOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ESC closes popup
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setPopupIndex(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // lock body scroll when popup or menu open
  useEffect(() => {
    if (popupIndex !== null || menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [popupIndex, menuOpen]);

  const openPopup = (index) => {
    setCurrentSlide(0);
    setPopupIndex(index);
  };
  const closePopup = () => setPopupIndex(null);

  const slideMove = (dir) => {
    if (popupIndex === null) return;
    const total = products[popupIndex].images.length;
    setCurrentSlide((prev) => (prev + dir + total) % total);
  };

  const q = searchQuery.trim().toLowerCase();
  const matchedNav = q ? navLinks.filter((n) => n.name.toLowerCase().includes(q)) : [];
  const matchedProducts = q
    ? products
        .map((p, i) => ({ ...p, index: i }))
        .filter((p) => p.title.toLowerCase().includes(q))
        .slice(0, 5)
    : [];
  const noResults = q && matchedNav.length === 0 && matchedProducts.length === 0;

  const popup = popupIndex !== null ? products[popupIndex] : null;
  const totalSlides = popup ? popup.images.length : 0;

  return (
    <div className="tira-page">
      {/* Navbar */}
      <div className="navbar">
        <button
          className="menu-icon"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          &#9776;
        </button>
        <div className="brand-logo">
          TIRA<span>.</span>
        </div>
        <div className="search-wrap" ref={searchWrapRef}>
          <SearchIcon />
          <input
            className="search-input"
            type="text"
            placeholder="Search products, brands..."
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchResultsOpen(true);
            }}
            onFocus={() => setSearchResultsOpen(true)}
          />
          <div className={`search-results ${searchResultsOpen && q ? "open" : ""}`}>
            {noResults && (
              <div className="search-no-result">
                No results for &ldquo;{searchQuery}&rdquo;
              </div>
            )}
            {matchedNav.map((n) => (
              <a key={n.name} className="search-result-item" href={n.url}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f7f7f7",
                    borderRadius: 6,
                    flexShrink: 0,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#C8102E",
                  }}
                >
                  ↗
                </div>
                <div>
                  <div className="search-result-name">{n.name}</div>
                  <div className="search-result-price" style={{ color: "#888" }}>
                    Page
                  </div>
                </div>
              </a>
            ))}
            {matchedProducts.map((p) => (
              <div
                key={p.sku}
                className="search-result-item"
                onClick={() => {
                  openPopup(p.index);
                  setSearchResultsOpen(false);
                  setSearchQuery("");
                }}
              >
                <img src={p.images[0]} alt={p.title} />
                <div>
                  <div className="search-result-name">{p.title}</div>
                  <div className="search-result-price">{p.offer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side menu overlay */}
      <div
        className={`overlay ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(false)}
      />
      <div className={`side-menu ${menuOpen ? "open" : ""}`}>
        <button
          className="close-btn"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          &times;
        </button>
        {navLinks.map((n) => (
          <a key={n.name} href={n.url}>
            {n.name}
          </a>
        ))}
        <a href="#">Contact</a>
      </div>

      {/* Title */}
      <h1 className="page-title">Tira Beauty ✦</h1>
      <div className="page-subtitle">Shop curated beauty bestsellers</div>

      {/* Product grid */}
      <div className="product-grid">
        {products.map((p, i) => (
          <div key={p.sku} className="product-card">
            <button
              className="eye-btn"
              onClick={() => openPopup(i)}
              aria-label="Quick view"
            >
              <EyeIcon />
            </button>
            <img src={p.images[0]} alt={p.title} loading="lazy" />
            <h3>
              {p.title}
              <span className="price-tag">{p.offer}</span>
            </h3>
            <a
              href={p.link}
              className="buy-btn"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              Buy on Tira
            </a>
          </div>
        ))}
      </div>

      {/* Popup */}
      <div
        className={`popup-overlay ${popup ? "open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closePopup();
        }}
      >
        {popup && (
          <div className="popup-box">
            <button className="popup-close" onClick={closePopup}>
              &times;
            </button>
            <div className="slider-wrap">
              {popup.badge && <span className="new-badge">New Drop</span>}
              <div
                className="slides"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                onTouchStart={(e) => {
                  touchStartX.current = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  const diff = touchStartX.current - e.changedTouches[0].clientX;
                  if (Math.abs(diff) > 40) slideMove(diff > 0 ? 1 : -1);
                }}
              >
                {popup.images.map((src, idx) => (
                  <img key={idx} src={src} alt={popup.title} />
                ))}
              </div>
              {totalSlides > 1 && (
                <>
                  <button
                    className="slider-arrow prev"
                    onClick={() => slideMove(-1)}
                    aria-label="Previous"
                  >
                    &#8249;
                  </button>
                  <button
                    className="slider-arrow next"
                    onClick={() => slideMove(1)}
                    aria-label="Next"
                  >
                    &#8250;
                  </button>
                </>
              )}
              <div className="slider-dots">
                {popup.images.map((_, i) => (
                  <div
                    key={i}
                    className={`dot ${i === currentSlide ? "active" : ""}`}
                    onClick={() => setCurrentSlide(i)}
                  />
                ))}
              </div>
            </div>
            <div className="popup-details">
              <div className="sku">{popup.sku}</div>
              <h2>{popup.title}</h2>
              <div className="popup-stars">
                <span className="star-filled">{"★".repeat(popup.stars)}</span>
                <span className="star-empty">{"★".repeat(5 - popup.stars)}</span>
              </div>
              <div className="popup-price">
                <span className="offer">{popup.offer}</span>
                {popup.mrp && popup.mrp !== popup.offer && (
                  <span className="mrp">MRP {popup.mrp}</span>
                )}
                {popup.discount && (
                  <span className="discount">{popup.discount}</span>
                )}
              </div>
              <div className="popup-tax">(Inclusive of all taxes)</div>
              <div className="popup-desc">{popup.desc}</div>
              <div className="size-label">Size</div>
              <div className="size-box">{popup.size}</div>
              <a
                className="popup-buy-btn"
                href={popup.link}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                BUY ON TIRA
              </a>
            </div>
          </div>
        )}
      </div>

      <footer>
        <p>
          Disclaimer: <strong>GT</strong> is an affiliate of Tira Beauty.
          <br />
          We earn a small commission if you purchase through our links at no extra cost
          to you.
        </p>
        <p style={{ marginTop: 8 }}>&copy; 2026 Gabriella</p>
      </footer>
    </div>
  );
}
