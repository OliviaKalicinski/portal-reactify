import { forwardRef } from "react";

interface UnifiedCardProps {
  title: string;
  subtitle?: string;
  tag?: string;
  image?: string;
  bgColor: string;
  ratio?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const UnifiedCard = forwardRef<HTMLDivElement | HTMLAnchorElement, UnifiedCardProps>(
  ({ title, subtitle, tag, image, bgColor, ratio, href, onClick, className = "", children, style }, ref) => {
    const cardStyle: React.CSSProperties = {
      backgroundColor: bgColor,
      aspectRatio: ratio || "16/9",
      position: "relative",
      overflow: "hidden",
      borderRadius: 12,
      cursor: href || onClick ? "pointer" : undefined,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      ...style,
    };

    const titleLines = title.split("\n").map((line, i) => (
      <span key={i}>
        {i > 0 && <br />}
        {line}
      </span>
    ));

    const inner = (
      <>
        {image && (
          <img
            src={image}
            alt=""
            className="uc-img"
            loading="lazy"
            draggable={false}
          />
        )}
        <div className="uc-bar" style={{ backgroundColor: bgColor }}>
          {tag && <span className="uc-tag">{tag}</span>}
          <div className="uc-title">{titleLines}</div>
          {subtitle && <div className="uc-sub">{subtitle}</div>}
        </div>
        {children}
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`unified-card ${className}`}
          style={cardStyle}
        >
          {inner}
        </a>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={`unified-card ${className}`}
        style={cardStyle}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {inner}
      </div>
    );
  }
);

UnifiedCard.displayName = "UnifiedCard";

export default UnifiedCard;
export type { UnifiedCardProps };
