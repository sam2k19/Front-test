(function () {
  var SESSION_KEY = 'sirius_session';

  var SiriusSession = {
    createPayload: function (data, extra) {
      return {
        token: data.token || data.accessToken || '',
        userId: data.userId || (data.user && data.user._id) || '',
        activeRole: extra.activeRole || 'WORKER',
        email: extra.email || '',
        firstName: extra.firstName || '',
        lastName: extra.lastName || '',
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
    },
    persist: function (payload) {
      try { localStorage.setItem(SESSION_KEY, JSON.stringify(payload)); } catch (e) {}
    },
    get: function () {
      try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
    },
    clear: function () {
      try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
    },
    isValid: function () {
      var s = this.get();
      return s && s.token && s.expiresAt > Date.now();
    },
  };

  window.SiriusSession = SiriusSession;
})();
