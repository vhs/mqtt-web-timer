import MQTT from 'async-mqtt'
import Debug from 'debug'

const debug = Debug('app:mqtt-beacon:service')

const mqttUri = process.env.MQTT_URI ?? 'wss://test.mosquitto.org:8081/mqtt'
const mqttTopic = process.env.MQTT_TOPIC ?? '/test/vhs/spacebus/status/space/mask-override'
const mqttInterval = (process.env.MQTT_INTERVAL != null) ? parseInt(process.env.MQTT_INTERVAL) : 1
const mqttStoppedValue = process.env.MQTT_STOPPED_VALUE ?? 'off'

class MQTTBeaconService {
    static started = false
    static client = null
    static intervalId = null
    static beaconValue = mqttStoppedValue

    static start () {
      debug('start')

      if (!MQTTBeaconService.started) {
        debug('start', 'Connecting to', mqttUri)
        MQTTBeaconService.client = MQTT.connect(mqttUri)

        MQTTBeaconService.client.on('connect', () => {
          debug('start', 'Subscribing to', mqttTopic)
          MQTTBeaconService.client.subscribe(mqttTopic)
        })

        MQTTBeaconService.intervalId = setInterval(() => MQTTBeaconService.sendBeacon(), (mqttInterval < 1000 ? mqttInterval * 1000 : mqttInterval))

        MQTTBeaconService.started = true
      }
    }

    static stop () {
      debug('stop')
      MQTTBeaconService.client.end()
      clearInterval(MQTTBeaconService.intervalId)
      MQTTBeaconService.started = false
      MQTTBeaconService.client = null
      MQTTBeaconService.intervalId = null
    }

    static getBeaconValue () {
      return MQTTBeaconService.beaconValue
    }

    static setBeaconValue (value) {
      MQTTBeaconService.beaconValue = value
      MQTTBeaconService.sendBeacon(value)
    }

    static sendBeacon (value) {
      value = value ?? MQTTBeaconService.getBeaconValue()

      if (value != null && MQTTBeaconService.client != null) {
        debug('publish', MQTTBeaconService.beaconValue)
        MQTTBeaconService.client.publish(mqttTopic, value)
      }
    }
}

if (global.MQTTBeaconServiceInstance == null) {
  global.MQTTBeaconServiceInstance = MQTTBeaconService
  global.MQTTBeaconServiceInstance.start()
}

const MQTTBeaconServiceInstance = global.MQTTBeaconServiceInstance

export default MQTTBeaconServiceInstance
