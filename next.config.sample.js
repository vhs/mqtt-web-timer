/** @type {import('next').NextConfig} */

const nextConfig = {
  serverRuntimeConfig: {
    mqttUri: 'wss://test.mosquitto.org:8081/mqtt',
    mqttTopic: '/test/vhs/spacebus/status/space/mask-override',
    mqttInterval: 15,
    mqttRunningValue: 'on',
    mqttStoppedValue: 'off',
    ...{}
  },
  publicRuntimeConfig: {
    title: 'Mask Status Control Panel',
    ...{}
  },
  reactStrictMode: true,
  experimental: {
    outputStandalone: true
  }
}

module.exports = nextConfig
