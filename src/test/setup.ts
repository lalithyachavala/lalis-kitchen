import "@testing-library/jest-dom/vitest";

// Minimal IntersectionObserver mock for jsdom
if (typeof (globalThis as any).IntersectionObserver === "undefined") {
  class MockIntersectionObserver {
    constructor(
      _cb: IntersectionObserverCallback,
      _options?: IntersectionObserverInit
    ) {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] { return []; }
    root: Element | Document | null = null;
    rootMargin = "0px";
    thresholds = [0];
  }
  (globalThis as any).IntersectionObserver = MockIntersectionObserver as any;
}
