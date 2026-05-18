/**
 * accessibility.js — Blossom Trail V2
 * Single source of truth for all user preference controls.
 * All functions exposed globally on window.* so inline onclick attrs work.
 * Preferences persist in localStorage under 'blossom_a11y_prefs'.
 */

(function () {
    'use strict';

    // ── Load saved prefs or set safe defaults ────────────────────────────
    var prefs = {};
    try { prefs = JSON.parse(localStorage.getItem('blossom_a11y_prefs')) || {}; } catch (e) { prefs = {}; }
    prefs.fontScale    = prefs.fontScale    != null ? prefs.fontScale    : 1;
    prefs.theme        = prefs.theme        || 'default';
    prefs.dyslexiaFont = prefs.dyslexiaFont || false;
    prefs.readingRuler = prefs.readingRuler || false;
    prefs.ttsEnabled   = prefs.ttsEnabled   || false;
    prefs.ttsRate      = prefs.ttsRate      != null ? prefs.ttsRate      : 0.85;

    function save() {
        try { localStorage.setItem('blossom_a11y_prefs', JSON.stringify(prefs)); } catch(e){}
    }

    // ── Apply all preferences to DOM ─────────────────────────────────────
    function applyAll() {
        // Font scale
        document.documentElement.style.setProperty('--font-scale', prefs.fontScale);
        var pct = Math.round(prefs.fontScale * 100) + '%';
        document.querySelectorAll('.font-size-slider').forEach(function(s) {
            s.value = prefs.fontScale;
            s.setAttribute('aria-valuenow', Math.round(prefs.fontScale * 100));
        });
        document.querySelectorAll('.font-size-value, #font-size-display').forEach(function(d) {
            d.textContent = pct;
        });

        // TTS rate slider
        document.querySelectorAll('.tts-rate-slider').forEach(function(s) { s.value = prefs.ttsRate; });
        document.querySelectorAll('.tts-rate-label').forEach(function(d) { d.textContent = rateLabel(prefs.ttsRate); });

        // Dyslexia font
        document.body.classList.toggle('dyslexia-font', !!prefs.dyslexiaFont);
        syncPressed('.a11y-dyslexia-btn', prefs.dyslexiaFont);

        // Theme
        var themes = ['high-contrast','dark-mode','sepia-overlay','cyan-overlay','sage-overlay'];
        themes.forEach(function(t){ document.body.classList.remove(t); });
        if (prefs.theme !== 'default') document.body.classList.add(prefs.theme);
        document.querySelectorAll('.a11y-theme-select').forEach(function(sel) { sel.value = prefs.theme; });

        // Map CSS filter
        applyMapFilter(prefs.theme);

        // Reading ruler
        if (prefs.readingRuler) { createRuler(); } else { destroyRuler(); }
        syncPressed('.a11y-ruler-btn', prefs.readingRuler);

        // TTS — update button label WITHOUT touching data-i18n elements that the i18n module owns
        if (prefs.ttsEnabled) { enableTTS(); } else { disableTTS(); }
        syncPressed('.a11y-tts-btn', prefs.ttsEnabled);
        // Only update TTS button text if not currently being translated by i18n
        document.querySelectorAll('.a11y-tts-btn').forEach(function(btn) {
            if (!btn.getAttribute('data-i18n')) {
                btn.textContent = prefs.ttsEnabled ? 'Read Aloud: ON' : 'Read Aloud';
            }
        });
    }

    function rateLabel(rate) {
        if (rate <= 0.55)  return 'Very slow';
        if (rate <= 0.75)  return 'Slow';
        if (rate <= 0.95)  return 'Normal';
        if (rate <= 1.15)  return 'Fast';
        return 'Very fast';
    }

    function syncPressed(selector, state) {
        document.querySelectorAll(selector).forEach(function(btn) {
            btn.classList.toggle('active', !!state);
            btn.setAttribute('aria-pressed', state ? 'true' : 'false');
        });
    }

    // ── Map Tile CSS Filter ──────────────────────────────────────────────
    var MAP_FILTERS = {
        'default':       'none',
        'high-contrast': 'invert(1) hue-rotate(180deg) saturate(1.5)',
        'dark-mode':     'brightness(0.65) contrast(1.1)',
        'sepia-overlay': 'sepia(0.75) brightness(0.95)',
        'cyan-overlay':  'hue-rotate(155deg) saturate(0.65) brightness(1.05)',
        'sage-overlay':  'hue-rotate(85deg) saturate(0.5) brightness(0.95)'
    };

    function applyMapFilter(theme) {
        var filter = MAP_FILTERS[theme] || 'none';
        // Apply to tile pane — deferred slightly so Leaflet has time to init
        setTimeout(function() {
            document.querySelectorAll('.leaflet-tile-pane, .leaflet-layer').forEach(function(el) {
                el.style.filter = filter;
            });
        }, 100);
    }

    // ── Reading Ruler ────────────────────────────────────────────────────
    var rulerEl = null, _rulerMM = null, _rulerTM = null;

    function createRuler() {
        if (rulerEl) return;
        rulerEl = document.createElement('div');
        rulerEl.id = 'reading-ruler';
        rulerEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(rulerEl);
        _rulerMM = function(e) { rulerEl.style.top = (e.clientY - 16) + 'px'; };
        _rulerTM = function(e) { if (e.touches.length) rulerEl.style.top = (e.touches[0].clientY - 16) + 'px'; };
        document.addEventListener('mousemove', _rulerMM);
        document.addEventListener('touchmove', _rulerTM, { passive: true });
    }

    function destroyRuler() {
        if (!rulerEl) return;
        document.removeEventListener('mousemove', _rulerMM);
        document.removeEventListener('touchmove', _rulerTM);
        if (rulerEl.parentNode) rulerEl.parentNode.removeChild(rulerEl);
        rulerEl = null; _rulerMM = null; _rulerTM = null;
    }

    // ── Text-to-Speech ───────────────────────────────────────────────────
    var _ttsHandler = null;
    // Broad selector — captures all readable text blocks
    // .welcome-msg is a div so needs explicit inclusion
    var TTS_SELECTOR = 'p, label, legend, h1, h2, h3, li, .q-title, .q-desc, .stage-narrative, .technique-box, .welcome-msg, .option-text, .stage-text, .wc-status-box';

    var VOICE_PREFS = {
        'en': ['en-GB', 'en-AU', 'en-US', 'en'],
        'en-GB': ['en-GB', 'en-AU', 'en-US'],
        'cy': ['cy-GB', 'cy', 'en-GB', 'en'],
        'es': ['es-ES', 'es-MX', 'es-US', 'es'],
        'fr': ['fr-FR', 'fr-CA', 'fr'],
        'de': ['de-DE', 'de'],
        'pl': ['pl-PL', 'pl'],
        'ro': ['ro-RO', 'ro'],
        'ar': ['ar-SA', 'ar-EG', 'ar'],
        'ur': ['ur-PK', 'ur'],
        'hi': ['hi-IN', 'hi'],
        'zh': ['zh-CN', 'zh-TW', 'zh'],
        'ja': ['ja-JP', 'ja'],
        'ko': ['ko-KR', 'ko']
    };

    function getBestVoice(pageLang) {
        if (!window.speechSynthesis) return null;
        var voices = window.speechSynthesis.getVoices();
        if (!voices || !voices.length) return null;
        var lang = (pageLang || 'en').split('-')[0].toLowerCase();
        var tryList = VOICE_PREFS[pageLang] || VOICE_PREFS[lang] || [lang, 'en'];
        for (var i = 0; i < tryList.length; i++) {
            for (var j = 0; j < voices.length; j++) {
                if (voices[j].lang.toLowerCase() === tryList[i].toLowerCase()) return voices[j];
            }
        }
        // Partial match
        for (var j = 0; j < voices.length; j++) {
            if (voices[j].lang.toLowerCase().startsWith(lang)) return voices[j];
        }
        // Last resort: any English voice
        for (var j = 0; j < voices.length; j++) {
            if (voices[j].lang.toLowerCase().startsWith('en')) return voices[j];
        }
        return voices[0] || null;
    }

    var _ttsHighlight = null;

    function speakText(text, sourceEl) {
        if (!window.speechSynthesis) {
            console.warn('[TTS] SpeechSynthesis not available in this browser');
            return;
        }

        // Remove previous highlight
        if (_ttsHighlight) { _ttsHighlight.classList.remove('tts-reading'); _ttsHighlight = null; }

        // Highlight the element being read
        if (sourceEl) { sourceEl.classList.add('tts-reading'); _ttsHighlight = sourceEl; }

        // Chrome bug: must resume if paused, then cancel, then speak
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        window.speechSynthesis.cancel();

        setTimeout(function() {
            var utt = new SpeechSynthesisUtterance(text);
            var pageLang = document.documentElement.lang || 'en';
            var voice = getBestVoice(pageLang);
            if (voice) { utt.voice = voice; utt.lang = voice.lang; }
            else { utt.lang = pageLang; }
            utt.rate = parseFloat(prefs.ttsRate) || 0.85;
            utt.pitch = 1;
            utt.volume = 1;
            utt.onend = function() {
                if (_ttsHighlight) { _ttsHighlight.classList.remove('tts-reading'); _ttsHighlight = null; }
            };
            utt.onerror = function(ev) {
                console.warn('[TTS] Speech error:', ev.error);
                if (_ttsHighlight) { _ttsHighlight.classList.remove('tts-reading'); _ttsHighlight = null; }
            };
            window.speechSynthesis.speak(utt);
        }, 80);
    }

    function enableTTS() {
        if (_ttsHandler) return;
        if (window.speechSynthesis) { window.speechSynthesis.getVoices(); } // pre-warm Chrome
        _ttsHandler = function(e) {
            // Walk up from the clicked element to find a readable text container
            var el = e.target;
            var target = null;
            var depth = 0;
            while (el && el !== document.body && depth < 6) {
                if (el.matches && el.matches(TTS_SELECTOR)) {
                    target = el;
                    break;
                }
                el = el.parentElement;
                depth++;
            }
            if (!target) return;
            var text = (target.innerText || target.textContent || '').trim();
            if (!text || text.length < 2) return;
            speakText(text, target);
        };
        document.addEventListener('click', _ttsHandler);
    }

    function disableTTS() {
        if (!_ttsHandler) return;
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        document.removeEventListener('click', _ttsHandler);
        _ttsHandler = null;
    }

    // Reload voice list when Chrome fires voiceschanged event
    if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = function() { window.speechSynthesis.getVoices(); };
    }

    // ── Public API ───────────────────────────────────────────────────────
    window.setTheme = function(t) { prefs.theme = t || 'default'; save(); applyAll(); };
    window.stepFontSize = function(d) {
        prefs.fontScale = Math.min(1.5, Math.max(0.8, parseFloat((prefs.fontScale + d).toFixed(2))));
        save(); applyAll();
    };
    window.applyFontScale = function(s) {
        prefs.fontScale = Math.min(1.5, Math.max(0.8, parseFloat(parseFloat(s).toFixed(2))));
        save(); applyAll();
    };
    window.setTTSRate = function(r) {
        prefs.ttsRate = Math.min(2, Math.max(0.3, parseFloat(parseFloat(r).toFixed(2))));
        save(); applyAll();
    };
    window.toggleDyslexiaFont  = function() { prefs.dyslexiaFont  = !prefs.dyslexiaFont;  save(); applyAll(); };
    window.toggleReadingRuler  = function() { prefs.readingRuler  = !prefs.readingRuler;  save(); applyAll(); };
    window.toggleTTS           = function() { prefs.ttsEnabled    = !prefs.ttsEnabled;    save(); applyAll(); };
    window.stopTTS             = function() { if (window.speechSynthesis) window.speechSynthesis.cancel(); };

    // ── Apply on load ────────────────────────────────────────────────────
    applyAll();
    document.addEventListener('DOMContentLoaded', applyAll);

})();
