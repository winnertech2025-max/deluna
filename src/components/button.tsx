import Link from "next/link";
import { clsx } from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary: "bg-ink text-white hover:bg-cocoa",
  secondary: "border border-ink/15 bg-white text-ink hover:border-ink/40",
  gold: "bg-champagne text-ink hover:bg-[#ff6b00]",
  ghost: "text-ink hover:bg-black/5"
};

type BaseProps = {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkButtonProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button({ children, variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({ children, variant = "primary", className, href, ...props }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
