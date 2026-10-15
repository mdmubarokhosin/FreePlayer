/* ==========================================================================
   Free Player — app.js (vanilla JS, no dependencies)
   Handles: URL form → player.html, demo chips, share-link + iframe generator
   ========================================================================== */
(function () {
  'use strict';

  var $form   = document.getElementById('playForm');
  var $input  = document.getElementById('videoUrl');
  var $error  = document.getElementById('urlError');
  var $outLink  = document.getElementById('outLink');
  var $outEmbed = document.getElementById('outEmbed');
  var $copyLink  = document.getElementById('copyLink');
  var $copyEmbed = document.getElementById('copyEmbed');

  /* ---------- helpers ---------- */

  function normalizeUrl(raw) {
    var s = (raw || '').trim();
    if (!s) return null;
    /* Allow user to omit scheme */
    if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = 'https://' + s;
    try {
      var u = new URL(s);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
      return u.href;
    } catch (_) {
      return null;
    }
  }

  function playerHref(videoUrl) {
    return new URL('player.html?url=' + encodeURIComponent(videoUrl), location.href).href;
  }

  function showError(msg) {
    $error.textContent = msg;
    $error.hidden = false;
  }

  function clearError() {
    $error.hidden = true;
    $error.textContent = '';
  }

  function updateGenerators(videoUrl) {
    var link = playerHref(videoUrl);
    var embed = '<iframe src="' + link + '"\n'
      + '  style="width:100%;aspect-ratio:16/9;border:0;border-radius:12px"\n'
      + '  allowfullscreen allow="fullscreen"></iframe>';
    $outLink.value  = link;
    $outEmbed.value = embed;
  }

  /* ---------- form submit ---------- */

  $form.addEventListener('submit', function (e) {
    e.preventDefault();
    var url = normalizeUrl($input.value);
    if (!url) {
      showError('সঠিক লিংক দিন — শুধু http:// বা https:// দিয়ে শুরু হওয়া ভিডিও URL কাজ করবে।');
      return;
    }
    clearError();
    location.href = playerHref(url);
  });

  /* live-validate while typing */
  $input.addEventListener('input', clearError);

  /* ---------- demo chips ---------- */

  Array.prototype.forEach.call(document.querySelectorAll('.chip[data-demo]'), function (chip) {
    chip.addEventListener('click', function () {
      var url = chip.getAttribute('data-demo');
      $input.value = url;
      clearError();
      location.href = playerHref(url);
    });
  });

  /* ---------- copy buttons ---------- */

  function wireCopy(btn, textarea) {
    if (!btn || !textarea) return;
    btn.addEventListener('click', function () {
      var value = textarea.value;
      if (!value) return;

      function flash() {
        btn.classList.add('copied');
        var old = btn.textContent;
        btn.textContent = 'কপি হয়েছে ✓';
        setTimeout(function () {
          btn.classList.remove('copied');
          btn.textContent = old;
        }, 1600);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(flash, function () { fallbackCopy(value, flash); });
      } else {
        fallbackCopy(value, flash);
      }
    });
  }

  function fallbackCopy(text, done) {
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      done();
    } catch (_) { /* clipboard unavailable */ }
  }

  wireCopy($copyLink, $outLink);
  wireCopy($copyEmbed, $outEmbed);

  /* ---------- prefill from ?url= on the index page ---------- */

  var q = new URLSearchParams(location.search);
  var pre = (q.get('url') || q.get('src') || '').trim();
  if (pre) {
    $input.value = pre;
    updateGenerators(normalizeUrl(pre) || pre);
    $input.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
})();
