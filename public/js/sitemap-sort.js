/*
  sitemap-sort.js

  Extracted from sitemap.xsl into its own file for the same reason as
  sitemap.css: the site's CSP (script-src 'self', no 'unsafe-inline')
  silently blocks an inline <script> block, same as it would an inline
  <style> block — see sitemap.css's own comment for the full story.

  Copy to public/js/sitemap-sort.js alongside sitemap.xsl/sitemap.css —
  nothing here needs per-project customization either.
*/
(function () {
  var table = document.getElementById('sitemap-table');
  if (!table) return;
  var tbody = table.tBodies[0];
  var headers = table.tHead.rows[0].cells;
  var sortState = {};

  function compareRows(key, dir) {
    return function (a, b) {
      var av = a.getAttribute('data-' + key) || '';
      var bv = b.getAttribute('data-' + key) || '';
      if (key === 'priority') {
        av = parseFloat(av) || 0;
        bv = parseFloat(bv) || 0;
        return dir * (av - bv);
      }
      return dir * av.localeCompare(bv);
    };
  }

  for (var i = 0; i < headers.length; i++) {
    (function (th) {
      var key = th.getAttribute('data-sort');
      th.addEventListener('click', function () {
        var dir = sortState[key] === 1 ? -1 : 1;
        sortState = {};
        sortState[key] = dir;
        var rows = Array.prototype.slice.call(tbody.rows);
        rows.sort(compareRows(key, dir));
        rows.forEach(function (row) { tbody.appendChild(row); });
      });
    })(headers[i]);
  }
})();
