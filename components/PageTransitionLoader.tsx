'use client';

export function PageTransitionLoader() {
  return (
    <div
      id="page-loader"
      className="fixed inset-0 z-999 bg-white transition-opacity duration-300 visible"
    >
    </div>
  );
}