/* Detail views shown at clean, folder-style portfolio URLs.
   Example: /work/deep-sense/ */

(function renderCleanDetailRoute() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const route = pathParts[0];
  const slug = pathParts[1] || getParam("slug");
  if (!slug || !["work", "studio-baran", "art", "exhibitions"].includes(route)) return;

  const main = qs("main");
  if (!main) return;

  const notFound = () => {
    main.innerHTML = `<section><div class="wrap"><h1 class="display-lg">Project not found.</h1><p class="prose">Please return to the project index.</p></div></section>`;
  };

  if (route === "work") {
    const item = PROFESSIONAL_PROJECTS.find((project) => project.slug === slug);
    if (!item) return notFound();
    renderChrome("work/");
    document.title = item.title + " — Parisa Barani";
    main.innerHTML = `
      <div class="wrap detail-head">
        <a class="back" href="work/">← All work</a>
        <p class="identity-flag">Professional work — completed with ${escapeHtml(item.studio)}</p>
        <h1 class="display-lg" style="margin-top:1rem;">${escapeHtml(item.title)}</h1>
        ${metaRowHTML([
          ["Studio / Company", item.studio], ["Artist", item.artist], ["Role", item.role],
          ["Location", item.location], ["Year", item.year], ["Type", item.category],
        ])}
      </div>
      <section style="border-top:none; padding-top:0;"><div class="wrap"><div id="hero-plate" style="cursor:pointer;">${plateHTML({ src: item.heroImage, ratio: "hero", label: item.title + " — hero image" })}</div>${item.imageCredit ? `<p class="image-credit">${escapeHtml(item.imageCredit)}</p>` : ""}</div></section>
      ${item.concept ? `<section><div class="wrap" style="max-width:800px;"><p class="label" style="margin-bottom:1rem;">Concept</p><p class="prose">${escapeHtml(item.concept)}</p></div></section>` : ""}
      ${item.scope || (item.materials && item.materials.length) ? `<section><div class="wrap">
        ${item.scope ? `<p class="label" style="margin-bottom:1rem;">Contribution</p><p class="prose" style="max-width:800px;">${escapeHtml(item.scope)}</p>` : ""}
        ${item.projectUrl ? `<a class="project-link" href="${escapeHtml(item.projectUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.projectLinkLabel || "Official project reference")} ↗</a>` : ""}
        ${item.materials && item.materials.length ? `<div style="margin-top:2rem; display:flex; gap:2rem; flex-wrap:wrap;">${item.materials.map((material) => `<span class="meta" style="font-size:0.85rem; color:var(--stone); border-bottom:1px solid var(--hairline-strong); padding-bottom:2px;">${escapeHtml(material)}</span>`).join("")}</div>` : ""}
      </div></section>` : ""}
      ${item.drawings && item.drawings.length ? `<section><div class="wrap"><p class="label" style="margin-bottom:1.5rem;">Drawings &amp; plans</p><div class="thumb-grid" id="drawings-grid"></div></div></section>` : ""}
      ${item.images && item.images.length ? `<section><div class="wrap"><p class="label" style="margin-bottom:1.5rem;">Gallery</p><div class="thumb-grid" id="gallery-grid"></div></div></section>` : ""}`;
    qs("#hero-plate").addEventListener("click", () => Lightbox.open([{ src: item.heroImage, title: item.title, meta: item.location + " — " + item.year }], 0));
    if (item.drawings && item.drawings.length) buildLightboxGrid(qs("#drawings-grid"), item.drawings, () => "Drawing / plan — " + item.title);
    if (item.images && item.images.length) {
      buildLightboxGrid(
        qs("#gallery-grid"),
        item.images,
        (index) => item.title + " — view " + (index + 1),
        item.imageCaption ? () => item.imageCaption : null
      );
    }
    return;
  }

  if (route === "studio-baran") {
    const item = STUDIO_BARAN_PROJECTS.find((project) => project.slug === slug);
    if (!item) return notFound();
    renderChrome("studio-baran/");
    document.title = item.title + " — Studio Baran";
    main.innerHTML = `
      <div class="wrap detail-head">
        <a class="back" href="studio-baran/">← All Studio Baran projects</a>
        <p class="identity-flag">Studio Baran — independent practice</p>
        <h1 class="display-lg" style="margin-top:1rem;">${escapeHtml(item.title)}</h1>
        ${metaRowHTML([["Studio", "Studio Baran"], ["Role", item.role || "Founder / Designer"], ["Category", item.category], ["Location", item.location], ["Year", item.year]])}
        ${item.projectUrl ? `<a class="project-link" href="${escapeHtml(item.projectUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.projectLinkLabel || "Project reference")} ↗</a>` : ""}
      </div>
      <section style="border-top:none; padding-top:0;"><div class="wrap"><div id="hero-plate" style="cursor:pointer;">${plateHTML({ src: item.heroImage, ratio: "hero", label: item.title + " — hero image" })}</div>${item.heroCredit ? `<p class="image-credit">${escapeHtml(item.heroCredit)}</p>` : ""}</div></section>
      ${item.concept ? `<section><div class="wrap" style="max-width:800px;"><p class="label" style="margin-bottom:1rem;">Concept</p><p class="prose">${escapeHtml(item.concept)}</p></div></section>` : ""}
      ${item.process ? `<section><div class="wrap" style="max-width:800px;"><p class="label" style="margin-bottom:1rem;">Process</p><p class="prose">${escapeHtml(item.process)}</p></div></section>` : ""}
      ${item.processImages && item.processImages.length ? `<section><div class="wrap"><p class="label" style="margin-bottom:1.5rem;">Process &amp; material studies</p><div class="thumb-grid" id="process-grid"></div></div></section>` : ""}
      ${item.images && item.images.length ? `<section><div class="wrap"><p class="label" style="margin-bottom:1.5rem;">Result</p><div class="thumb-grid" id="result-grid"></div></div></section>` : ""}`;
    qs("#hero-plate").addEventListener("click", () => Lightbox.open([{ src: item.heroImage, title: item.title, meta: item.category + " — " + item.year }], 0));
    if (item.processImages && item.processImages.length) buildLightboxGrid(qs("#process-grid"), item.processImages, () => "Process study — " + item.title);
    if (item.images && item.images.length) buildLightboxGrid(qs("#result-grid"), item.images, (index) => item.title + " — view " + (index + 1));
    return;
  }

  if (route === "art") {
    const item = ARTWORKS.find((artwork) => artwork.slug === slug);
    if (!item) return notFound();
    renderChrome("art/");
    document.title = item.title + " — Art";
    main.innerHTML = `
      <div class="wrap" style="padding-top:clamp(2.5rem, 6vw, 4rem);"><a class="back" href="art/">← All art</a></div>
      <div class="wrap art-piece-meta" style="margin-top:2rem;"><h1>${escapeHtml(item.title)}</h1><p class="meta-line">${escapeHtml([item.year, item.medium, item.dimensions].filter(Boolean).join(" — "))}</p>${item.series ? `<p class="meta-line">Series: ${escapeHtml(item.series)}</p>` : ""}</div>
      <div class="wrap art-piece-plate"><div id="main-plate" style="cursor:pointer;">${plateHTML({ src: item.image, ratio: "landscape", label: item.title })}</div></div>
      ${item.detailImages && item.detailImages.length ? `<div class="wrap thumb-grid" id="detail-grid" style="margin-top:1.5rem; grid-template-columns:repeat(${Math.min(item.detailImages.length, 3)}, 1fr); max-width:900px; margin-left:auto; margin-right:auto;"></div>` : ""}
      ${item.description || (item.exhibitionHistory && item.exhibitionHistory.length) ? `<div class="wrap art-piece-text">${item.description ? `<p class="prose">${escapeHtml(item.description)}</p>` : ""}${item.exhibitionHistory && item.exhibitionHistory.length ? `<p class="label" style="margin-top:2rem; margin-bottom:0.75rem;">Exhibition history</p>${item.exhibitionHistory.map((history) => `<p class="prose" style="font-size:0.95rem;">${escapeHtml(history)}</p>`).join("")}` : ""}</div>` : ""}`;
    const galleryItems = [{ src: item.image, title: item.title, meta: item.medium + ", " + item.year }, ...(item.detailImages || []).map((src) => ({ src, title: item.title + " — detail", meta: item.medium + ", " + item.year }))];
    qs("#main-plate").addEventListener("click", () => Lightbox.open(galleryItems, 0));
    if (item.detailImages && item.detailImages.length) {
      const grid = qs("#detail-grid");
      grid.innerHTML = item.detailImages.map((src, index) => `<div class="thumb" data-index="${index}" tabindex="0" role="button" aria-label="View detail image ${index + 1}"><img src="${escapeHtml(src)}" alt="${escapeHtml(item.title)} — detail" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><div class="placeholder-note" style="display:none;">Detail — ${escapeHtml(item.title)}</div></div>`).join("");
      qsa(".thumb", grid).forEach((element) => { const openThis = () => Lightbox.open(galleryItems, Number(element.dataset.index) + 1); element.addEventListener("click", openThis); element.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openThis(); } }); });
    }
    return;
  }

  const item = EXHIBITIONS.find((exhibition) => exhibition.slug === slug);
  if (!item) return notFound();
  renderChrome("exhibitions/");
  document.title = item.title + " — Exhibitions";
  const relatedArt = (item.artworks || []).map((artworkSlug) => ARTWORKS.find((artwork) => artwork.slug === artworkSlug)).filter(Boolean);
  main.innerHTML = `
    <div class="wrap detail-head"><a class="back" href="exhibitions/">← All exhibitions</a><h1 class="display-lg" style="margin-top:1rem;">${escapeHtml(item.title)}</h1>${metaRowHTML([["Institution", item.institution], ["Location", item.location], ["Role", item.role], ["Year", item.year]])}</div>
    ${item.images.length ? `<section style="border-top:none; padding-top:0;"><div class="wrap"><div id="hero-plate" style="cursor:pointer;">${plateHTML({ src: item.images[0], ratio: "hero", label: item.title + " — installation view" })}</div></div></section>` : ""}
    <section><div class="wrap" style="max-width:800px;"><p class="label" style="margin-bottom:1rem;">About the exhibition</p><p class="prose">${escapeHtml(item.description)}</p></div></section>
    ${item.images.length > 1 ? `<section><div class="wrap"><p class="label" style="margin-bottom:1.5rem;">Installation views</p><div class="thumb-grid" id="views-grid"></div></div></section>` : ""}
    ${relatedArt.length ? `<section><div class="wrap"><p class="label" style="margin-bottom:1.5rem;">Works shown</p><div class="thumb-grid">${relatedArt.map((artwork) => thumbCardHTML({ href: "art/" + encodeURIComponent(artwork.slug) + "/", src: artwork.image, title: artwork.title, meta: artwork.year })).join("")}</div></div></section>` : ""}`;
  if (item.images.length) qs("#hero-plate").addEventListener("click", () => Lightbox.open(item.images.map((src, index) => ({ src, title: item.title, meta: index === 0 ? "Installation view" : "Installation view " + (index + 1) })), 0));
  if (item.images.length > 1) buildLightboxGrid(qs("#views-grid"), item.images.slice(1), (index) => item.title + " — installation view " + (index + 2));
}());
