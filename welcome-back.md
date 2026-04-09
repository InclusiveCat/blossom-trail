# 🌸 Blossom Trail — Welcome Back

> **Welcome back.** The platform is now national-ready, PWA-enabled, and region-aware. The map no longer defaults to the North East, the font-size slider is restored, the Radar Key search is live nationally, and bloom predictions are in place. The service worker caches the trail for offline rural use.
>
> **Your next three development priorities, in order:**
> 1. **Fix the Rain Mode button placement** — a layout bug placing it under Display instead of Navigation.
> 2. **Build and validate the Microsoft Form** — ready to send to your Deaf BSL tester.
> 3. **Implement BSL accessibility enhancements** — structured as five discrete, implementable components.
>
> No code has been modified by this document. All guidance below is deterministic and scoped to `blossom-trail`.

---

## Phase 1 — UI Fix: Rain Mode Button Placement

> **Priority:** Highest — affects every user's first interaction with the Tools panel.

### Current Incorrect State

The **☔ Manual Rain Mode: OFF** button currently renders inside `#pane-disp` (the **Display** tab of the Tools & Resources accordion). This is semantically incorrect — Rain Mode is a navigation and trail-condition tool, not a display preference.

**Current location in `index.html`:**
```
⚙️ Tools and Resources
  └── Display tab  (#pane-disp)          ← WRONG
        ├── Dyslexia Friendly Font
        ├── [Text Size slider]
        └── ☔ Manual Rain Mode: OFF     ← currently here
```

### Correct Intended Location

Rain Mode belongs in the **Navigation tab** (`#pane-nav`), alongside the Radar Key Search button — both are tools that affect how the trail is navigated under real-world conditions.

**Target structure:**
```
⚙️ Tools and Resources
  ├── Display tab  (#pane-disp)
  │     ├── Dyslexia Friendly Font
  │     └── [Text Size slider]           ← Display only
  │
  └── Navigation tab  (#pane-nav)
        ├── ☔ Manual Rain Mode: OFF     ← CORRECT position
        ├── 🔑 Enable Dynamic Radar Search
        └── [Radar legend note]
```

### Required HTML Adjustment

The change is a **cut-and-paste within the same file** — no new elements, no new classes.

1. **Remove** the `<button id="toggle-rain" ...>` element from inside `<div id="pane-disp">`.
2. **Paste** it as the **first child** of `<div id="pane-nav">`, above the `<button id="btn-radar" ...>` element.
3. No CSS changes are required — `toggle-rain` already uses the `.a11y-btn` class which is styled identically across all panes.

### Accessibility Considerations

| Consideration | Requirement |
|---|---|
| Keyboard operability | Preserved — `<button>` elements are natively focusable. Tab order will reflect DOM order, so Rain Mode will precede Radar Search in the Navigation tab. |
| Clear labelling | Button text already reads `☔ Manual Rain Mode: OFF` / `☔ Manual Rain Mode: ACTIVE` — no label changes needed. |
| ARIA | No `aria-*` attributes are currently on this button. Consider adding `aria-pressed="false"` (toggled to `"true"` when active) to communicate state to screen readers. |
| Visual state | The button already changes `background` colour on toggle (`#005ea5` → `#b71c1c`). This is sufficient for sighted users but should be supplemented by the `aria-pressed` pattern above. |
| Scope | This fix is strictly limited to the sidebar layout — no map logic, no JS functions, and no data structures are touched. |

### Change Confirmation Checklist (before implementing)

- [ ] `toggle-rain` button removed from `#pane-disp`
- [ ] `toggle-rain` button inserted as first child of `#pane-nav`
- [ ] No other elements in either pane are moved or modified
- [ ] No new CSS classes introduced
- [ ] `manualWeatherToggle()` function is unchanged
- [ ] Hard refresh tested to confirm placement in correct tab

---

## Phase 2 — Microsoft Form Preparation

> **Timeline:** Tomorrow's task. Build, test internally, then send to BSL tester.

### Purpose

The form will gather structured, anonymous feedback from a Deaf BSL user participating in a remote usability session of the Blossom Trail. It must be minimal, visually clear, and function correctly when embedded in a PWA context.

