import { useEffect } from 'react';

/**
 * Attaches an IntersectionObserver to all elements with [data-reveal]
 * inside the given root (or the document). When an element enters the
 * viewport, the `is-visible` class is added so its CSS animation plays.
 *
 * Also drives a parallax effect on elements with [data-parallax="<speed>"]
 * (e.g. data-parallax="0.2") via translateY based on scroll position.
 */
export function useScrollReveal(rootRef?: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const root = rootRef?.current ?? document;

    // Reveal-on-scroll
    const reveals = root.querySelectorAll<HTMLElement>('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    reveals.forEach((el) => io.observe(el));

    // Parallax
    const parallaxEls = Array.from(
      root.querySelectorAll<HTMLElement>('[data-parallax]')
    );
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        parallaxEls.forEach((el) => {
          const speed = parseFloat(el.dataset.parallax || '0.15');
          el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
        });
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Scroll progress bar
    const progressBar = document.getElementById('scroll-progress-bar');
    const onProgress = () => {
      if (!progressBar) return;
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, scrolled))})`;
    };
    window.addEventListener('scroll', onProgress, { passive: true });
    onProgress();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onProgress);
    };
  }, [rootRef]);
}
