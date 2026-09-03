import { categoryStyles, fallbackCategoryStyle } from "../../data/constants";

export default function CategoryBadge({ label }) {
  const style = categoryStyles[label] ?? fallbackCategoryStyle;
  return (
    <span
      className="badge"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {label}
    </span>
  );
}
