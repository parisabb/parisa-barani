/* Shared rendering helpers used across every page. */

function qs(sel, root) { return (root || document).querySelector(sel); }
function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* Portfolio indexes use the final year in a date range, so newly completed
   projects always appear before earlier work. */
function newestFirst(items) {
  const finalYear = (item) => {
    const years = String(item.year || "").match(/\d{4}/g);
    return Number(years ? years[years.length - 1] : 0);
  };
  return [...items].sort((a, b) => finalYear(b) - finalYear(a));
}

function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

/* A deliberately quiet visual fallback for the portfolio while photography is
   being collected. It makes every image slot feel composed rather than broken,
   and is replaced automatically as soon as the referenced image is present. */
function visualVariant(value) {
  let hash = 0;
  for (let i = 0; i < String(value).length; i += 1) {
    hash = ((hash << 5) - hash) + String(value).charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 6;
}

function visualFallback(label, source, compact) {
  return `<div class="placeholder-note project-visual visual-${visualVariant(source || label)}${compact ? " visual-compact" : ""}" style="display:${source ? "none" : "flex"};"><span>${escapeHtml(label || "Untitled work")}</span></div>`;
}

/* ————————————————————————————————————————————
   Navigation + footer
   ———————————————————————————————————————————— */

const NAV_LINKS = [
  { href: "work.html", label: "Work" },
  { href: "studio-baran.html", label: "Studio Baran" },
  { href: "exhibitions.html", label: "Exhibitions" },
  { href: "art.html", label: "Art" },
  { href: "about.html", label: "About" },
  { href: "contact.html", label: "Contact" },
];

function renderChrome(activeHref) {
  const header = qs("#site-header");
  if (header) {
    header.innerHTML = `
      <div class="wrap">
        <a class="mark" href="index.html">${SITE.studio}</a>
        <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
        <nav class="site-nav" id="site-nav">
          ${NAV_LINKS.map((l) => `<a href="${l.href}" ${l.href === activeHref ? 'aria-current="page"' : ""}>${l.label}</a>`).join("")}
        </nav>
      </div>`;
    const toggle = qs("#nav-toggle");
    const nav = qs("#site-nav");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  const footer = qs("#site-footer");
  if (footer) {
    footer.innerHTML = `
      <div class="wrap">
        <span>${SITE.name} — ${SITE.studio}, ${SITE.location}</span>
        <span><a href="mailto:${SITE.email}">${SITE.email}</a></span>
        <span><a href="contact.html">Contact</a></span>
      </div>`;
  }
}

/* ————————————————————————————————————————————
   Image placeholder ("plate")
   A real <img> is attempted; if it fails to load (because the
   placeholder path has no file yet), a labelled note is shown
   instead so the layout still reads correctly.
   ———————————————————————————————————————————— */

function plateHTML({ src, ratio = "landscape", label = "", hoverable = false, priority = false }) {
  const cls = `plate ratio-${ratio}${hoverable ? " hoverable" : ""}`;
  const note = escapeHtml(label || "Image placeholder");
  return `
    <div class="${cls}">
      ${src ? `<img src="${escapeHtml(src)}" alt="${note}" loading="${priority ? "eager" : "lazy"}"${priority ? " fetchpriority=\"high\"" : ""}
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ""}
      ${visualFallback(label || "Image placeholder", src)}
    </div>`;
}

/* ————————————————————————————————————————————
   Editorial index list with a square inline thumbnail
   ———————————————————————————————————————————— */

function buildIndexList(container, items, opts) {
  const { baseHref, metaFn } = opts;
  container.innerHTML = `
    <div class="index-list">
      ${items.map((item) => `
        <a class="index-row" href="${baseHref}?slug=${encodeURIComponent(item.slug)}">
          <div class="thumb thumb-sm">
            ${(item.heroImage || (item.images && item.images[0])) ? `<img src="${escapeHtml(item.heroImage || (item.images && item.images[0]))}" alt="" loading="lazy"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ""}
            ${visualFallback(item.title || "Image", item.heroImage || (item.images && item.images[0]), true)}
          </div>
          <span class="title">${escapeHtml(item.title)}</span>
          ${metaFn(item).filter(Boolean).map((m) => `<span class="meta">${escapeHtml(m)}</span>`).join("")}
        </a>
      `).join("")}
    </div>`;
}

/* ————————————————————————————————————————————
   Square thumbnail card — links to a detail page.
   Used everywhere a collection of projects/artworks is browsed.
   ———————————————————————————————————————————— */

function thumbCardHTML({ href, src, title, meta, imageClass = "", status = "" }) {
  const note = escapeHtml(title || "Image placeholder");
  const statusClass = status === "available" ? "is-available" : "is-sold";
  const statusLabel = status === "available" ? "Available" : "Sold";
  return `
    <a class="thumb-card" href="${escapeHtml(href)}">
      <div class="thumb">
        ${src ? `<img class="${escapeHtml(imageClass)}" src="${escapeHtml(src)}" alt="${note}" loading="lazy"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ""}
        ${visualFallback(title || "Image placeholder", src)}
        ${status ? `<span class="art-status-dot ${statusClass}" role="img" aria-label="${statusLabel}" title="${statusLabel}"></span>` : ""}
      </div>
      <div class="thumb-card-copy">
        <span>${escapeHtml(title || "Untitled")}</span>
        ${meta ? `<span>${escapeHtml(meta)}</span>` : ""}
      </div>
    </a>`;
}

/* ————————————————————————————————————————————
   Lightbox — full, uncropped image viewer with prev/next,
   keyboard and swipe navigation. One instance shared site-wide.
   ———————————————————————————————————————————— */

const Lightbox = (function () {
  let items = [];
  let index = 0;
  let root = null;
  let touchX = null;

  function ensureRoot() {
    if (root) return root;
    root = document.createElement("div");
    root.className = "lightbox";
    root.innerHTML = `
      <button class="lightbox-btn lightbox-close" aria-label="Close">Close</button>
      <button class="lightbox-btn lightbox-prev" aria-label="Previous image">‹</button>
      <button class="lightbox-btn lightbox-next" aria-label="Next image">›</button>
      <div class="lightbox-stage">
        <img class="lightbox-img" alt="">
        <div class="lightbox-caption"></div>
      </div>`;
    document.body.appendChild(root);

    qs(".lightbox-close", root).addEventListener("click", close);
    qs(".lightbox-prev", root).addEventListener("click", (e) => { e.stopPropagation(); show(index - 1); });
    qs(".lightbox-next", root).addEventListener("click", (e) => { e.stopPropagation(); show(index + 1); });
    root.addEventListener("click", (e) => { if (e.target === root) close(); });

    document.addEventListener("keydown", (e) => {
      if (!root.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });

    root.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (dx > 50) show(index - 1);
      if (dx < -50) show(index + 1);
      touchX = null;
    });

    return root;
  }

  function show(i) {
    index = ((i % items.length) + items.length) % items.length;
    const item = items[index];
    const img = qs(".lightbox-img", root);
    const cap = qs(".lightbox-caption", root);
    img.classList.remove("loaded");
    img.onload = () => img.classList.add("loaded");
    img.src = item.src;
    img.alt = item.title || "";
    cap.innerHTML = item.title
      ? `<span class="lightbox-title">${escapeHtml(item.title)}</span>${item.meta ? `<span class="lightbox-meta">${escapeHtml(item.meta)}</span>` : ""}`
      : "";
    const multi = items.length > 1;
    qs(".lightbox-prev", root).style.display = multi ? "block" : "none";
    qs(".lightbox-next", root).style.display = multi ? "block" : "none";
  }

  function open(list, startIndex) {
    ensureRoot();
    items = list;
    show(startIndex || 0);
    root.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    if (!root) return;
    root.classList.remove("open");
    document.body.style.overflow = "";
  }

  return { open, close };
})();

/* Renders a square thumbnail grid whose items open the lightbox
   (rather than linking elsewhere) — used for galleries within a
   single project, exhibition or artwork page. */
function buildLightboxGrid(container, images, labelFn) {
  const items = images.map((src, i) => ({ src, title: labelFn ? labelFn(i) : "" }));
  container.innerHTML = images.map((src, i) => `
    <div class="thumb" data-index="${i}" tabindex="0" role="button" aria-label="View image ${i + 1} of ${images.length}">
      <img src="${escapeHtml(src)}" alt="${escapeHtml(labelFn ? labelFn(i) : "")}" loading="lazy"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      ${visualFallback(labelFn ? labelFn(i) : "Image placeholder", src)}
    </div>
  `).join("");

  qsa(".thumb", container).forEach((el) => {
    const openThis = () => Lightbox.open(items, Number(el.dataset.index));
    el.addEventListener("click", openThis);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openThis(); }
    });
  });
}

/* ————————————————————————————————————————————
   Detail meta row builder
   ———————————————————————————————————————————— */

function metaRowHTML(pairs) {
  return `
    <div class="detail-meta-row">
      ${pairs.filter((p) => p[1]).map((p) => `<div><span class="k">${escapeHtml(p[0])}</span>${escapeHtml(p[1])}</div>`).join("")}
    </div>`;
}

/* ————————————————————————————————————————————
   Not-found guard for detail pages
   ———————————————————————————————————————————— */

function requireItem(item, container) {
  if (!item) {
    container.innerHTML = `
      <div class="wrap detail-head">
        <a class="back" href="javascript:history.back()">← Back</a>
        <h1 class="display-md" style="margin-top:1.5rem;">This page could not be found.</h1>
      </div>`;
    return false;
  }
  return true;
}