---

### Recommended Question Set

Build the form in **Microsoft Forms** (forms.office.com). Use the following structure:

---

**Form Title:** Blossom Trail — Accessibility Feedback (BSL Tester)

**Introduction text:**
> "Thank you for helping us test the Blossom Trail. This short form has [N] questions and takes about 5 minutes. All responses are anonymous. You can stop at any time."

---

#### Section 1 — About You (2 questions)

**Q1. What device are you using today?** *(Choice — required)*
- 📱 Mobile phone
- 💻 Laptop or desktop computer
- 📟 Tablet (e.g. iPad)
- Other

**Q2. How would you prefer to complete this testing session?** *(Choice — required)*
- 🎥 Live video call (e.g. Zoom, Teams)
- 📹 Screen recording (record yourself using the trail)
- 🏢 In person
- No preference

---

#### Section 2 — BSL Accessibility (2 questions)

**Q3. Do you use British Sign Language (BSL) as your primary or preferred language?** *(Choice — required)*
- Yes — BSL is my primary language
- Yes — I use BSL alongside spoken/written English
- No

**Q4. What BSL accessibility features would help you use the Blossom Trail?** *(Checkboxes — optional, allow multiple)*
- A BSL welcome video explaining the trail
- BSL glossary pop-ups for key terms (e.g. "neurodivergent", "somatic")
- A BSL interpretation window following the page as I scroll
- Captions or transcripts for any audio content
- Visual alerts instead of sound-based cues
- None needed
- Other (please describe below)

---

#### Section 3 — Offline & PWA (2 questions)

**Q5. Do you expect to use the Blossom Trail in areas with low or no mobile signal?** *(Choice — required)*
- Yes — I expect to be in a low-signal area
- Possibly
- No — I expect to be online throughout
- I'm not sure

**Q6. Have you ever installed a website as an app on your phone's home screen?** *(Choice — optional)*
- Yes, I use apps like this regularly
- Yes, but I'm not sure how it works
- No, I've never done this
- I didn't know this was possible

---

#### Section 4 — Open Feedback (1 question)

**Q7. Is there anything else you'd like us to know before or during the testing session?** *(Long text — optional)*

---

### Form Configuration Checklist

#### Accessibility Settings (in MS Forms)
- [ ] **Theme:** Use a high-contrast or plain theme — avoid animated backgrounds
- [ ] **One question per page:** Enable in Settings → "One question at a time" (reduces cognitive load)
- [ ] **Progress bar:** Enable — shows completion progress
- [ ] **Required fields:** Only Q1, Q2, Q3, and Q5 are required — all others optional
- [ ] **Branching logic:** Not required for this minimal set — no conditional questions

#### Testing the Form (do this before sending)

| Test | Steps | Pass Condition |
|------|-------|----------------|
| **Test submission** | Complete all questions as a tester, submit | Response appears in the Responses tab |
| **Branching logic** | N/A for this form | No branching configured |
| **Email notifications** | Go to `...` → Settings → Email notifications | Confirm you receive an email on submission |
| **Mobile compatibility** | Open the share link on a mobile browser | All questions render without horizontal scroll; tap targets ≥ 44px |
| **PWA behaviour** | Open the share link inside the installed Blossom Trail PWA via an `<a href>` with `target="_blank"` | Form opens in the device browser; fields are fully operable; submission succeeds |

#### Pre-Send Checklist

- [ ] All required questions marked correctly
- [ ] Introduction text is plain, welcoming, and jargon-free
- [ ] Form preview tested on mobile (iOS and Android if possible)
- [ ] Test submission received in Responses tab
- [ ] Email notification confirmed
- [ ] Share link copied (not the edit link)
- [ ] Link sent via accessible channel (email with plain-text fallback, or WhatsApp)

---

## Phase 3 — BSL Accessibility Enhancements

> **Status:** Can begin today for components A and D — no experimental technology required.

### A. BSL Onboarding Video

**Purpose:** Introduce the Blossom Trail, its purpose, and how to navigate it — delivered entirely in British Sign Language for users whose primary language is BSL.

