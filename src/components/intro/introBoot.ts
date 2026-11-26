/** Server-safe: plain strings only (inlined into the root layout). */
export const INTRO_SESSION_KEY = "bys-intro-seen";

/**
 * Runs before first paint (inlined in <body>). Decides whether to play the intro.
 * Wrapped in try/catch: blocked storage must never leave the page covered.
 */
export const introBootScript = `(function(){try{var d=document.documentElement;if(location.pathname!=="/")return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(sessionStorage.getItem("${INTRO_SESSION_KEY}"))return;sessionStorage.setItem("${INTRO_SESSION_KEY}","1");d.dataset.intro="play";d.dataset.introPlayed="1";window.__bysIntroT0=performance.now();}catch(e){}})();`;
