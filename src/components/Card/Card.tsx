import {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
} from "react";

export interface CardProps {
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
  className?: string;
  /**
   * When true, merges Card's styles into the single child element instead of
   * rendering a wrapper `<div>`. Use to render a Card as `<a>`, `<Link>`, or
   * any other element.
   */
  asChild?: boolean;
  /**
   * When true, adds a subtle hover lift effect
   * (`transition-all hover:shadow-card-hover hover:border-slate-300`).
   * Most useful for clickable cards.
   */
  hoverable?: boolean;
}

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-12",
};

export default function Card({
  children,
  padding = "md",
  className = "",
  asChild = false,
  hoverable = false,
}: CardProps) {
  const baseClasses = `rounded-2xl border border-slate-200/80 bg-white shadow-card ${paddingClasses[padding]}`;
  const hoverClasses = hoverable
    ? "transition-all hover:shadow-card-hover hover:border-slate-300"
    : "";
  const merged = `${baseClasses} ${hoverClasses} ${className}`
    .replace(/\s+/g, " ")
    .trim();

  if (asChild) {
    const child = Children.only(children);
    if (isValidElement<{ className?: string }>(child)) {
      const childClassName = child.props.className ?? "";
      return cloneElement(child as ReactElement<{ className?: string }>, {
        className: `${merged} ${childClassName}`.trim(),
      });
    }
  }

  return <div className={merged}>{children}</div>;
}
