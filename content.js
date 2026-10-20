(() => {
  const IS_FB = location.hostname.includes("facebook.com");
  const IS_IG = location.hostname.includes("instagram.com");
  const P = IS_FB ? "fb_" : "ig_";
  const root = document.documentElement;

  const DEFAULTS = {
    enabled: true,
    fb_feed: true, fb_stories: true, fb_sidebar: true, fb_reels: true,
    fb_reel_lock: true, fb_ads: true, fb_comments: false, fb_marketplace: false,
    ig_feed: true, ig_stories: true, ig_reels: true,
    ig_reel_lock: true, ig_ads: true, ig_comments: false, ig_explore: true
  };

  // Settings cache -> first paint is already correct
  const CACHE_KEY = "__unhook_social_cache";
  let s = { ...DEFAULTS };
  try { const c = JSON.parse(localStorage.getItem(CACHE_KEY)); if (c) s = { ...DEFAULTS, ...c }; } catch {}
  const on = (k) => !!(s.enabled && s[P + k]);

  // ---------- Attributes the CSS reads ----------
  const path = () => location.pathname;
  const isHome = () => path() === "/" || path() === "" || path() === "/home.php";

  function reelId() {
    const m = IS_FB ? path().match(/^\/reel\/(\d+)/) : path().match(/^\/reels?\/([\w-]{5,})/);
    return m ? m[1] : null;
  }
  function isReelsFeed() {
    return IS_FB ? /^\/reels?\/?$/.test(path()) || /^\/watch(\/|$)/.test(path()) : /^\/reels\/?$/.test(path());
  }
  const locked = () => on("reel_lock") && !!reelId();

  function setAttrs() {
    const tokens = s.enabled ? Object.keys(s).filter((k) => k.startsWith(P) && s[k]).join(" ") : "";
    root.setAttribute("data-uh", tokens);
    root.setAttribute("data-uh-home", isHome() ? "1" : "0");
    root.setAttribute("data-uh-lock", locked() ? "1" : "0");
  }

  // ---------- Reel lock ----------
  let prevWasReel = false, lockedId = null, lockedUrl = null;

  function urlChanged() {
    if (on("reels") && isReelsFeed()) { location.replace("/"); return; }
    if (IS_IG && on("explore") && /^\/explore(\/|$)/.test(path())) { location.replace("/"); return; }
    const id = reelId();
    if (id) {
      if (prevWasReel && lockedUrl && id !== lockedId && on("reel_lock")) { location.replace(lockedUrl); return; }
      if (!prevWasReel) { lockedId = id; lockedUrl = location.href; }
    } else {
      lockedId = lockedUrl = null;
    }
    prevWasReel = !!id;
  }

  function allowScroll(t) {
    if (!t || !t.closest) return false;
    if (t.closest('textarea,input,[contenteditable="true"],[role="textbox"]')) return true;
    for (let el = t; el && el !== root; el = el.parentElement) {
      const cs = getComputedStyle(el);
      if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2 &&
          el.clientHeight < innerHeight * 0.85) return true;
    }
    return false;
  }
  const stop = (e) => { e.preventDefault(); e.stopImmediatePropagation(); };
  addEventListener("wheel", (e) => { if (locked() && !allowScroll(e.target)) stop(e); }, { capture: true, passive: false });
  addEventListener("touchmove", (e) => { if (locked() && !allowScroll(e.target)) stop(e); }, { capture: true, passive: false });
  addEventListener("keydown", (e) => {
    if (!locked()) return;
    if (e.target.closest && e.target.closest('input,textarea,[contenteditable="true"],[role="textbox"]')) return;
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "j", "k", "J", "K"].includes(e.key)) stop(e);
  }, true);

  // ---------- Tagging helpers (marks are permanent; CSS decides whether they hide) ----------
  const tag = (el, name) => { if (el && !el.hasAttribute(name)) el.setAttribute(name, ""); };
  const mainEl = () => document.querySelector('main, [role="main"]');

  // Stories ---------------------------------------------------------
  function tagStories() {
    if (!isHome()) return;
    const main = mainEl();
    if (!main || main.querySelector("[data-uh-s]")) return;

    if (IS_IG) {
      // The tray is the block sitting right above the first post, in the same column.
      const art = main.querySelector("article");
      if (!art) return;
      let el = art;
      for (let i = 0; i < 8 && el && el !== main; i++) {
        for (let sib = el.previousElementSibling; sib; sib = sib.previousElementSibling) {
          if (sib.hasAttribute("data-uh-s")) return;
          if (sib.matches("article") || sib.querySelector("article")) continue;
          const h = sib.offsetHeight;
          if (h >= 40 && h <= 260) { tag(sib, "data-uh-s"); return; }
        }
        el = el.parentElement;
      }
    } else {
      // Facebook: climb from a story link to the block that sits beside the feed
      const feed = main.querySelector('[role="feed"]');
      const link = main.querySelector('a[href*="/stories/"]');
      if (!feed || !link || feed.contains(link)) return;
      let el = link;
      while (el.parentElement && el.parentElement !== main && !el.parentElement.contains(feed)) el = el.parentElement;
      if (el !== main && !el.contains(feed)) tag(el, "data-uh-s");
    }
  }

  // Ads -------------------------------------------------------------
  let tries = new WeakMap();
  const AD_RE = /(?:^|[^\p{L}])(Sponsored|Paid partnership|ممول|إعلان ممول|شراكة مدفوعة|Sponsorisé|Patrocinado|Gesponsert)(?:[^\p{L}]|$)/u;

  function isAd(el) {
    if (IS_FB && el.querySelector('a[href*="/ads/"], a[href*="ad_id="], [aria-label="Sponsored"]')) return true;
    const t = (IS_FB ? el.innerText : el.textContent) || "";
    return AD_RE.test(t.slice(0, 500));
  }
  function tagAds() {
    document.querySelectorAll(IS_FB ? '[role="article"]' : "article").forEach((a) => {
      if (a.hasAttribute("data-uh-ad")) return;
      if (a.parentElement && a.parentElement.closest('[role="article"]')) return;
      const n = tries.get(a) || 0;
      if (n >= 4) return;
      tries.set(a, n + 1);
      if (isAd(a)) {
        let t = a;
        for (let i = 0; i < 3 && t.parentElement && t.parentElement.children.length === 1 &&
             !t.parentElement.matches('main,[role="feed"],body'); i++) t = t.parentElement;
        tag(t, "data-uh-ad");
      }
    });
  }

  // Facebook feed fallback (if role="feed" is missing on the home page) --------
  function tagFbFeedFallback() {
    if (!IS_FB || !isHome()) return;
    document.querySelectorAll('[role="article"]').forEach((a) => {
      if (!(a.parentElement && a.parentElement.closest('[role="article"]'))) tag(a, "data-uh-f");
    });
  }

  // Comments --------------------------------------------------------
  const FB_VIEW_START = /^(view|see|show|previous|more|عرض|مشاهدة|إظهار|شاهد)/i;
  const FB_COMMENT_WORD = /(comment|repl(y|ies)|تعليق|ردود)/i;
  const FB_COUNT = /^[\d\u0660-\u0669.,KMkم\s]+(comments?|تعليق\S*)$/i;
  const FB_LABEL = /^(Comment by|Reply by|تعليق من|رد من)/i;

  function tagFbComments() {
    document.querySelectorAll('[role="article"]').forEach((a) => {
      if (a.hasAttribute("data-uh-c")) return;
      const nested = a.parentElement && a.parentElement.closest('[role="article"]');
      if (FB_LABEL.test(a.getAttribute("aria-label") || "") || (nested && a.querySelector('a[href*="comment_id="]'))) {
        tag(a, "data-uh-c");
      }
    });
    document.querySelectorAll('div[role="button"], span[role="button"], span[dir="auto"]').forEach((el) => {
      if (el.hasAttribute("data-uh-c") || el.childElementCount > 2) return;
      const t = (el.textContent || "").trim();
      if (!t || t.length > 45) return;
      if ((FB_VIEW_START.test(t) && FB_COMMENT_WORD.test(t)) || FB_COUNT.test(t)) tag(el, "data-uh-c");
    });
  }

  const IG_LINK = /^(view|عرض|مشاهدة|hide|إخفاء)/i;
  const IG_WORD = /(comment|تعليق)/i;
  function igCommentList(ul) {
    for (const li of ul.querySelectorAll(":scope li")) {
      if (li.querySelector("time") && li.querySelector('a[href^="/"]')) return true;
    }
    return false;
  }
  function tagIgComments() {
    document.querySelectorAll('article, main, div[role="dialog"]').forEach((region) => {
      region.querySelectorAll("ul:not([data-uh-c])").forEach((ul) => { if (igCommentList(ul)) tag(ul, "data-uh-c"); });
      region.querySelectorAll('a, span[role="button"], div[role="button"]').forEach((el) => {
        if (el.hasAttribute("data-uh-c") || el.childElementCount > 1) return;
        const t = (el.textContent || "").trim();
        if (t && t.length < 60 && IG_LINK.test(t) && IG_WORD.test(t)) tag(el, "data-uh-c");
      });
      region.querySelectorAll('svg[aria-label="Comment"], svg[aria-label="تعليق"]').forEach((svg) => {
        tag(svg.closest('[role="button"], button'), "data-uh-c");
      });
    });
  }

  // ---------- Scheduling ----------
  function light() {
    setAttrs();
    if (on("ads")) tagAds();
    if (on("stories")) tagStories();
    if (on("comments")) (IS_FB ? tagFbComments : tagIgComments)();
    if (IS_FB && on("feed")) tagFbFeedFallback();
  }

  let timer = null;
  function schedule() {
    if (timer) return;
    timer = setTimeout(() => { timer = null; light(); }, 500);
  }

  function refresh() {
    tries = new WeakMap();
    urlChanged();
    light();
  }

  // ---------- Boot ----------
  setAttrs();
  urlChanged();

  let lastHref = location.href;
  setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      urlChanged();
      setAttrs();
      schedule();
    }
  }, 400);

  let observing = false;
  function startObserver() {
    if (observing) return;
    observing = true;
    new MutationObserver(schedule).observe(root, { childList: true, subtree: true });
  }

  chrome.storage.sync.get(DEFAULTS, (stored) => {
    s = { ...DEFAULTS, ...stored };
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(s)); } catch {}
    refresh();
    startObserver();
  });

  chrome.storage.onChanged.addListener((changes) => {
    for (const k in changes) s[k] = changes[k].newValue;
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(s)); } catch {}
    refresh();
  });
})();
