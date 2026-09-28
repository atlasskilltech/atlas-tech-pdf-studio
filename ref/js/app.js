/* =====================================================================
   Fee Structures 2027-28 — viewer and PDF export (vanilla JavaScript)

   - Each <article class="doc"> in index.html is one fee structure and
     each <section class="page"> inside it is one A4 page.
   - "Download PDF" rasterises every page of a document at high
     resolution (html2canvas) and writes them, in order, into ONE PDF
     whose pages are exactly 210 x 297 mm (jsPDF).
   - "Download All Fee Structures" builds every PDF and packs them into
     a single ZIP (JSZip), so the browser only has to save one file.
   - index.html?render=<doc-id> (or ?render=all) shows only the bare
     pages with no interface, for printing or visual checks.
   ===================================================================== */
(function () {
  'use strict';

  var PAGE_W_MM = 210;
  var PAGE_H_MM = 297;
  var RENDER_SCALE = 3;        // ~288 dpi: sharp in print, sensible file size
  var JPEG_QUALITY = 0.92;
  var ZIP_NAME = 'ATLAS-Fee-Structures-2027-28.zip';

  var docs = Array.prototype.slice.call(document.querySelectorAll('#documents > article.doc'));
  var byId = {};
  docs.forEach(function (d) { byId[d.id.replace(/^doc-/, '')] = d; });

  // ---------------------------------------------------------------
  // Assets: use embedded data URIs so canvases are never "tainted"
  // when the site is opened from disk (file://).
  // ---------------------------------------------------------------
  function applyAssets(root) {
    var map = window.FS_ASSETS || {};
    root.querySelectorAll('img[data-asset]').forEach(function (img) {
      var uri = map[img.getAttribute('data-asset')];
      if (uri && img.getAttribute('src') !== uri) img.setAttribute('src', uri);
    });
  }
  applyAssets(document);

  function waitForImages(root) {
    var imgs = Array.prototype.slice.call(root.querySelectorAll('img'));
    return Promise.all(imgs.map(function (img) {
      if (img.complete && img.naturalWidth) return Promise.resolve();
      return new Promise(function (res) { img.onload = img.onerror = function () { res(); }; });
    }));
  }

  var fitted = false;
  function ready() {
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    return fontsReady
      .then(function () { return waitForImages(document.getElementById('documents')); })
      .then(function () {
        // Scale each sheet's type to its content once the real metrics are
        // known, so nothing can overflow, clip or run under the footer.
        if (!fitted && window.FS_RENDER) { window.FS_RENDER.fitAll(); fitted = true; }
      });
  }

  function pagesOf(doc) { return Array.prototype.slice.call(doc.querySelectorAll('section.page')); }

  // ---------------------------------------------------------------
  // Bare render mode (?render=id | all) — pages only, no interface
  // ---------------------------------------------------------------
  var params = new URLSearchParams(location.search);
  var renderParam = params.get('render');
  if (renderParam) {
    var list = renderParam === 'all' ? docs : [byId[renderParam]].filter(Boolean);
    document.getElementById('app').remove();
    document.body.className = '';
    document.body.style.margin = '0';
    document.body.style.background = '#fff';
    var root = document.getElementById('print-root');
    root.style.cssText = 'position:static';
    document.title = list.length === 1 ? list[0].getAttribute('data-file').replace(/\.pdf$/, '') : 'Fee Structures 2027-28';
    // Fit first, then copy the finished sheets across.
    ready().then(function () {
      list.forEach(function (d) { pagesOf(d).forEach(function (p) { root.appendChild(p.cloneNode(true)); }); });
      return waitForImages(root);
    }).then(function () { document.documentElement.setAttribute('data-rendered', 'true'); });
    return;
  }

  // ---------------------------------------------------------------
  // Interface
  // ---------------------------------------------------------------
  var listEl = document.getElementById('doc-list');
  var viewer = document.getElementById('viewer');
  var viewerTitle = document.getElementById('viewer-title');
  var viewerPages = document.getElementById('viewer-pages');
  var viewerDownload = document.getElementById('viewer-download');
  var toast = document.getElementById('toast');
  var current = null;
  var busy = false;

  function pageCountLabel(n) { return n + (n === 1 ? ' page' : ' pages'); }

  function addCard(doc) {
    var id = doc.id.replace(/^doc-/, '');
    var n = pagesOf(doc).length;
    var li = document.createElement('li');
    // One fixed card structure for every document: the text block always
    // reserves a title line + two metadata lines, so cards are the same
    // height and the buttons line up whatever the text length.
    li.className = 'doc-item flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm';
    li.setAttribute('data-id', id);
    li.innerHTML =
      '<div class="flex min-h-[3.5rem] items-start gap-3">' +
        '<span class="mt-1.5 h-3 w-3 flex-none rounded-sm" style="background:' + doc.getAttribute('data-color') + '"></span>' +
        '<div class="min-w-0 flex-1">' +
          '<p class="text-base font-semibold leading-6 text-atlas">' + doc.getAttribute('data-name') + '</p>' +
          '<p class="text-xs leading-4 text-slate-500">' + doc.getAttribute('data-school') + ' · ' + pageCountLabel(n) + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="mt-3 grid grid-cols-2 gap-2">' +
        '<button type="button" data-action="view" class="flex h-9 items-center justify-center rounded-md border border-atlas/30 px-3 text-sm font-semibold text-atlas hover:bg-atlas/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal">View</button>' +
        '<button type="button" data-action="download" class="flex h-9 items-center justify-center rounded-md border border-atlas bg-atlas px-3 text-sm font-semibold text-white hover:bg-atlas/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal">Download PDF</button>' +
      '</div>';
    li.querySelector('[data-action="view"]').addEventListener('click', function () { show(id, true); });
    li.querySelector('[data-action="download"]').addEventListener('click', function () { downloadOne(id); });
    listEl.appendChild(li);
  }

  docs.forEach(addCard);

  function show(id, pushHash) {
    var doc = byId[id];
    if (!doc) return;
    current = id;
    viewer.innerHTML = '';
    pagesOf(doc).forEach(function (page, i) {
      var frame = document.createElement('div');
      frame.className = 'page-frame';
      frame.setAttribute('aria-label', 'Page ' + (i + 1));
      frame.appendChild(page.cloneNode(true));
      viewer.appendChild(frame);
    });
    viewerTitle.textContent = doc.getAttribute('data-title');
    viewerPages.textContent = pageCountLabel(pagesOf(doc).length) + ' · ' + doc.getAttribute('data-file');
    listEl.querySelectorAll('.doc-item').forEach(function (li) {
      var on = li.getAttribute('data-id') === id;
      li.classList.toggle('ring-2', on);
      li.classList.toggle('ring-atlas', on);
    });
    if (pushHash) history.replaceState(null, '', '#' + id);
    fit();
  }

  // Scale the fixed-size pages to the viewer width (screen only).
  function fit() {
    var frames = viewer.querySelectorAll('.page-frame');
    if (!frames.length) return;
    var pagePx = frames[0].firstChild.offsetWidth;
    var style = getComputedStyle(viewer);
    var avail = viewer.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    var s = Math.min(1, avail / pagePx);
    frames.forEach(function (f) {
      var page = f.firstChild;
      page.style.transformOrigin = '0 0';
      page.style.transform = 'scale(' + s + ')';
      f.style.width = (page.offsetWidth * s) + 'px';
      f.style.height = (page.offsetHeight * s) + 'px';
      f.style.flex = 'none';
    });
  }
  window.addEventListener('resize', fit);

  viewerDownload.addEventListener('click', function () { if (current) downloadOne(current); });
  var downloadAllBtn = document.getElementById('download-all');
  if (downloadAllBtn) downloadAllBtn.addEventListener('click', downloadAll);

  function say(msg, hideAfter) {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(say.t);
    if (hideAfter) say.t = setTimeout(function () { toast.classList.add('hidden'); }, hideAfter);
  }

  // ---------------------------------------------------------------
  // Page rasterising
  //
  // Primary method: the page is copied, with its computed styles and
  // the embedded fonts, into an SVG <foreignObject> and drawn onto a
  // canvas. The browser itself lays the page out, so the PDF matches
  // what is shown on screen exactly.
  // Fallback (browsers that block this, e.g. older Safari): html2canvas.
  // ---------------------------------------------------------------
  var STYLE_PROPS = [
    'display', 'position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'box-sizing',
    'min-width', 'max-width', 'min-height', 'max-height', 'float', 'clear', 'visibility',
    'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis',
    'align-items', 'align-self', 'align-content', 'justify-content', 'order',
    'row-gap', 'column-gap',
    'grid-template-columns', 'grid-template-rows', 'grid-auto-flow', 'grid-column', 'grid-row',
    'border-top-left-radius', 'border-top-right-radius',
    'border-bottom-right-radius', 'border-bottom-left-radius',
    'background-image', 'background-size', 'background-position', 'background-repeat',
    'background-clip', 'background-origin',
    'table-layout', 'border-collapse', 'border-spacing', 'empty-cells',
    'list-style-type', 'list-style-position', 'font-variant-numeric', 'text-indent',
    'object-fit', 'object-position', 'transform', 'transform-origin',
    'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'overflow', 'background-color', 'color', 'opacity', 'z-index', 'vertical-align',
    'font-family', 'font-size', 'font-weight', 'font-style', 'font-stretch', 'font-kerning',
    'font-feature-settings', 'font-variant-ligatures', 'line-height', 'letter-spacing', 'word-spacing',
    'white-space', 'text-align', 'text-transform', 'text-rendering', '-webkit-font-smoothing',
    'text-decoration-line', 'text-decoration-color', 'text-decoration-style', 'text-decoration-thickness',
    'text-underline-offset',
    'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
    'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
    'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'
  ];

  function inlineComputedStyles(src, dst) {
    if (src.nodeType !== 1) return;
    var cs = getComputedStyle(src);
    var css = '';
    for (var i = 0; i < STYLE_PROPS.length; i++) {
      var v = cs.getPropertyValue(STYLE_PROPS[i]);
      if (v !== '') css += STYLE_PROPS[i] + ':' + v + ';';
    }
    dst.setAttribute('style', css);
    dst.removeAttribute('class');
    for (var c = 0; c < src.children.length; c++) inlineComputedStyles(src.children[c], dst.children[c]);
  }

  function renderPageNative(live) {
    var w = live.offsetWidth, h = live.offsetHeight;
    var copy = live.cloneNode(true);
    inlineComputedStyles(live, copy);
    copy.style.margin = '0';
    var xhtml = new XMLSerializer().serializeToString(copy);
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">' +
      '<foreignObject x="0" y="0" width="' + w + '" height="' + h + '">' +
      '<div xmlns="http://www.w3.org/1999/xhtml" style="margin:0;padding:0">' +
      '<style>' + (window.FS_FONT_CSS || '') + '</style>' + xhtml +
      '</div></foreignObject></svg>';
    var img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return img.decode().then(function () {
      var canvas = document.createElement('canvas');
      canvas.width = Math.round(w * RENDER_SCALE);
      canvas.height = Math.round(h * RENDER_SCALE);
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw twice: the first pass makes sure the embedded fonts are
      // active inside the SVG image before the final pass.
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return new Promise(function (res) { setTimeout(res, 60); }).then(function () {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toDataURL('image/png', 0); // throws here if the browser tainted the canvas
        return canvas;
      });
    });
  }

  // ---------------------------------------------------------------
  // Text layer
  //
  // The picture above is what the reader sees; this walks the same
  // laid-out page and records every line of text with its position, so
  // the PDF also carries real, selectable, searchable text behind the
  // artwork. Nothing here is drawn visibly.
  // ---------------------------------------------------------------
  function extractLines(root) {
    var mmPerPx = PAGE_W_MM / root.offsetWidth;
    var base = root.getBoundingClientRect();
    var range = document.createRange();
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var lines = [];
    var node;

    while ((node = walker.nextNode())) {
      var text = node.nodeValue;
      if (!text || !/\S/.test(text)) continue;
      var cs = getComputedStyle(node.parentNode);
      if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
      var fontPx = parseFloat(cs.fontSize) || 0;
      if (!fontPx) continue;

      var i = 0, n = text.length;
      while (i < n) {
        while (i < n && !/\S/.test(text.charAt(i))) i++;
        if (i >= n) break;
        range.setStart(node, i); range.setEnd(node, i + 1);
        var top = range.getBoundingClientRect().top;
        var j = i + 1;
        while (j < n) {
          range.setStart(node, j); range.setEnd(node, j + 1);
          var r = range.getBoundingClientRect();
          if (r.width || r.height) { if (Math.abs(r.top - top) > 0.6) break; }
          j++;
        }
        range.setStart(node, i); range.setEnd(node, j);
        var box = range.getBoundingClientRect();
        // Collapse trailing whitespace to a single space rather than
        // dropping it: it keeps words apart when a sentence is split
        // across inline runs, e.g. "the University's " + "<b>Fee Refund".
        var raw = text.slice(i, j);
        var str = raw.replace(/\s+$/, '');
        if (str && str !== raw) str += ' ';
        if (str && box.width > 0) {
          lines.push({
            text: str,
            x: (box.left - base.left) * mmPerPx,
            y: (box.bottom - base.top) * mmPerPx - fontPx * mmPerPx * 0.20,
            size: fontPx * mmPerPx * 72 / 25.4
          });
        }
        i = j;
      }
    }
    return lines;
  }

  // jsPDF's built-in fonts cannot carry typographic quotes and dashes, so
  // the invisible layer uses their ASCII equivalents. The visible page is
  // the artwork above and keeps the original characters.
  var TEXT_LAYER_MAP = {
    '‘': "'", '’': "'", '‚': "'", '‛': "'",
    '“': '"', '”': '"', '„': '"',
    '–': '-', '—': '-', '−': '-',
    '…': '...', ' ': ' ', '•': '-', '·': '-'
  };

  function forTextLayer(str) {
    return str.replace(/[ ·–—‘-„•…−]/g,
                       function (c) { return TEXT_LAYER_MAP[c] || ' '; });
  }

  // Hyperlinks
  //
  // Every <a href> on the sheet becomes a real link annotation in the
  // PDF, positioned over the artwork, so the footer links are clickable
  // in any PDF reader. A wrapped link reports one rectangle per line.
  function extractLinks(root) {
    var mmPerPx = PAGE_W_MM / root.offsetWidth;
    var base = root.getBoundingClientRect();
    var out = [];
    root.querySelectorAll('a[href]').forEach(function (a) {
      var url = a.getAttribute('href');
      if (!url || url.charAt(0) === '#') return;
      var rects = a.getClientRects();
      for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if (r.width < 1 || r.height < 1) continue;
        out.push({
          url: url,
          x: (r.left - base.left) * mmPerPx,
          y: (r.top - base.top) * mmPerPx,
          w: r.width * mmPerPx,
          h: r.height * mmPerPx
        });
      }
    });
    return out;
  }

  function addLinks(pdf, links) {
    for (var i = 0; i < links.length; i++) {
      var l = links[i];
      pdf.link(l.x, l.y, l.w, l.h, { url: l.url });
    }
  }

  function addTextLayer(pdf, lines) {
    pdf.setFont('helvetica', 'normal');
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i];
      if (!(l.size > 0)) continue;
      pdf.setFontSize(l.size);
      pdf.text(forTextLayer(l.text), l.x, l.y, { renderingMode: 'invisible', baseline: 'alphabetic' });
    }
  }

  function renderPage(page) {
    var host = document.getElementById('render-host');
    var clone = page.cloneNode(true);
    clone.style.transform = 'none';
    host.appendChild(clone);
    return waitForImages(clone).then(function () {
      var lines = [], links = [];
      try { lines = extractLines(clone); }
      catch (e) { console.warn('Text layer skipped for this page:', e); }
      try { links = extractLinks(clone); }
      catch (e) { console.warn('Link layer skipped for this page:', e); }
      return renderPageNative(clone).then(function (canvas) {
        host.removeChild(clone);
        return { canvas: canvas, lines: lines, links: links };
      }, function (err) {
        console.warn('Native page rendering unavailable, using html2canvas:', err);
        return renderPageHtml2canvas(clone, host).then(function (canvas) {
          return { canvas: canvas, lines: lines, links: links };
        });
      });
    }, function (err) {
      if (clone.parentNode) host.removeChild(clone);
      throw err;
    });
  }

  function renderPageHtml2canvas(clone, host) {
    return Promise.resolve().then(function () {
      return window.html2canvas(clone, {
        scale: RENDER_SCALE,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        width: clone.offsetWidth,
        height: clone.offsetHeight,
        windowWidth: clone.offsetWidth,
        windowHeight: clone.offsetHeight,
        scrollX: 0,
        scrollY: 0
      });
    }).then(function (canvas) {
      host.removeChild(clone);
      return canvas;
    }, function (err) {
      if (clone.parentNode) host.removeChild(clone);
      throw err;
    });
  }

  function buildPdf(doc) {
    var jsPDF = window.jspdf.jsPDF;
    var pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [PAGE_W_MM, PAGE_H_MM], compress: true });
    pdf.setProperties({
      title: doc.getAttribute('data-title') + ' — Fee Structure 2027-28',
      subject: 'Fee Structure, Academic Year 2027-28 (Intake 27)',
      author: 'ATLAS SkillTech University',
      creator: 'ATLAS SkillTech University'
    });
    var pages = pagesOf(doc);
    var chain = Promise.resolve();
    pages.forEach(function (page, i) {
      chain = chain.then(function () { return renderPage(page); }).then(function (out) {
        if (i > 0) pdf.addPage([PAGE_W_MM, PAGE_H_MM], 'portrait');
        pdf.addImage(out.canvas.toDataURL('image/jpeg', JPEG_QUALITY), 'JPEG', 0, 0, PAGE_W_MM, PAGE_H_MM, undefined, 'FAST');
        try { addTextLayer(pdf, out.lines); }
        catch (e) { console.warn('Text layer skipped for this page:', e); }
        try { addLinks(pdf, out.links); }
        catch (e) { console.warn('Link annotations skipped for this page:', e); }
      });
    });
    return chain.then(function () { return pdf; });
  }

  function saveBlob(blob, name) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  }

  function guard(fn) {
    if (busy) { say('Please wait — a PDF is still being prepared…', 2500); return; }
    busy = true;
    document.body.style.cursor = 'progress';
    return ready().then(fn).catch(function (err) {
      console.error(err);
      say('Sorry, the PDF could not be created: ' + (err && err.message ? err.message : err), 6000);
    }).then(function () { busy = false; document.body.style.cursor = ''; });
  }

  function downloadOne(id) {
    var doc = byId[id];
    guard(function () {
      say('Preparing ' + doc.getAttribute('data-file') + '…');
      return buildPdf(doc).then(function (pdf) {
        saveBlob(pdf.output('blob'), doc.getAttribute('data-file'));
        say('Downloaded ' + doc.getAttribute('data-file'), 3000);
      });
    });
  }

  function downloadAll() {
    guard(function () {
      var zip = new window.JSZip();
      var chain = Promise.resolve();
      docs.forEach(function (doc, i) {
        chain = chain.then(function () {
          say('Preparing ' + (i + 1) + ' of ' + docs.length + ': ' + doc.getAttribute('data-file') + '…');
          return buildPdf(doc);
        }).then(function (pdf) {
          zip.file(doc.getAttribute('data-file'), pdf.output('arraybuffer'));
        });
      });
      return chain.then(function () {
        say('Creating ' + ZIP_NAME + '…');
        return zip.generateAsync({ type: 'blob' });
      }).then(function (blob) {
        saveBlob(blob, ZIP_NAME);
        say('Downloaded ' + ZIP_NAME + ' (' + docs.length + ' PDFs)', 4000);
      });
    });
  }

  // Expose for automated checks / console use.
  window.FeeStructures = {
    ids: Object.keys(byId),
    buildPdf: function (id) { return ready().then(function () { return buildPdf(byId[id]); }); },
    downloadOne: downloadOne,
    downloadAll: downloadAll
  };

  // Initial view
  var initial = location.hash.replace('#', '');
  ready().then(function () { show(byId[initial] ? initial : Object.keys(byId)[0], false); });
})();
