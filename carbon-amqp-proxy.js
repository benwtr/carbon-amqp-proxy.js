var configFile = './config.js';
var config = {};

var util = require('util')
  , net = require('net')
  , amqp = require('amqp')
  , fs = require('fs')

try {
  config = require(configFile);
}
catch(e) {
  util.log("Could not parse config file.\n" + e.stack);
}

var payload = "";
var server = net.createServer(function (s) {
  s.on('data', function(data) {
    lines = data.toString().split(/\n|\r/);
    for (var i = 0; i < lines.length; i++) {
      var d = lines[i];
      if (d.match(/^$/)) {
        continue;
      }
      if (d.match(/^[a-zA-Z0-9\-\._]+ \d*\.?\d* \d+\s*$/)) {
        payload += d + "\n";
      } else if (d.match(/^[a-zA-Z0-9\-\._]+ \d*\.?\d*\s*$/)) {
        ts = Math.round(new Date().getTime() / 1000);
        payload += d + " " + ts + "\n";
      } else {
        if (config.debug) {
          util.log("bad metric line received: " + d + "\n");
        }
      }
    }
  })
});
server.listen(config.port, config.listen);

connection = amqp.createConnection(config.amqpOptions);
connection.on('ready', function() {
  connection.exchange(config.amqpExchange, { passive: 'true' }, function(exchange) { 
    setInterval(function() {
      if (payload != "") {
        if (config.debug) {
          util.log("Payload:\n" + util.inspect(payload));
        }
        if (config.amqpMetricNameInBody) {
          exchange.publish("", payload); 
        } else {
          util.log("Metric name as routing key not implemented");
        }
        payload = ""; 
      }
    }, config.flushInterval || 1000);
  });
});

