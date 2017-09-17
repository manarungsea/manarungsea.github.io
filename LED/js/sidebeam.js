'use strict';
var BLE = {
	ServiceUUID : "'19b10000-e8f2-537e-4f6c-d104768a1214'",
	ledCharacteristic : null,
	motorCharacteristic : null,
	poweredOn : false,
	
	connect: function() {
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
            console.log('Getting Characteristic LED and MOTOR' );
            return service.getCharacteristics();
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
					
				default: console.log('> Unknown Characteristic: ' + characteristic.uuid);
				}
			});
			return queue;
		})
		.catch(error => {
			console.log('Argh!' + error);
		});
	},
		
	togglePower: function() {
		
		if (BLE.poweredOn) {
			 powerOff();
		
		} else {
			powerOn();
		
		}
	}

		
};
		
		function readLEDchar(characteristic) {
			BLE.ledCharacteristic = characteristic;
			
			console.log('> ledCharacteristic ' + characteristic );
		}
		
		function readMOTORchar(characteristic) {
			BLE.motorCharacteristic = characteristic;
			
			console.log('> motorCharacteristic ' + characteristic );
		}
		    

		function onDisconnected(event) {
		// Object event.target is Bluetooth Device getting disconnected.
			console.log('> Bluetooth Device disconnected');
		}

	 function powerOn() {
  //let data = new Uint8Array([20,1,0]);
	let data = Uint8Array.of(1);
	return BLE.ledCharacteristic.writeValue(data)
      .catch(err => console.log('Error when powering on! ', err))
      .then(() => {
          BLE.poweredOn = true;
		  console.log(data);
         // toggleButtons();
		 //togglePower();
		});
	}

	function powerOff() {
		let data = new Uint8Array([0]);
		return BLE.ledCharacteristic.writeValue(data)
      .catch(err => console.log('Error when switching off! ', err))
      .then(() => {
          BLE.poweredOn = false;
          
		});
	}
	
	function spinMotor() {
  //let data = new Uint8Array([20,1,0]);
	//let data = Uint8Array.of(200,1);
	let r = document.getElementById('num_rev').valueAsNumber,
	    g = document.getElementById('dir').valueAsNumber,
		b = document.getElementById('period').valueAsNumber;
	let data = Uint8Array.of(r,g,b);
		  
		  
	return BLE.motorCharacteristic.writeValue(data) 
		
      .then(() => {
		  console.log('motor data sent' + data);   
		})
		.catch(err => console.log('Error motor spin ', err));
	}

	

