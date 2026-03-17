(function () {
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
})();
