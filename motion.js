(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const art = document.querySelector('.hero-art');
  const image = art.querySelector('img');
  let pending = false;
  function paint() {
    pending = false;
    if (reduced.matches) { image.style.transform = ''; return; }
    const rect = art.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const progress = Math.min(1, Math.max(0, (innerHeight - rect.top) / (innerHeight + rect.height)));
    image.style.transform = `translateY(${(progress - .5) * 26}px) scale(${1.075 - progress * .045})`;
  }
  const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(paint); } };
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  reduced.addEventListener('change', () => { document.getAnimations().forEach(a => a.cancel()); schedule(); });
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (!reduced.matches) {
      if (entry.target.matches('.project-visual')) {
        entry.target.querySelectorAll('.flow-row span,.fake-row').forEach((el,i) => el.animate([{opacity:.3,transform:'translateX(-10px)'},{opacity:1,transform:'translateX(0)'}],{duration:420,delay:i*65,easing:'cubic-bezier(.16,1,.3,1)'}));
      } else entry.target.animate([{opacity:.4,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.16,1,.3,1)'});
    }
    reveal.unobserve(entry.target);
  }), {threshold:.15});
  document.querySelectorAll('.project-visual,.about-grid,.contact h2').forEach(el=>reveal.observe(el));
  schedule();
})();
