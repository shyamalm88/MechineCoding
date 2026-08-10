document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.createElement('div');
  overlay.className = 'diagram-lightbox';
  var img = document.createElement('img');
  overlay.appendChild(img);
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
  function applyScale() { img.style.transform = 'scale(' + scale + ')'; }

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
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
    var target = e.target.closest('.excalidraw-diagram');
    if (target) { open(target.src, target.alt); return; }
    if (e.target === overlay || e.target === img) { close(); }
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
