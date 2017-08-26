'use strict'

let ledCharacteristic = null;
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
			// device.addEventListener('gattserverdisconnected', onDisconnected)
            return device.gatt.connect();
        })
        .then(server => {
            console.log('Getting Service  - Light control...');
            return server.getPrimaryService('19b10000-e8f2-537e-4f6c-d104768a1214');
        })
        .then(service => {
            console.log('Getting Characteristic - Light control...');
            return service.getCharacteristic('19b10001-e8f2-537e-4f6c-d104768a1214');
        })
        .then(characteristic => {
            
            ledCharacteristic = characteristic;
			console.log('All ready!' + ledCharacteristic);
            // onConnected();
			togglePower();
        })
        .catch(error => {
            console.log('Argh! ' + error);
        });
}

function powerOn() {
  let data = new Uint8Array([0x01]); 
 return ledCharacteristic.writeValue(data)
      .catch(err => console.log('Error when powering on! ', err))
      .then(() => {
          poweredOn = true;
         // toggleButtons();
      });
}

function powerOff() {
  let data = new Uint8Array([0x0]);
  return ledCharacteristic.writeValue(data)
      .catch(err => console.log('Error when switching off! ', err))
      .then(() => {
          poweredOn = false;
         // toggleButtons();
      });
}

function togglePower() {
    if (poweredOn) {
        powerOff();
    } else {
        powerOn();
    }
}
