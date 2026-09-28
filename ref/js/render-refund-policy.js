/* =====================================================================
   ATLAS SkillTech University - Fee Refund Policy
   DOCUMENT RENDERER.

   Builds the two A4 sheets from js/refund-policy-data.js into the same
   <article class="doc"> / <section class="page"> structure that
   js/app.js views and exports, so this document gets the same viewer,
   the same 288 dpi artwork, the same searchable text layer and the same
   hyperlink annotations as the fee structures.

   It reuses the shared page architecture in css/styles.css - sheet,
   header band, body column, footer band, terms list - with ATLAS
   indigo and teal only. No school branding is used anywhere.
   ===================================================================== */
(function () {
  'use strict';

  // This document sets a little larger than the fee structures: it is a
  // two-sheet policy with fewer blocks, so the same 1.0mm unit would
  // leave both pages noticeably empty. Both of its sheets share one
  // scale, found the same way.
  var U_DESIGN = 1.16;
  var U_MIN = 0.86;

  function esc(v) { return String(v); }
  function iconSrc(key) { return 'assets/icons/' + key + '.svg'; }

  // -----------------------------------------------------------------
  // pieces
  // -----------------------------------------------------------------
  var ATLAS_URL = 'https://atlasuniversity.edu.in/';

  function header(d) {
    return '<div class="ph ph--atlas">' +
             '<a class="ph__link" href="' + ATLAS_URL + '" target="_blank" rel="noopener">' +
               '<img class="ph__mark" data-asset="' + d.brand.logo + '" src="' + d.brand.logoSrc +
               '" alt="' + d.brand.logoAlt + '">' +
             '</a>' +
           '</div><div class="ph__rule ph__rule--teal"></div>';
  }

  // The common fee-structure footer - same organisation line, same
  // address, same four channels, same icons - plus this document's page
  // number. It is drawn on the LAST page only.
  function footer(d, index, total) {
    var common = window.FS_FOOTER || {};

    var social = '';
    (common.social || []).forEach(function (it) {
      social += '<a class="pf__link" href="' + it.url + '" target="_blank" rel="noopener">' +
                  '<img class="pf__icon" data-asset="' + it.icon + '" src="' + iconSrc(it.icon) + '" alt="">' +
                  '<span class="pf__handle">' + it.label + '</span>' +
                '</a>';
    });

    return '<div class="pf pf--atlas">' +
             '<div class="pf__accent"></div>' +
             '<div class="pf__in">' +
               '<div class="pf__id">' +
                 '<a class="pf__org" href="' + (common.orgUrl || ATLAS_URL) + '" target="_blank" rel="noopener">' +
                   common.org + '</a>' +
                 '<a class="pf__addr" href="' + common.addressUrl + '" target="_blank" rel="noopener">' +
                   common.address + '</a>' +
               '</div>' +
               '<div class="pf__right">' +
                 '<div class="pf__social">' + social + '</div>' +
                 '<div class="pf__meta">' +
                   '<span class="pf__pnum">' + two(index + 1) + ' / ' + two(total) + '</span>' +
                 '</div>' +
               '</div>' +
             '</div>' +
           '</div>';
  }

  function two(v) { return (v < 10 ? '0' : '') + v; }

  function titleBlock(d) {
    return '<div class="tb"><div class="tb__bar tb__bar--teal"></div><div class="tb__text">' +
             '<div class="tb__title">' + d.title + '</div>' +
             '<div class="tb__sub">' + d.subtitle + '</div>' +
           '</div></div><div class="tb-rule"></div>';
  }

  function table(t) {
    var head = '', body = '';
    for (var c = 0; c < t.cols.length; c++) {
      head += '<th style="width:' + t.widths[c] + '%">' + t.cols[c] + '</th>';
    }
    for (var r = 0; r < t.rows.length; r++) {
      var row = t.rows[r];
      body += '<tr>' +
                '<td class="rt__no">' + esc(row[0]) + '</td>' +
                '<td>' + esc(row[1]) + '</td>' +
                '<td>' + esc(row[2]) + '</td>' +
                '<td class="rt__pct">' + esc(row[3]) + '</td>' +
              '</tr>';
    }
    return '<table class="rtable"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table>';
  }

  function termsBlock(d) {
    var list = '';
    for (var i = 0; i < d.terms.length; i++) {
      var t = d.terms[i], sub = '';
      if (t.list) {
        sub = '<div class="plist">';
        for (var j = 0; j < t.list.length; j++) {
          var it = t.list[j];
          sub += '<div class="plist__i"><span class="plist__d"></span>' +
                 '<span class="plist__t">' + it.label +
                   '<a class="rpmail" href="mailto:' + it.mailto + '">' +
                     '<b>' + it.email + '</b></a>' +
                 '</span></div>';
        }
        sub += '</div>';
      }
      list += '<div class="term">' +
                '<div class="term__n">' + (i + 1) + '.</div>' +
                '<div class="term__t">' + t.text + sub + '</div>' +
              '</div>';
    }
    return '<div class="terms">' +
             '<div class="terms__h">' + d.termsHeading + '</div>' +
             '<div class="terms__rule"></div>' +
             '<div class="terms__list">' + list + '</div>' +
           '</div>';
  }

  // -----------------------------------------------------------------
  // pages
  // -----------------------------------------------------------------
  // Header on the first sheet, footer on the last. A single-sheet
  // document is both, so it carries the two of them.
  function page(d, inner, index, total) {
    var first = index === 0;
    var last = index === total - 1;
    var cls = 'page page--atlas' +
              (first ? '' : ' page--noheader') +
              (last ? '' : ' page--nofooter');
    return '<section class="' + cls + '">' +
             (first ? header(d) : '') +
             '<div class="pbody"><div class="pcontent">' + inner + '</div></div>' +
             (last ? footer(d, index, total) : '') +
           '</section>';
  }

  function build() {
    var host = document.getElementById('documents');
    var d = window.FS_REFUND;
    if (!host || !d) return;

    // Sheet 1: title, policy paragraph, refund table and the footnote.
    // Sheet 2: the full Terms & Conditions.
    var p1 = titleBlock(d) +
             '<p class="ptext">' + d.intro + '</p>' +
             '<p class="ptext ptext--lead">' + d.lastDate + '</p>' +
             table(d.table) +
             '<div class="notes"><div class="note">' + d.tableNote + '</div></div>';

    var p2 = termsBlock(d);

    // Appended, not assigned: on index.html the fee structures are
    // already in place and the policy joins them as the last document.
    host.insertAdjacentHTML('beforeend',
      '<article class="doc" id="doc-' + d.id + '"' +
        ' data-name="' + d.cardName + '"' +
        ' data-title="' + d.docTitle + '"' +
        ' data-school="' + d.cardScope + '"' +
        ' data-color="' + d.brand.indigo + '"' +
        ' data-file="' + d.file + '">' +
        page(d, p1, 0, 2) + page(d, p2, 1, 2) +
      '</article>');
  }

  // -----------------------------------------------------------------
  // fit: one scale for both sheets, exactly as the fee structures do
  // -----------------------------------------------------------------
  function slackOf(p) {
    var body = p.querySelector('.pbody');
    if (!body) return Infinity;
    var content = body.firstElementChild;
    if (!content) return Infinity;
    var cs = getComputedStyle(body);
    var avail = body.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    return avail - content.getBoundingClientRect().height;
  }

  function setUnit(pages, u) {
    for (var i = 0; i < pages.length; i++) pages[i].style.setProperty('--u', u.toFixed(4) + 'mm');
  }

  function allFit(pages, u) {
    setUnit(pages, u);
    for (var i = 0; i < pages.length; i++) if (slackOf(pages[i]) < 0.5) return false;
    return true;
  }

  function fitAll() {
    var pages = Array.prototype.slice.call(
      document.querySelectorAll('#documents section.page.page--atlas'));
    if (!pages.length) return;
    var u = U_DESIGN;
    if (!allFit(pages, U_DESIGN)) {
      var lo = U_MIN, hi = U_DESIGN;
      for (var i = 0; i < 10; i++) {
        var mid = (lo + hi) / 2;
        if (allFit(pages, mid)) lo = mid; else hi = mid;
      }
      u = lo;
      setUnit(pages, u);
      if (!allFit(pages, u)) {
        u = U_MIN; setUnit(pages, u);
        console.warn('A sheet still overflows at the smallest allowed scale.');
      }
    }
    var tightest = Infinity;
    for (var j = 0; j < pages.length; j++) tightest = Math.min(tightest, slackOf(pages[j]));
    console.info('Fee Refund Policy: design scale --u = ' + u.toFixed(4) + 'mm; ' +
                 'tightest page has ' + tightest.toFixed(1) + 'px to spare.');
    return u;
  }

  build();

  // Chain onto whatever renderer ran before this one, so app.js's single
  // call to FS_RENDER.fitAll() fits every document on the page - each at
  // its own document's scale.
  var previous = window.FS_RENDER;
  window.FS_RENDER = {
    build: build,
    slackOf: slackOf,
    fitAll: function () {
      if (previous && previous.fitAll) previous.fitAll();
      return fitAll();
    }
  };
})();
