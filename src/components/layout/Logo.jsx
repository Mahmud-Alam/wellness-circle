export default function Logo({ size = 32, showWordmark = true, onClick }) {
  const markSize = size;

  return (
    <div className="logo" onClick={onClick}>
      <div
        className="logo__mark"
        style={{ width: markSize, height: markSize }}
        aria-hidden="true"
      >
        <svg
          width={markSize * 0.66}
          height={markSize * 0.66}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" fill="white" fillOpacity="0.35" />
          <circle cx="12" cy="12" r="1.5" fill="white" />
        </svg>
      </div>
      {showWordmark && (
        <span className="logo__wordmark" style={{ fontSize: markSize * 0.5 }}>
          Wellness<span>Circle</span>
        </span>
      )}
    </div>
  );
}
