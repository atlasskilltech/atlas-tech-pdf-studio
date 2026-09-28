/* =====================================================================
   ATLAS SkillTech University - Fee Structures 2027-28
   DOCUMENT RENDERER.

   Turns the content in js/docs-data.js into the <article class="doc"> /
   <section class="page"> structure that js/app.js views, prints and
   exports.

   Nothing here invents, reorders or reformats content: it only decides
   where each piece of the source text is placed on the sheet.

   Every sheet shares one design scale. After the fonts have loaded,
   fitAll() finds the largest master unit (--u) at which EVERY sheet
   still fits, and applies that one value to all of them - so no document
   can overflow, and no document can end up with type or spacing
   different from the rest of the collection.
   ===================================================================== */
(function () {
  'use strict';

  var LOGO_SRC = {
    'isdi-full-stack': 'assets/logos/isdi-full-stack.svg',
    'isme-full-stack': 'assets/logos/isme-full-stack.svg',
    'ugdx-full-stack-outlined': 'assets/logos/ugdx-full-stack-outlined.svg',
    'law-full-stack': 'assets/logos/law-full-stack.png'
  };
  function iconSrc(key) { return 'assets/icons/' + key + '.svg'; }

  // The design scale. U_DESIGN is the intended size of the system; the
  // collection is only scaled below it if the longest document would
  // otherwise not fit, and then every document scales with it.
  var U_DESIGN = 1.00;
  var U_MIN = 0.86;

  // -----------------------------------------------------------------
  // helpers
  // -----------------------------------------------------------------
  function brandVars(s) {
    return '--brand:' + s.brand + ';--deep:' + s.deep + ';--band:' + s.band +
           ';--t06:' + s.t06 + ';--t10:' + s.t10 + ';--t16:' + s.t16 + ';';
  }

  function header(s) {
    // The whole lockup block is the link. The anchor carries the block's
    // position and size, so the artwork is untouched and nothing about
    // the header changes visually.
    return '<div class="ph">' +
             '<a class="ph__link" href="' + s.logoUrl + '" target="_blank" rel="noopener">' +
               '<img class="ph__logo" data-asset="' + s.logo + '" src="' + LOGO_SRC[s.logo] +
               '" alt="' + s.logoAlt + '">' +
             '</a>' +
           '</div><div class="ph__rule"></div>';
  }

  function footerBand(f) {
    var social = '';
    for (var i = 0; i < f.social.length; i++) {
      var it = f.social[i];
      social += '<a class="pf__link" href="' + it.url + '" target="_blank" rel="noopener">' +
                  '<img class="pf__icon" data-asset="' + it.icon + '" src="' + iconSrc(it.icon) + '" alt="">' +
                  '<span class="pf__handle">' + it.label + '</span>' +
                '</a>';
    }

    return '<div class="pf">' +
             '<div class="pf__accent"></div>' +
             '<div class="pf__in">' +
               '<div class="pf__id">' +
                 '<a class="pf__org" href="' + f.orgUrl + '" target="_blank" rel="noopener">' +
                   f.org + '</a>' +
                 '<a class="pf__addr" href="' + f.addressUrl + '" target="_blank" rel="noopener">' +
                   f.address + '</a>' +
               '</div>' +
               '<div class="pf__social">' + social + '</div>' +
             '</div>' +
           '</div>';
  }

  // -----------------------------------------------------------------
  // Fee structure page
  // -----------------------------------------------------------------
  function titleBlock(d) {
    var t = '';
    for (var i = 0; i < d.title.length; i++) t += '<div class="tb__title">' + d.title[i] + '</div>';

    var sub = d.subtitle ? '<div class="tb__sub">' + d.subtitle + '</div>' : '';

    return '<div class="tb"><div class="tb__bar"></div><div class="tb__text">' +
             t + sub +
           '</div></div><div class="tb-rule"></div>';
  }

  function feeBlock(b) {
    var head = '<div class="fcard__head">' +
                 '<div class="fcard__head-label">' + b.head + '</div>' +
                 (b.headAmount ? '<div class="fcard__head-amt">' + b.headAmount + '</div>' : '') +
               '</div>';
    var rows = '';
    if (b.rows) {
      for (var i = 0; i < b.rows.length; i++) {
        var r = b.rows[i];
        var cls = 'frow' + (r.total ? ' frow--total' : '') + (r.solo ? ' frow--solo' : '');
        rows += '<div class="' + cls + '">' +
                  (r.solo ? '' : '<div class="frow__label">' + (r.label || '') + '</div>') +
                  '<div class="frow__amt">' + r.amount + '</div>' +
                '</div>';
      }
    }
    return '<div class="fcard">' + head + rows + '</div>';
  }

  // -----------------------------------------------------------------
  // Fee Refund Policy
  //
  // Two rules, applied to every occurrence in every document:
  //   * followed by a "click here" prompt  -> the prompt is bold and
  //     linked, the words "Fee Refund Policy" stay plain;
  //   * on its own                         -> "Fee Refund Policy" is
  //     itself bold and linked.
  // The wording is never touched - a prompt is never added or removed.
  // -----------------------------------------------------------------
  var REFUND_URL = 'https://atlasuniversity.edu.in/refundpolicy/';
  var PHRASE = 'Fee Refund Policy';
  // "Fee Refund Policy" + optional punctuation + a click-here prompt
  var WITH_PROMPT = /(Fee Refund Policy)([.,]?\s*)(\(?\s*(?:please\s+)?click\s+here\s*[.)]*)/gi;
  var MARK = '';   // stands in for an already-handled phrase

  function refundLink(inner) {
    return '<a class="rp" href="' + REFUND_URL + '" target="_blank" rel="noopener">' +
             '<b>' + inner + '</b></a>';
  }

  function linkRefundPolicy(html) {
    var out = html.replace(WITH_PROMPT, function (whole, phrase, gap, prompt) {
      return MARK + gap + refundLink(prompt);
    });
    out = out.split(PHRASE).join(refundLink(PHRASE));
    return out.split(MARK).join(PHRASE);
  }

  function termsBlock(d) {
    if (!d.terms || !d.terms.length) return '';
    var list = '';
    for (var i = 0; i < d.terms.length; i++) {
      list += '<div class="term">' +
                '<div class="term__n">' + (i + 1) + '.</div>' +
                '<div class="term__t">' + linkRefundPolicy(d.terms[i]) + '</div>' +
              '</div>';
    }
    return '<div class="terms">' +
             '<div class="terms__h">' + d.termsHeading + '</div>' +
             '<div class="terms__rule"></div>' +
             '<div class="terms__list">' + list + '</div>' +
           '</div>';
  }

  function feePage(d, s) {
    var blocks = '';
    for (var i = 0; i < d.blocks.length; i++) blocks += feeBlock(d.blocks[i]);

    var notes = '';
    if (d.notes && d.notes.length) {
      notes = '<div class="notes">';
      for (var n = 0; n < d.notes.length; n++) notes += '<div class="note">' + d.notes[n] + '</div>';
      notes += '</div>';
    }

    return '<section class="page" style="' + brandVars(s) + '">' +
             header(s) +
             '<div class="pbody"><div class="pcontent">' +
               titleBlock(d) + blocks + notes + termsBlock(d) +
             '</div></div>' +
             footerBand(d.footer) +
           '</section>';
  }

  // -----------------------------------------------------------------
  // Build
  // -----------------------------------------------------------------
  function article(d, s, pagesHtml) {
    return '<article class="doc" id="doc-' + d.id + '"' +
           ' data-name="' + d.cardName + '"' +
           ' data-title="' + d.docTitle + '"' +
           ' data-school="' + d.cardScope + '"' +
           ' data-color="' + s.brand + '"' +
           ' data-file="' + d.file + '">' + pagesHtml + '</article>';
  }

  function build() {
    var host = document.getElementById('documents');
    if (!host) return;
    var schools = window.FS_SCHOOLS, html = '';

    (window.FS_DOCS || []).forEach(function (d) {
      var s = schools[d.school];
      html += article(d, s, feePage(d, s));
    });

    host.innerHTML = html;
  }

  // -----------------------------------------------------------------
  // Fit
  //
  // One scale for the whole collection: the largest --u at which every
  // sheet still fits. Sheets are never scaled individually, so two
  // documents can never end up with different type sizes or spacing -
  // only with different amounts of blank space at the foot of the page,
  // which is what differing amounts of approved content really means.
  // -----------------------------------------------------------------
  function pageList() {
    return Array.prototype.slice.call(
      document.querySelectorAll('#documents section.page:not(.page--atlas)'));
  }

  function setUnit(pages, u) {
    for (var i = 0; i < pages.length; i++) {
      pages[i].style.setProperty('--u', u.toFixed(4) + 'mm');
    }
  }

  function slackOf(page) {
    var body = page.querySelector('.pbody');
    if (!body) return Infinity;
    var content = body.firstElementChild;
    if (!content) return Infinity;
    var cs = getComputedStyle(body);
    var avail = body.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    return avail - content.getBoundingClientRect().height;
  }

  function allFit(pages, u) {
    setUnit(pages, u);
    for (var i = 0; i < pages.length; i++) {
      if (slackOf(pages[i]) < 0.5) return false;
    }
    return true;
  }

  function fitAll() {
    var pages = pageList();
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
        u = U_MIN;
        setUnit(pages, u);
        console.warn('A sheet still overflows at the smallest allowed scale (' +
                     U_MIN + 'mm). Shorten the content or lower U_MIN.');
      }
    }

    var tightest = Infinity;
    for (var j = 0; j < pages.length; j++) {
      tightest = Math.min(tightest, slackOf(pages[j]));
    }
    console.info('Fee structures: one design scale for all ' + pages.length +
                 ' sheets, --u = ' + u.toFixed(4) + 'mm' +
                 (u < U_DESIGN ? ' (reduced from ' + U_DESIGN + 'mm so the longest document fits)' : '') +
                 '; tightest page has ' + tightest.toFixed(1) + 'px to spare.');
    return u;
  }

  build();

  window.FS_RENDER = { build: build, fitAll: fitAll, slackOf: slackOf };
})();