**Placement in the UI:**
- A `🤟 BSL Welcome` button should appear in the **Emergency tab** of Tools & Resources (alongside 999 BSL and Relay UK), or as a prominent card in the sidebar header area beneath the welcome text.
- On click, the video opens in a modal overlay or expands inline — not a new page.
- The button text should be: `🤟 Watch BSL Welcome` with `aria-label="Watch British Sign Language welcome video"`.

**Trigger mechanism:**
- Primary: the `🤟 Watch BSL Welcome` button (manual, user-controlled).
- Optional future enhancement: detect `?bsl=1` in the URL query string and auto-open the video panel on load.

**Offline caching behaviour:**
- If the video is self-hosted (e.g. a `.mp4` in the project root), add it to `STATIC_ASSETS` in `sw.js` — it will be pre-cached on service worker install.
- If the video is externally hosted (YouTube, Vimeo), it **cannot** be cached by the service worker due to CORS restrictions. In this case, provide a downloadable MP4 link as an offline fallback.
- The UI should display: *"This video requires an internet connection. [Download for offline use]"* when the user is offline.

**Content requirements (for BSL interpreter brief):**
- Duration: 60–90 seconds maximum
- Content: trail purpose, how to choose a location, how stages work, how to submit, what happens to the data
- Signer: should be clearly lit, plain background, facing camera
- Captions: required alongside the BSL — use auto-generated captions + manual correction

---

### B. BSL Glossary Pop-ups

**Purpose:** Allow users to tap or click underlined key terms and see a short BSL clip explaining that term.

**How glossary terms are identified:**
- A curated list of terms is maintained in a JS object: `BSL_GLOSSARY = { 'neurodivergent': { clipUrl: '...', transcript: '...' }, ... }`.
- Terms in the sidebar text are wrapped at render time: `<span class="bsl-term" data-term="neurodivergent">neurodivergent</span>`.
- Initially, target terms in: stage narratives, the welcome text, and likert statement text.

**How BSL clips are triggered:**
- A click/tap event on `.bsl-term` opens a small modal containing:
  - The `<video>` element (autoplay, muted by default, with signed content)
  - A written transcript beneath
  - A close `×` button
- The modal must be dismissible via `Escape` key and must return focus to the triggering term on close.

**Offline caching strategy:**
- Self-hosted clips: add their URLs to `STATIC_ASSETS` in `sw.js` — or register them dynamically using the cache-on-fetch tile strategy already in place.
- External clips: show the written transcript only when offline. The modal should degrade gracefully — never show a broken video element.

**Iconography requirements:**
- Glossary terms should be visually distinct: an underline + a small 🤟 icon beside them (or use a colour from `--accent` / `--primary`).
- Do not use `title` attribute tooltips — these are inaccessible on touch devices.

---

### C. BSL Interpretation Mode

**Purpose:** Provide a persistent, floating BSL interpreter window that follows the user through the trail — similar to the interpreter overlay used in live broadcasts.

**Floating video window behaviour:**
- A `position: fixed` panel, bottom-right of the viewport (above the Recentre button).
- Contains a `<video>` element looping the current section's BSL interpretation.
- Draggable (optional enhancement) — allow the user to reposition it.
- Resizable via a small toggle: compact (thumbnail) ↔ expanded (full sign view).

**Persistence across navigation:**
- The floating panel is attached to the main `#app` container, not inside any accordion bucket — it survives bucket open/close and map panning.
- A single `bslModeActive` boolean governs visibility — toggled by the `🤟 BSL Mode` button.

**Synchronisation with page sections:**
- Ideally, the video source updates as the user advances through stages (`advanceTo()` is the natural hook point).
- A `BSL_CLIPS` object maps stage IDs to clip URLs: `{ 1: 'bsl-stage-1.mp4', 2: 'bsl-stage-2.mp4', ... }`.
- On `advanceTo(stageId)`, the floating video `src` is swapped and the video restarted.

**Offline fallback behaviour:**
- If the clip for the current stage is not cached, the video area shows a placeholder card: *"BSL clip unavailable offline. Transcript: [text]"*.
- Never show a broken `<video>` element — use `onerror` to swap to the fallback.

