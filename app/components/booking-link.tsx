"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { bookingHref, type Locale } from "../content";

type BookingLinkProps = {
  locale: Locale;
  className?: string;
  children: ReactNode;
};

export function BookingLink({ locale, className, children }: BookingLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.currentTarget.closest("details")?.removeAttribute("open");
  }

  return (
    <Link href={bookingHref(locale)} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
