(function () {
  var mount = document.getElementById('sidebar');
  if (!mount) return;

  var script = document.currentScript;
  var navUrl = new URL('nav.json', script.src).href;
  var siteRoot = new URL('..', script.src).href;
  var current = location.origin + location.pathname;

  // ---- revision tracking -------------------------------------------------
  // Two checkboxes per note, so a second pass weeks later is recorded apart
  // from the first. Keyed by site title, so Theory / System Design / Java each
  // keep their own progress. localStorage is the only option: these are static
  // pages with no backend.
  var PASSES = 2;
  var storeKey;

  function readProgress() {
    try {
      var raw = localStorage.getItem(storeKey);
      var parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (e) { return {}; }
  }

  function writeProgress(value) {
    try { localStorage.setItem(storeKey, JSON.stringify(value)); } catch (e) {}
  }

  var progress = {};
  var allSlugs = [];

  function summarise() {
    var done = 0, ticks = 0;
    allSlugs.forEach(function (slug) {
      var marks = progress[slug] || [];
      var n = 0;
      for (var i = 0; i < PASSES; i++) if (marks[i]) n++;
      ticks += n;
      if (n === PASSES) done++;
    });
    return {
      done: done,
      total: allSlugs.length,
      ticks: ticks,
      totalTicks: allSlugs.length * PASSES,
      percent: allSlugs.length ? Math.round((done / allSlugs.length) * 100) : 0
    };
  }

  var ringValue, ringText, ringCaption, ringTicks;
  var RADIUS = 22, CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  function renderRing() {
    var s = summarise();
    ringValue.setAttribute('stroke-dashoffset', CIRCUMFERENCE * (1 - s.percent / 100));
    ringText.textContent = s.percent + '%';
    ringCaption.textContent = s.done + '/' + s.total + ' revised';
    ringTicks.textContent = s.ticks + '/' + s.totalTicks + ' boxes';
  }

  function buildRing() {
    var wrap = document.createElement('div');
    wrap.className = 'progress-ring';
    wrap.innerHTML =
      '<svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">' +
      '<circle class="ring-track" cx="28" cy="28" r="' + RADIUS + '"></circle>' +
      '<circle class="ring-value" cx="28" cy="28" r="' + RADIUS + '" ' +
      'stroke-dasharray="' + CIRCUMFERENCE + '" stroke-dashoffset="' + CIRCUMFERENCE + '"></circle>' +
      '<text class="ring-text" x="28" y="28" text-anchor="middle" dominant-baseline="central">0%</text>' +
      '</svg><div class="progress-caption"><strong></strong><span class="progress-ticks"></span></div>';
    ringValue = wrap.querySelector('.ring-value');
    ringText = wrap.querySelector('.ring-text');
    ringCaption = wrap.querySelector('.progress-caption strong');
    ringTicks = wrap.querySelector('.progress-ticks');
    return wrap;
  }

  function buildBoxes(slug, label, li) {
    var holder = document.createElement('span');
    holder.className = 'revisions';

    for (var pass = 0; pass < PASSES; pass++) {
      (function (index) {
        var box = document.createElement('input');
        box.type = 'checkbox';
        box.className = 'revision-box';
        box.checked = Boolean((progress[slug] || [])[index]);
        box.title = 'Revision ' + (index + 1);
        box.setAttribute('aria-label', label + ': revision pass ' + (index + 1));
        box.addEventListener('change', function () {
          var marks = (progress[slug] || []).slice();
          for (var i = 0; i < PASSES; i++) marks[i] = Boolean(marks[i]);
          marks[index] = box.checked;

          // Drop entries that fall back to nothing ticked, so the stored map
          // stays small and clearing a note leaves no residue.
          var any = false;
          for (var j = 0; j < PASSES; j++) if (marks[j]) any = true;
          if (any) progress[slug] = marks; else delete progress[slug];

          writeProgress(progress);
          var complete = true;
          for (var k = 0; k < PASSES; k++) if (!marks[k]) complete = false;
          li.classList.toggle('done', any && complete);
          renderRing();
        });
        holder.appendChild(box);
      })(pass);
    }
    return holder;
  }

  // ---- drag-to-resize ----------------------------------------------------
  // Listeners live on window, not the 6px handle, so a fast drag does not
  // "fall off" the target. Arrow keys work too, since a mouse-only control
  // locks keyboard users out of a layout choice.
  var MIN_WIDTH = 200, MAX_WIDTH = 560, DEFAULT_WIDTH = 260;
  var WIDTH_KEY = 'sidebar-width:notes';

  function clampWidth(value) {
    var n = Number(value);
    if (!isFinite(n)) return DEFAULT_WIDTH;
    return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(n)));
  }

  function applyWidth(value) {
    var width = clampWidth(value);
    mount.style.width = width + 'px';
    try { localStorage.setItem(WIDTH_KEY, String(width)); } catch (e) {}
    return width;
  }

  function buildResizer() {
    var stored;
    try { stored = localStorage.getItem(WIDTH_KEY); } catch (e) { stored = null; }
    var width = stored === null ? DEFAULT_WIDTH : clampWidth(stored);
    mount.style.width = width + 'px';

    var handle = document.createElement('div');
    handle.className = 'sidebar-resizer';
    handle.setAttribute('role', 'separator');
    handle.setAttribute('aria-orientation', 'vertical');
    handle.setAttribute('aria-label', 'Resize sidebar');
    handle.tabIndex = 0;
    handle.title = 'Drag to resize — double-click to reset';

    function setWidth(value) {
      var applied = applyWidth(value);
      handle.setAttribute('aria-valuenow', applied);
    }
    setWidth(width);

    function onMove(event) { setWidth(event.clientX); }
    function onUp() {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      handle.classList.remove('dragging');
    }

    handle.addEventListener('mousedown', function (event) {
      event.preventDefault();
      handle.classList.add('dragging');
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });

    handle.addEventListener('dblclick', function () { setWidth(DEFAULT_WIDTH); });

    handle.addEventListener('keydown', function (event) {
      var step = event.shiftKey ? 40 : 10;
      var current = mount.getBoundingClientRect().width;
      if (event.key === 'ArrowLeft') { event.preventDefault(); setWidth(current - step); }
      else if (event.key === 'ArrowRight') { event.preventDefault(); setWidth(current + step); }
      else if (event.key === 'Home') { event.preventDefault(); setWidth(MIN_WIDTH); }
      else if (event.key === 'End') { event.preventDefault(); setWidth(MAX_WIDTH); }
    });

    handle.setAttribute('aria-valuemin', MIN_WIDTH);
    handle.setAttribute('aria-valuemax', MAX_WIDTH);
    if (mount.parentNode) mount.parentNode.insertBefore(handle, mount.nextSibling);
  }

  buildResizer();

  fetch(navUrl)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var brand = document.createElement('h2');
      brand.className = 'brand';
      brand.textContent = data.title;
      mount.appendChild(brand);

      storeKey = 'revision:' + (data.title || 'notes');
      progress = readProgress();
      data.groups.forEach(function (group) {
        group.items.forEach(function (item) { allSlugs.push(item.slug); });
      });
      mount.appendChild(buildRing());

      data.groups.forEach(function (group) {
        var ul = document.createElement('ul');

        group.items.forEach(function (item) {
          var href = siteRoot + 'notes/' + item.slug + '.html';

          var a = document.createElement('a');
          a.href = href;
          a.textContent = item.label;
          if (href === current) a.setAttribute('aria-current', 'page');

          if (item.stars > 0) {
            var star = document.createElement('span');
            star.className = 'stars';
            star.title = 'Priority: ' + item.stars + '/3';
            star.textContent = '★'.repeat(item.stars);
            a.appendChild(star);
          }

          var li = document.createElement('li');
          li.className = 'note-row';

          var marks = progress[item.slug] || [];
          var complete = true;
          for (var m = 0; m < PASSES; m++) if (!marks[m]) complete = false;
          if (complete) li.classList.add('done');

          li.appendChild(buildBoxes(item.slug, item.label, li));
          li.appendChild(a);
          ul.appendChild(li);
        });

        if (group.category) {
          var details = document.createElement('details');
          details.open = true;
          var summary = document.createElement('summary');
          summary.textContent = group.category;
          details.appendChild(summary);
          details.appendChild(ul);
          mount.appendChild(details);
        } else {
          mount.appendChild(ul);
        }
      });

      renderRing();
    });
})();
