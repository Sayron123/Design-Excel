// Shared button look, so every action reads as a button rather than plain text.

type Variant = "primary" | "accent" | "secondary" | "soft" | "light" | "glass";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-ink",
  // The logo's orange, kept for the one action every page asks for: Inquire now.
  accent: "bg-accent text-ink hover:bg-ink hover:text-white",
  secondary: "bg-border text-ink hover:bg-ink hover:text-white",
  soft: "bg-primary/10 text-primary hover:bg-accent hover:text-ink",
  light: "bg-white text-primary hover:bg-bg",
  glass: "bg-white/10 text-white ring-1 ring-inset ring-white/35 hover:bg-white/20",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[14px]",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className={className}>
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowLeft({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className={className}>
      <path d="M13 8H3M7 4L3 8l4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className={className}>
      <path
        d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"
        fill="currentColor"
      />
    </svg>
  );
}
