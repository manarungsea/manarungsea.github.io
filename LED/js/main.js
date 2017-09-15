(function() {

  function setupUI() {

	
	
     var connectButton = document.getElementById('connectBtn');
     var switchButton = document.getElementById('switchBtn');
	 var motorButton = document.getElementById('motorBtn');
      

    connectButton.addEventListener('click', () => {
      connectButton.innerHTML = 'CONNECTING...';
      BLE.connect()
        .then(() => {
          connectButton.innerHTML = 'CONNECTED';
        })
        .catch(() => {
          connectButton.innerHTML = 'CONNECT';
        });
    });

    switchButton.addEventListener('click', BLE.togglePower);
	
	motorButton.addEventListener('click', () => {
		motorButton.innerHTML = 'SPINNING';
		spinMotor();
	});
    
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
