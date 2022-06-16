import getConfig from 'next/config'

import TimerService from 'src/lib/timer/service'
import MQTTBeaconService from 'src/lib/mqtt-beacon/service'

const { serverRuntimeConfig: { mqttRunningValue, mqttStoppedValue } } = getConfig()

export default function handler (req, res) {
  const { method } = req
  const { timer } = (typeof req.body === 'string' && req.body !== '') ? JSON.parse(req.body) : req.body ?? {}

  switch (method) {
    case 'GET':
      break
    case 'PUT':
      MQTTBeaconService.setBeaconValue(mqttRunningValue)
      TimerService.setTimer(timer, () => MQTTBeaconService.setBeaconValue(mqttStoppedValue))
      break
    case 'DELETE':
      MQTTBeaconService.setBeaconValue(mqttStoppedValue)
      TimerService.removeTimer()
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
      return
  }

  res.status(200).json({ timer: TimerService.getTimer() })
}
