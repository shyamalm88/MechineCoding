document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.createElement('div');
  overlay.className = 'diagram-lightbox';
  var content = document.createElement('div');
  content.className = 'diagram-lightbox-content';
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  var controls = document.createElement('div');
  controls.className = 'diagram-lightbox-controls';
  controls.innerHTML =
    '<button data-action="zoom-out" title="Zoom out">−</button>' +
    '<button data-action="reset" title="Reset zoom">Reset</button>' +
    '<button data-action="zoom-in" title="Zoom in">+</button>' +
    '<button data-action="fullscreen" title="Full screen">Full screen</button>' +
    '<button data-action="close" title="Close">Close (Esc)</button>';
  document.body.appendChild(controls);

  var scale = 1;
  function applyScale() {
    var el = content.firstElementChild;
    if (el) el.style.transform = 'scale(' + scale + ')';
  }

  // src is either an <img> src URL (Excalidraw diagrams) or an existing
  // rendered <svg> element (live mermaid.js diagrams, e.g. sequence
  // diagrams) -- the lightbox displays either kind the same way.
  function openWithImage(src, alt) {
    content.innerHTML = '';
    var img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    content.appendChild(img);
    openCommon();
  }

  function openWithSvg(svgEl) {
    content.innerHTML = '';
    var clone = svgEl.cloneNode(true);
    // mermaid.js bakes an inline style (e.g. max-width: 1163px) onto the
    // SVG to fit it inside its original in-page card. Cloned as-is, that
    // inline style outranks our CSS and stops the diagram from scaling up
    // to fill the lightbox. Strip it so our stylesheet rules apply.
    clone.removeAttribute('style');
    content.appendChild(clone);
    openCommon();
  }

  function openCommon() {
    scale = 1;
    applyScale();
    overlay.classList.add('open');
    controls.style.display = 'flex';
  }

  function close() {
    overlay.classList.remove('open');
    controls.style.display = 'none';
    if (document.fullscreenElement) document.exitFullscreen();
  }

  document.addEventListener('click', function (e) {
    var excalidrawImg = e.target.closest('.excalidraw-diagram');
    if (excalidrawImg) { openWithImage(excalidrawImg.src, excalidrawImg.alt); return; }

    var mermaidDiv = e.target.closest('.mermaid');
    if (mermaidDiv) {
      var svgEl = mermaidDiv.querySelector('svg');
      if (svgEl) { openWithSvg(svgEl); return; }
    }

    if (e.target === overlay || e.target.closest('.diagram-lightbox-content')) {
      close();
    }
  });

  controls.addEventListener('click', function (e) {
    var action = e.target.getAttribute('data-action');
    if (!action) return;
    if (action === 'zoom-in') { scale = Math.min(scale + 0.25, 6); applyScale(); }
    if (action === 'zoom-out') { scale = Math.max(scale - 0.25, 0.25); applyScale(); }
    if (action === 'reset') { scale = 1; applyScale(); }
    if (action === 'close') { close(); }
    if (action === 'fullscreen') {
      if (!document.fullscreenElement) { overlay.requestFullscreen(); }
      else { document.exitFullscreen(); }
    }
  });

  overlay.addEventListener('wheel', function (e) {
    if (!overlay.classList.contains('open')) return;
    e.preventDefault();
    scale = Math.min(Math.max(scale + (e.deltaY < 0 ? 0.15 : -0.15), 0.25), 6);
    applyScale();
  }, { passive: false });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
  });
});
