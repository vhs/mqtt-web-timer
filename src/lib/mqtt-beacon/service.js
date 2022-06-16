import getConfig from 'next/config'

import MQTT from 'async-mqtt'
import Debug from 'debug'

const debug = Debug('app:mqtt-beacon:service')

const { serverRuntimeConfig: { mqttUri, mqttTopic, mqttInterval, mqttStoppedValue } } = getConfig()

class MQTTBeaconService {
    static started = false
    static client = null
    static intervalId = null
    static beaconValue = mqttStoppedValue

    static start () {
      debug('start')

      if (!MQTTBeaconService.started) {
        MQTTBeaconService.client = MQTT.connect(mqttUri)

        MQTTBeaconService.client.on('connect', () => {
          MQTTBeaconService.client.subscribe(mqttTopic)
        })

        MQTTBeaconService.intervalId = setInterval(() => MQTTBeaconService.sendBeacon(MQTTBeaconService.getBeaconValue()), (mqttInterval < 1000 ? mqttInterval * 1000 : mqttInterval))

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
