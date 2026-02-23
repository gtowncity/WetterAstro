// src/components/IosGrid.tsx
import type { PropsWithChildren } from "react";

export default function IosGrid(props: PropsWithChildren<{ className?: string }>) {
  const { className = "", children } = props;

  return (
    <section className={`grid grid-cols-2 gap-3.5 auto-rows-fr ${className}`}>
      {children}
    </section>
  );
}