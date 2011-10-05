var config = { 
  'listen': 'localhost'
, 'port': 2003
, 'flushInterval': 1000
, 'amqpExchange': 'graphite'
, 'amqpMetricNameInBody': true
, 'amqpOptions': {
    'host': 'localhost'
  , 'port': 5672
  , 'login': 'guest'
  , 'password': 'guest'
  , 'vhost': '/'
  }
, 'debug': false
} 
module.exports = config;
