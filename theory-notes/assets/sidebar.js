(function () {
  var mount = document.getElementById('sidebar');
  if (!mount) return;

  var script = document.currentScript;
  var navUrl = new URL('nav.json', script.src).href;
  var siteRoot = new URL('..', script.src).href;
  var current = location.origin + location.pathname;

  fetch(navUrl)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var brand = document.createElement('h2');
      brand.className = 'brand';
      brand.textContent = data.title;
      mount.appendChild(brand);

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
    });
})();
