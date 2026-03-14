(function () {
  var API_BASE = 'https://siriusjobs-backend.onrender.com/api';
  var form = document.getElementById('registerForm');
  if (!form) return;

  document.querySelectorAll('[data-password-toggle]').forEach(function (btn) {
    var targetId = btn.getAttribute('data-target');
    var input = document.getElementById(targetId);
    if (!input) return;
    btn.addEventListener('click', function () {
      var showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      btn.textContent = showing ? 'Show' : 'Hide';
    });
  });

  var accountTypeInputs = document.querySelectorAll('input[name="account-type"]');
  var fullNameField = document.getElementById('fullNameField');
  var clientUsernameField = document.getElementById('clientUsernameField');

  accountTypeInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      if (input.value === 'client') {
        if (fullNameField) fullNameField.classList.add('hidden');
        if (clientUsernameField) clientUsernameField.classList.remove('hidden');
      } else {
        if (fullNameField) fullNameField.classList.remove('hidden');
        if (clientUsernameField) clientUsernameField.classList.add('hidden');
      }
    });
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var submitBtn = form.querySelector('button[type="submit"]');
    var accountType = (document.querySelector('input[name="account-type"]:checked') || {}).value || 'worker';
    var email = (document.getElementById('email') || {}).value.trim();
    var phone = (document.getElementById('phone') || {}).value.trim();
    var password = (document.getElementById('password') || {}).value;
    var confirmPassword = (document.getElementById('confirm-password') || {}).value;
    var terms = (document.getElementById('terms') || {}).checked;

    if (!terms) { alert('Please agree to the Terms of Service.'); return; }
    if (password !== confirmPassword) { alert('Passwords do not match.'); return; }
    if (password.length < 8) { alert('Password must be at least 8 characters.'); return; }

    var payload;
    var endpoint;

    if (accountType === 'client') {
      var username = (document.getElementById('client-username') || {}).value.trim();
      if (!username) { alert('Username is required for client accounts.'); return; }
      payload = { name: username, email: email, password: password, accountType: 'client' };
      endpoint = API_BASE + '/auth/register';
    } else {
      var fullName = (document.getElementById('full-name') || {}).value.trim();
      if (!fullName || fullName.split(' ').length < 2) { alert('Please enter your full name (first and last name).'); return; }
      var parts = fullName.split(' ');
      payload = { firstName: parts[0], lastName: parts.slice(1).join(' '), email: email, phone: phone, password: password, confirmPassword: confirmPassword };
      endpoint = API_BASE + '/auth/register-' + accountType;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating your account...';

    try {
      var response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      var data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Registration failed');
      if (window.SiriusSession && data.data) {
        var sp = window.SiriusSession.createPayload(data.data, { activeRole: accountType.toUpperCase(), email: email });
        window.SiriusSession.persist(sp);
      }
      alert('Account created successfully! Redirecting...');
      var redirectMap = { worker: 'worker-dashboard.html', employer: 'employer-dashboard.html', client: 'consultations.html' };
      window.location.href = redirectMap[accountType] || 'index.html';
    } catch (err) {
      alert(err.message || 'Unable to create account. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  });
})();
