(function() {
  try {
    var local = localStorage.getItem('ui-state');
    if (local) {
      var state = JSON.parse(local).state;
      if (state && state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
