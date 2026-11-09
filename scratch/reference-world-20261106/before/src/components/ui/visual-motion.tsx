"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { animate } from "framer-motion";

/** Presentation only. Real content changes drive motion; no simulated data or activity. */
export function VisualMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const animations = new Set<{ stop: () => void }>();
    const track = (animation: ReturnType<typeof animate>) => {
      animations.add(animation);
      animation.then(() => animations.delete(animation));
    };
    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || seen.has(entry.target)) continue;
        seen.add(entry.target);
        track(animate(entry.target, { opacity: [.35, 1], y: [14, 0] }, { duration: .5, ease: [.2,.7,.2,1] }));
        observer.unobserve(entry.target);
      }
    }, { threshold: .08 });
    document.querySelectorAll('.landing-page > section:not(#hero) > div').forEach(el => observer.observe(el));
    const values = new WeakMap<Element, string>();
    const consoleRoot = document.querySelector('.console-content');
    const updateValues = () => {
      consoleRoot?.querySelectorAll('.text-3xl, .economics-panel').forEach(el => {
        const value = el.textContent || '';
        const previous = values.get(el);
        if (previous !== undefined && previous !== value && !media.matches) {
          track(animate(el, { opacity: [.6, 1], y: [3, 0] }, { duration: .3 }));
        }
        values.set(el, value);
      });
    };
    updateValues();
    const mutations = new MutationObserver(updateValues);
    if (consoleRoot) mutations.observe(consoleRoot, { childList: true, subtree: true, characterData: true });
    const stop = () => { observer.disconnect(); mutations.disconnect(); animations.forEach(a => a.stop()); };
    const preferenceChanged = () => { if(media.matches) stop(); };
    media.addEventListener("change", preferenceChanged);
    return () => { stop(); media.removeEventListener("change", preferenceChanged); };
  }, [pathname]);
  return null;
}
