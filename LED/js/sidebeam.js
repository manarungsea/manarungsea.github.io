'use strict';
let BLE = function() {

	let ledCharacteristic = null;
	let motorCharacteristic = null;
	let poweredOn = false;
	let poweredOff = true;

	function connect() {
		console.log('Reguesting Bluetooth device');
		navigator.bluetooth.requestDevice(
		{
			filters: [{services: ['19b10000-e8f2-537e-4f6c-d104768a1214']}]
		})
		.then(device => {
			console.log('Found ' + device.name);
			console.log('Connecting to Gatt server.... ');
			device.addEventListener('gattserverdisconnected', onDisconnected)
            return device.gatt.connect();
        })
        .then(server => {
            console.log('Getting Service  - Light control...');
            return server.getPrimaryService('19b10000-e8f2-537e-4f6c-d104768a1214');
        })
        .then(service => {
            console.log('Getting Characteristic LED and MOTOR');
            return service.getCharacteristic();
        })
		
		.then(characteristics => {
			let queue = Promise.resolve();
			characteristics.forEach(characteristic => {
			switch (characteristic.uuid) {

				case BluetoothUUID.getCharacteristic('19b10001-e8f2-537e-4f6c-d104768a1214'):
					queue = queue.then(_ => readLEDchar(characteristic));
					break;

				case BluetoothUUID.getCharacteristic('19b10002-e8f2-537e-4f6c-d104768a1214'):
					queue = queue.then(_ => readMOTORchar(characteristic));
					break;
					
				default: log('> Unknown Characteristic: ' + characteristic.uuid);
				}
			});
			return queue;
		})
		.catch(error => {
			log('Argh!' + error);
		});
	}
		
		function readLEDchar(characteristic) {
			ledCharacteristic = characteristic;
			
			console.log('> ledCharacteristic ' + characteristic );
		}
		function readMOTORchar(characteristic) {
			motorCharacteristic = characteristic;
			
			console.log('> motorCharacteristic ' + characteristic );
		}
		    

		function onDisconnected(event) {
		// Object event.target is Bluetooth Device getting disconnected.
			console.log('> Bluetooth Device disconnected');
		}

	function powerOn() {
  //let data = new Uint8Array([20,1,0]);
	let data = Uint8Array.of(50,1,0);
	return ledCharacteristic.writeValue(data)
      .catch(err => console.log('Error when powering on! ', err))
      .then(() => {
          poweredOn = true;
		  console.log(data);
         // toggleButtons();
		 //togglePower();
		});
	}

	function powerOff() {
		let data = new Uint8Array([0,1,1]);
		return ledCharacteristic.writeValue(data)
      .catch(err => console.log('Error when switching off! ', err))
      .then(() => {
          poweredOn = false;
          
		});
	}

	function togglePower() {
		if (poweredOn) {
			powerOff();
		
		} else {
			powerOn();
		
		}
	}

}
