const SERVICE_UUID = "0783b03e-8535-b5a0-7140-a304d2495cb7";
const CHARACTERISTICS_READ = "0783b03e-8535-b5a0-7140-a304d2495cb8";
const CHARACTERISTICS_WRITE = "0783b03e-8535-b5a0-7140-a304d2495cba";
const BATTERY_LEVEL = "battery_level";

let characteristicWrite
async function onButtonClick() {
    logOnScreen()
    try {
        // log('Requesting Bluetooth Device...');
        const device = await navigator.bluetooth.requestDevice(
            {acceptAllDevices: true, optionalServices: [SERVICE_UUID]}
        );

        // log('Connecting to GATT Server...');
        const server = await device.gatt.connect();

        // log('Getting Service...');
        const service = await server.getPrimaryService(SERVICE_UUID);

        log('Getting Read Characteristic...');
        const characteristicRead = await service.getCharacteristic(CHARACTERISTICS_READ);

        log('Start Notifications...');
        characteristicRead.startNotifications();
        characteristicRead.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);

        log('Getting Write Characteristic...');
        characteristicWrite = await service.getCharacteristic(CHARACTERISTICS_WRITE);
        log('> Characteristic UUID:  ' + characteristicWrite.uuid);
        log('> Broadcast:            ' + characteristicWrite.properties.broadcast);
        log('> Read:                 ' + characteristicWrite.properties.read);
        log('> Write w/o response:   ' + characteristicWrite.properties.writeWithoutResponse);
        log('> Write:                ' + characteristicWrite.properties.write);
        log('> Notify:               ' + characteristicWrite.properties.notify);
        log('> Indicate:             ' + characteristicWrite.properties.indicate);
        log('> Signed Write:         ' + characteristicWrite.properties.authenticatedSignedWrites);
        log('> Queued Write:         ' + characteristicWrite.properties.reliableWrite);
        log('> Writable Auxiliaries: ' + characteristicWrite.properties.writableAuxiliaries);
        // let textEncoder = new TextEncoder();
        // let value = textEncoder.encode(BATTERY_LEVEL);
        // await characteristicWrite.writeValueWithoutResponse(value);
        //log('> Battery Level is ' + value.getUint8(0) + '%');
    } catch (error) {
        log('Argh! ' + error);
    }
}

async function getBattery() {
    let textEncoder = new TextEncoder();
    let value = textEncoder.encode(BATTERY_LEVEL);
    await characteristicWrite.writeValueWithoutResponse(value);
}

async function updateDistance() {
    let textEncoder = new TextEncoder();
    let value = textEncoder.encode("green|123|23|234|3");
    await characteristicWrite.writeValueWithoutResponse(value);
}

function logOnScreen() {
    var old = console.log;
    var logger = document.getElementById('log');
    console.log = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == 'object') {
                logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
            } else {
                logger.innerHTML += arguments[i] + '<br />';
            }
        }
    }
}
const handleCharacteristicValueChanged = (event) => {
    let textDecoder = new TextDecoder('utf-8');
    let value = textDecoder.decode(event.target.value)
    log("=>" + value)
    //console.log(event.target.value.getUint8(0) + '%');
};

function log(str) {
    console.log(str);
}
