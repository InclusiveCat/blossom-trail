/**
 * i18n.js — Blossom Trail V2
 * Loads a language JSON file and applies translations to [data-i18n] elements.
 * RTL support: sets dir="rtl" for Arabic, Urdu, Farsi, Hebrew.
 */

(function () {
    'use strict';

    var RTL_LANGS = ['ar', 'ur', 'fa', 'he'];

    var I18nManager = function () {
        this.currentLang = 'en';
        this.translations = {};
        try { this.currentLang = localStorage.getItem('blossom_lang') || 'en'; } catch (e) {}
    };

    I18nManager.prototype.loadLanguage = function (lang) {
        var self = this;
        return fetch('lang/' + lang + '.json')
            .then(function (res) {
                if (!res.ok) throw new Error('Not found: lang/' + lang + '.json');
                return res.json();
            })
            .then(function (data) {
                self.translations = data;
                self.currentLang = lang;
                try { localStorage.setItem('blossom_lang', lang); } catch (e) {}
                self.updateDOM();
            })
            .catch(function (err) {
                console.warn('[i18n] ' + err.message + ' — falling back to English');
                if (lang !== 'en') { self.loadLanguage('en'); }
            });
    };

    I18nManager.prototype.setLanguage = function (lang) {
        this.loadLanguage(lang);
    };

    // Resolve a dotted key like "accessibility.readAloud" from the translations object
    I18nManager.prototype.resolve = function (key) {
        return key.split('.').reduce(function (obj, k) {
            return (obj && obj[k] != null) ? obj[k] : null;
        }, this.translations);
    };

    I18nManager.prototype.updateDOM = function () {
        var self = this;
        var lang = this.currentLang;

        // 1. Set document language and text direction
        document.documentElement.lang = lang;
        document.documentElement.dir = (RTL_LANGS.indexOf(lang) !== -1) ? 'rtl' : 'ltr';

        // 2. Translate all [data-i18n] elements
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            var value = self.resolve(key);
            if (value == null) return; // key missing — leave existing text

            // Don't overwrite TTS button when it's in "ON" state
            if (el.classList.contains('a11y-tts-btn') && el.getAttribute('aria-pressed') === 'true') return;

            if (el.tagName === 'INPUT' && el.type === 'text') {
                el.placeholder = value;
            } else {
                // If element has child elements, only update direct text nodes
                var childElements = Array.from(el.childNodes).filter(function(n) { return n.nodeType === 1; });
                if (childElements.length > 0) {
                    Array.from(el.childNodes).forEach(function (node) {
                        if (node.nodeType === 3 && node.textContent.trim().length > 0) {
                            node.textContent = value;
                        }
                    });
                } else {
                    el.textContent = value;
                }
            }
        });

        // 3. Translate [data-i18n-aria] aria-label attributes
        document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-aria');
            var value = self.resolve(key);
            if (value) el.setAttribute('aria-label', value);
        });

        // 4. Sync all language select dropdowns to current language
        document.querySelectorAll('.blossom-lang-select').forEach(function (sel) {
            sel.value = lang;
        });

        // 5. Re-apply map filter (in case theme was already set before i18n loaded)
        if (window.setTheme) {
            try {
                var prefs = JSON.parse(localStorage.getItem('blossom_a11y_prefs') || '{}');
                if (prefs.theme && prefs.theme !== 'default' && window.applyAll) window.applyAll();
            } catch (e) {}
        }
    };

    window.i18n = new I18nManager();

    document.addEventListener('DOMContentLoaded', function () {
        window.i18n.loadLanguage(window.i18n.currentLang);
    });

})();
