(function () {
  var API_BASE = 'https://siriusjobs-backend.onrender.com/api';
  var form = document.getElementById('workerEmployerLoginForm');
  if (!form) return;

  var selectedAccount = 'worker';

  document.querySelectorAll('.workerAccountBtn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      selectedAccount = this.getAttribute('data-account');
    });
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var submitBtn = document.getElementById('workerLoginSubmitBtn');
    var message = document.getElementById('workerLoginMessage');
    var identifier = document.getElementById('workerEmail').value.trim();
    var password = document.getElementById('workerPassword').value;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
    if (message) { message.classList.add('hidden'); }

    try {
      var response = await fetch(API_BASE + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier, password: password }),
      });

      var data = await response.json();

      if (!response.ok) throw new Error(data.message || data.error || 'Login failed');

      var sessionData = data.data || data;

      if (window.SiriusSession && sessionData) {
        var payload = window.SiriusSession.createPayload(sessionData, {
          activeRole: selectedAccount.toUpperCase(),
          email: identifier,
        });
        window.SiriusSession.persist(payload);
      }

      var redirectMap = {
        worker: 'worker-dashboard.html',
        employer: 'employer-dashboard.html',
        professional: 'professional-dashboard.html',
        merchant: 'marketplace-dashboard.html',
        client: 'consultations.html',
      };

      window.location.href = redirectMap[selectedAccount] || 'index.html';

    } catch (err) {
      if (message) {
        message.textContent = err.message || 'Login failed. Please try again.';
        message.className = 'text-sm text-red-500 font-medium';
        message.classList.remove('hidden');
      }
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });
})();
