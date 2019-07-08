var mosca = require('mosca');
var settings = {
    port: 1883,
    http: {
        port: 8883
    }
};
var server = new mosca.Server(settings); //สร้างตัวแปรมารับค่า server
server.on('ready', setup);	//ใช้คำสั่ง ready,setup เพื่อตั้งค่า
function setup() {
    server.authenticate = authenticate; // ตั้งให้เซิพเวอร์ต้องมี Authen
    console.log('Mosca server is up and running (auth)')
}
var authenticate = function (client, username, password, callback) {
    var authorized = (username === 'mqtt' && password.toString() === 'password');
    var authorized = (username === process.env.MQTT_USERNAME && password.toString() === process.env.MQTT_PASSWORD);
    if (authorized) client.user = username;
    callback(null, authorized);
}
server.on('clientConnected', function (client) {
    console.log('Client Connected:', client.id);
});
server.on('clientDisconnected', function (client) {
    console.log('Client Disconnected:', client.id);
});
server.on('published', function (packet, client) {
    console.log(packet);
    console.log('Published', packet.payload.toString());
});
