(() => {
  const CHECK_URL = "/api/check-session";
  const REDIRECT_URL = "/?access=removed";
  const POLL_MS = 15000;
  let stopped = false;
  let checking = false;
  let activitySentAt = 0;
  function reportActivity() {
    if (Date.now() - activitySentAt < 10 * 60 * 1000) return;
    activitySentAt = Date.now();
    fetch("/api/activity", {
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
      headers: {
         "content-type": "application/json" 
      },
      body: JSON.stringify({
         path: window.location.pathname 
      }),
    }).catch(() => {
    });
  }
  async function verifyAccess() {
    if (stopped || checking) return;
    checking = true;
    try {
      const response = await fetch(`${CHECK_URL}?t=${Date.now()}`, {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
           "accept": "application/json" 
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (!data?.authenticated) {
          stopped = true;
          // window.location.replace(REDIRECT_URL);
          return;
        }
        reportActivity();
      }
    } catch {
      // A temporary network failure should not kick a valid customer.
    } finally {
      checking = false;
    }
  }
  verifyAccess();
  const timer = window.setInterval(verifyAccess, POLL_MS);
  window.addEventListener("pageshow", verifyAccess);
  window.addEventListener("focus", verifyAccess);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) verifyAccess();
  });
  window.addEventListener("pagehide", () => window.clearInterval(timer), {
    once: true,
  });
})();