---

### D. Visual Alert System

**Purpose:** Replace or supplement audio-based cues with visual and haptic patterns — ensuring Deaf and hard-of-hearing users receive the same urgency signals as hearing users.

**Replacement of audio cues:**
- The current trail has no intentional audio — but browser-generated sounds (e.g. notification beeps from form validation) can occur.
- All validation feedback must use **visible, on-screen messages** — never rely solely on colour. Use pattern + text + icon.

**Visual patterns for urgency:**

| Level | Use Case | Visual Pattern |
|---|---|---|
| Info | Bloom status update, radar results loaded | Subtle border flash (blue, 1 pulse) |
| Caution | Rain mode active, slippery surface warning | Amber pulsing border on affected card |
| Alert | Submission error, offline detected | Red border + ⚠️ icon + text banner at top of sidebar |
| Success | Survey submitted | Green border + ✓ icon + thank-you message |

All patterns use CSS `@keyframes` animation — no JavaScript audio APIs.

**Mobile vibration patterns:**
- Use the `navigator.vibrate()` API (widely supported on Android; not available on iOS).
- Pattern examples: `navigator.vibrate(200)` for info; `navigator.vibrate([200, 100, 200])` for caution; `navigator.vibrate([400, 100, 400])` for alert.
- Always gate behind a feature check: `if ('vibrate' in navigator) navigator.vibrate(...)`.
- Never vibrate without a visual cue — vibration is supplementary, not standalone.

**Accessibility considerations:**
- All visual animations must respect `prefers-reduced-motion`. Wrap keyframe animations with:
  `@media (prefers-reduced-motion: reduce) { /* disable pulse animations */ }`
- Text descriptions of the alert state must always accompany visual patterns.

---

### E. Captioning for Audio Content

**Purpose:** Ensure any audio content (BSL clips, onboarding video, future podcast-style guidance) is accompanied by accurate, synchronised captions.

**Browser-based captioning:**
- Use the standard `<track kind="subtitles">` element alongside `<video>`:
  ```html
  <video>
    <source src="bsl-welcome.mp4" type="video/mp4">
    <track kind="subtitles" src="bsl-welcome.vtt" srclang="en" label="English captions" default>
  </video>
  ```
- `.vtt` files are plain text and **fully cacheable by the service worker** — add them to `STATIC_ASSETS` in `sw.js`.
- This is the preferred method for all self-hosted content.

**Offline transcript fallback:**
- For any clip that cannot be cached (e.g. externally hosted), maintain a `BSL_TRANSCRIPTS` JS object mapping clip IDs to plain-text transcripts.
- When offline, render the transcript below the video area in a `<details><summary>Read transcript</summary>...</details>` element — collapsed by default to preserve space, but accessible.

**When to use each method:**

| Method | Use When |
|---|---|
| `<track>` WebVTT captions | Self-hosted video, online or offline (VTT cached by SW) |
| `BSL_TRANSCRIPTS` JS object | Externally hosted video, or as a fallback when the VTT fails to load |
| Auto-generated captions (YouTube/Vimeo embed) | Live demos or external links only — never as the primary accessibility method |

---

## Implementation Order Recommendation

| Priority | Phase | Effort | Notes |
|---|---|---|---|
| 🔴 Immediate | Phase 1 — Rain Mode button move | 5 min | Single HTML cut-and-paste, no logic change |
| 🟡 Tomorrow | Phase 2 — MS Form build + test | 60–90 min | Build in forms.office.com, test before sending |
| 🟢 This week | Phase 3D — Visual Alert System | 2–3 hrs | Pure CSS + minor JS, no external dependencies |
| 🟢 This week | Phase 3A — BSL Onboarding Video | 1 hr (UI) + filming | UI is straightforward; content requires BSL interpreter |
| 🔵 Next sprint | Phase 3B — BSL Glossary Pop-ups | Half day | Requires term curation + clip production |
| 🔵 Next sprint | Phase 3C — BSL Interpretation Mode | Half day | Requires per-stage clip production |
| 🔵 Next sprint | Phase 3E — Captioning | 1 hr (per clip) | Requires VTT file creation for each piece of content |
