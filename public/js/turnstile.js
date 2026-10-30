/**
 * assets/js/turnstile.js — copy to js/turnstile.js
 *
 * One job: hand the contact form a Turnstile token that is still valid at the
 * moment it posts.
 *
 * A token is good for 300 seconds and may be redeemed once. The obvious way to
 * get one is to read the hidden cf-turnstile-response input at submit time,
 * and that is wrong in two ordinary cases:
 *
 *   - the visitor landed, read the page, and wrote a message before clicking.
 *     The widget is meant to refresh an expired token by itself, but its
 *     timers are throttled while the tab is in the background, so a form left
 *     open in another tab comes back holding a dead token;
 *   - the visitor clicked before the challenge finished, so the input was
 *     still empty and an empty string got posted.
 *
 * Both come back from siteverify as the same generic failure, so the form
 * looks like it rejects people at random. It is worse than it sounds on a
 * brochure site: the person has already written their message, gets an
 * unexplained error, and leaves. Nobody reports it, and the lead is gone.
 *
 * So: take the token from a callback — which is also the only way to know how
 * old it is, since a hidden input's value changes fire no events — consume it
 * on handout because it is single-use, and throw away anything not
 * demonstrably fresh and fetch another before the form posts.
 *
 * Expects ONE widget per page. The data-callback attributes on the widget name
 * the globals below, so auto-rendering finds them — which means this file must
 * load BEFORE Turnstile's api.js. Keep it a plain synchronous <script> while
 * that one stays async; get the order wrong and it fails silently, with the
 * widget rendering but no callback ever firing.
 */
(function () {
  // Well inside the 300s lifetime, so a token that passes this check still has
  // minutes left and there is no race against the expiry.
  var MAX_AGE_MS = 180000;
  // Long enough for a challenge that needs a click; one that solves itself is
  // usually done inside a second.
  var DEFAULT_TIMEOUT_MS = 30000;

  var state = { token: '', at: 0 };

  window.onTurnstileSolved = function (token) {
    state.token = token || '';
    state.at = Date.now();
  };
  // Fires when the widget's token expires, and when the challenge fails or
  // errors. Whatever we are holding is worthless in every one of those cases.
  window.onTurnstileExpired = function () {
    state.token = '';
    state.at = 0;
  };
  window.onTurnstileError = window.onTurnstileExpired;

  function take() {
    var token = state.token;
    state.token = '';
    state.at = 0;
    return token;
  }

  function fresh() {
    return state.token !== '' && Date.now() - state.at < MAX_AGE_MS;
  }

  function reset() {
    state.token = '';
    state.at = 0;
    if (window.turnstile && typeof window.turnstile.reset === 'function') {
      try {
        window.turnstile.reset();
      } catch (e) {
        // Resetting a widget that never rendered throws; nothing to recover.
      }
    }
  }

  /**
   * Resolves with a token issued within the last few minutes, or '' if one
   * could not be had at all — api.js blocked, widget never rendered, challenge
   * abandoned. Treat '' as "tell the visitor and stop", never as something to
   * post and let the backend reject: the backend cannot tell those apart, so
   * the visitor gets a misleading error.
   *
   * @param {{ timeoutMs?: number, onChallenge?: () => void }} [opts]
   *   onChallenge fires only when a token was NOT already in hand, i.e. when
   *   a challenge may be about to appear and the wait is worth explaining.
   */
  function token(opts) {
    var options = opts || {};
    var timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;

    if (fresh()) return Promise.resolve(take());

    if (typeof options.onChallenge === 'function') options.onChallenge();
    reset();

    if (!window.turnstile) return Promise.resolve('');

    return new Promise(function (resolve) {
      var deadline = Date.now() + timeoutMs;
      var tick = setInterval(function () {
        if (state.token !== '') {
          clearInterval(tick);
          resolve(take());
        } else if (Date.now() > deadline) {
          clearInterval(tick);
          resolve('');
        }
      }, 100);
    });
  }

  window.freshTurnstile = { token: token, reset: reset };
})();
