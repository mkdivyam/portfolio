(function () {
  var root = document.documentElement;
  try { var s = localStorage.getItem("theme"); if (s) root.dataset.theme = s; } catch (e) {}
  var tb = document.getElementById("theme");
  if (tb) tb.addEventListener("click", function () {
    var cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark"; root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // SQL highlighting: comments and keywords only
  document.querySelectorAll("code.sql").forEach(function (c) {
    c.innerHTML = c.innerHTML.replace(/--.*$/gm, "<i>$&</i>")
      .replace(/\b(WITH|AS|SELECT|FROM|GROUP BY|ORDER BY|PARTITION BY|OVER|ROUND|NULLIF|LAG|SUM)\b/g, "<b>$1</b>");
  });

  // Charts: drawn from data-* attributes on .chart (data lives in the HTML)
  document.querySelectorAll(".chart").forEach(function (el) {
    var v = el.dataset.values.split(",").map(Number), l = el.dataset.labels.split(","), line = el.dataset.type === "line";
    var W = 560, H = 240, L = 36, R = 10, T = 12, B = 28, max = Math.max.apply(null, v) * 1.1, s = "";
    var x = function (i) { return L + (W - L - R) * (line ? i / (v.length - 1) : (i + .5) / v.length); };
    var y = function (n) { return H - B - (H - T - B) * n / max; };
    for (var g = 0; g <= 4; g++) { var gv = max * g / 4;
      s += '<line class="g" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(gv) + '" y2="' + y(gv) + '"/><text x="' + (L - 6) + '" y="' + (y(gv) + 3) + '" text-anchor="end">' + Math.round(gv) + "</text>"; }
    var bw = (W - L - R) / v.length * .55, pts = [];
    v.forEach(function (n, i) {
      s += '<text x="' + x(i) + '" y="' + (H - 10) + '" text-anchor="middle">' + l[i] + "</text>";
      if (line) pts.push(x(i) + "," + y(n)); else s += '<rect class="bar" rx="3" x="' + (x(i) - bw / 2) + '" y="' + y(n) + '" width="' + bw + '" height="' + (y(0) - y(n)) + '"/>';
    });
    if (line) { s += '<polyline class="ln" pathLength="1" points="' + pts.join(" ") + '"/>';
      v.forEach(function (n, i) { s += '<circle class="dot" r="3.5" cx="' + x(i) + '" cy="' + y(n) + '"/>'; }); }
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + el.dataset.title + '">' + s + "</svg>";
  });
})();
