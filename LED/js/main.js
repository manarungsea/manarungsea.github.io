(function() {

  function setupUI() {

	
      connectButton = document.getElementById('connectBtn'),
      switchButton = document.getElementById('switchBtn');
      

    connectButton.addEventListener('click', () => {
      connectButton.innerHTML = 'CONNECTING...';
      ble.connect()
        .then(() => {
          connectButton.innerHTML = 'CONNECTED';
        })
        .catch(() => {
          connectButton.innerHTML = 'CONNECT';
        });
    });

    switchButton.addEventListener('click', ble.togglePower);
    
  }

  function installServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope:', registration.scope);
      }).catch(function(err) {
        console.log('ServiceWorker registration failed:', err);
      });
    }
  }

  setupUI();
  installServiceWorker();

})();
