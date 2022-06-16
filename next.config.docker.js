/** @type {import('next').NextConfig} */

const { MQTT_URI, MQTT_TOPIC, MQTT_INTERVAL, MQTT_RUNNING_VALUE, MQTT_STOPPED_VALUE, WEB_TITLE } = process.env

const nextConfig = {
  serverRuntimeConfig: {
    mqttUri: MQTT_URI ?? 'wss://test.mosquitto.org:8081/mqtt',
    mqttTopic: MQTT_TOPIC ?? '/test/vhs/spacebus/status/space/mask-override',
    mqttInterval: (MQTT_INTERVAL != null) ? parseInt(MQTT_INTERVAL) : 15,
    mqttRunningValue: MQTT_RUNNING_VALUE ?? 'on',
    mqttStoppedValue: MQTT_STOPPED_VALUE ?? 'off',
    ...{}
  },
  publicRuntimeConfig: {
    title: WEB_TITLE ?? 'Mask Status Control Panel',
    ...{}
  },
  reactStrictMode: true,
  experimental: {
    outputStandalone: true
  }
}

module.exports = nextConfig
