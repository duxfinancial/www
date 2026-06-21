/* menu.js — robust trigger/dropdown logic */
(function(){
  function setup(anchor){
    const trigger = anchor.querySelector('.md3-trigger');
    const dropdown = anchor.querySelector('.md3-dropdown');
    const arrow    = anchor.querySelector('.md3-trigger .arrow');
    const items    = anchor.querySelectorAll('.md3-menu-item');

    if(!trigger || !dropdown) return;

    // ARIA
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    dropdown.setAttribute('role','menu');
    trigger.setAttribute('role','button');

    // Toggle open/close
    function open(){
      anchor.classList.add('open');
      trigger.setAttribute('aria-expanded','true');
      if(arrow && arrow.dataset.iconAlt){
        // optional swap if using text icons
        const cur = arrow.textContent.trim();
        arrow.textContent = arrow.dataset.iconAlt;
        arrow.dataset.iconAlt = cur;
      }
      // focus first item for accessibility
      const firstItem = dropdown.querySelector('.md3-menu-item');
      if(firstItem) firstItem.tabIndex = 0;
    }

    function close(){
      anchor.classList.remove('open');
      trigger.setAttribute('aria-expanded','false');
      // swap back icon if needed
      if(arrow && arrow.dataset.iconDefault){
        arrow.textContent = arrow.dataset.iconDefault;
      }
    }

    function toggle(e){
      e.stopPropagation();
      // Add ripple effect
      trigger.classList.add('active');
      setTimeout(()=>trigger.classList.remove('active'), 400);
      
      if(anchor.classList.contains('open')){ close(); }
      else { open(); }
    }

    trigger.addEventListener('click', toggle);

    // Clicking arrow specifically closes if open
    if(arrow){
      // Store default/alt contents for icon fonts
      if(!arrow.dataset.iconDefault) arrow.dataset.iconDefault = arrow.textContent.trim();
      if(!arrow.dataset.iconAlt) arrow.dataset.iconAlt = 'expand_less';
      arrow.addEventListener('click', function(e){
        e.stopPropagation();
        // Add ripple effect
        trigger.classList.add('active');
        setTimeout(()=>trigger.classList.remove('active'), 400);
        
        if(anchor.classList.contains('open')) close();
        else open();
      });
    }

    // Outside click
    document.addEventListener('click', (e)=>{
      if(!anchor.contains(e.target)) close();
    });

    // Keyboard: Esc closes; ArrowDown focuses first item
    trigger.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape'){ close(); trigger.blur(); }
      if(e.key === 'ArrowDown'){
        const first = dropdown.querySelector('.md3-menu-item');
        if(first){ e.preventDefault(); open(); first.focus(); }
      }
    });

    // Items: ripple + Enter closes
    items.forEach(it=>{
      it.addEventListener('click', (e)=>{
        it.classList.add('active');
        setTimeout(()=>it.classList.remove('active'), 400);
        close();
      });
      it.addEventListener('keydown', (e)=>{
        if(e.key==='Escape'){ e.preventDefault(); close(); trigger.focus(); }
        if(e.key==='ArrowDown'){
          e.preventDefault();
          const next = it.nextElementSibling && it.nextElementSibling.classList.contains('md3-menu-item') ? it.nextElementSibling : null;
          if(next) next.focus();
        }
        if(e.key==='ArrowUp'){
          e.preventDefault();
          const prev = it.previousElementSibling && it.previousElementSibling.classList.contains('md3-menu-item') ? it.previousElementSibling : null;
          if(prev) prev.focus();
          else trigger.focus();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.md3-menu-anchor').forEach(setup);
  });
})();

/* =========================================================
   Landing page detection + trigger color sync
   TEMP FIX: adds body.landing if breadcrumbs are hidden
   ========================================================= */
(function () {
  const ANCHOR_SEL = '#user-profile-element';
  const BREADCRUMBS_SEL = '#motion-breadcrumbs';

  function applyState() {
    const breadcrumbs = document.querySelector(BREADCRUMBS_SEL);
    if (!breadcrumbs) return;

    const isLanding =
      window.getComputedStyle(breadcrumbs).display === 'none';

    // 🔑 Page-level state
    document.body.classList.toggle('landing', isLanding);

    const anchor = document.querySelector(ANCHOR_SEL);
    if (!anchor) return;

    const color = isLanding ? '#fff' : '#000';

    const textEl = anchor.querySelector('.md3-trigger .text');
    const arrowEl = anchor.querySelector('.md3-trigger .arrow');

    if (textEl) textEl.style.color = color;
    if (arrowEl) arrowEl.style.color = color;
  }

  function observeBreadcrumbs() {
    const breadcrumbs = document.querySelector(BREADCRUMBS_SEL);
    if (!breadcrumbs) return false;

    const mo = new MutationObserver(applyState);
    mo.observe(breadcrumbs, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
    return true;
  }

  function init() {
    applyState();

    if (observeBreadcrumbs()) return;

    // Breadcrumbs injected later
    const tempObserver = new MutationObserver(() => {
      applyState();
      if (observeBreadcrumbs()) tempObserver.disconnect();
    });

    tempObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    requestAnimationFrame(applyState);
    window.addEventListener('load', applyState, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();