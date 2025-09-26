import { useEffect, useRef } from "react";

export function useInfiniteScroll(onHitBottom: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) onHitBottom();
    }, { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, [onHitBottom]);

  return ref;
}
