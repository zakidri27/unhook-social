const DEFAULTS = {
  enabled: true,
  fb_feed: true, fb_stories: true, fb_sidebar: true, fb_reels: true,
  fb_reel_lock: true, fb_ads: true, fb_comments: false, fb_marketplace: false,
  ig_feed: true, ig_stories: true, ig_reels: true,
  ig_reel_lock: true, ig_ads: true, ig_comments: false, ig_explore: true
};

const panel = document.getElementById("panel");
const inputs = document.querySelectorAll("input[data-key]");
const allInputs = document.querySelectorAll("input[data-all]");
let state = { ...DEFAULTS };

const keysOf = (g) => Object.keys(DEFAULTS).filter((k) => k.startsWith(g + "_"));

function render() {
  inputs.forEach((i) => (i.checked = !!state[i.dataset.key]));
  allInputs.forEach((a) => (a.checked = keysOf(a.dataset.all).every((k) => state[k])));
  panel.classList.toggle("off", !state.enabled);
}

chrome.storage.sync.get(DEFAULTS, (s) => { state = { ...DEFAULTS, ...s }; render(); });

inputs.forEach((i) =>
  i.addEventListener("change", () => {
    state[i.dataset.key] = i.checked;
    chrome.storage.sync.set({ [i.dataset.key]: i.checked });
    render();
  })
);

allInputs.forEach((a) =>
  a.addEventListener("change", () => {
    const patch = {};
    keysOf(a.dataset.all).forEach((k) => (patch[k] = a.checked));
    Object.assign(state, patch);
    chrome.storage.sync.set(patch);
    render();
  })
);
