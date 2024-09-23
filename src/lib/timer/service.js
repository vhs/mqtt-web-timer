import Debug from 'debug'

const debug = Debug('app:timer:service')

class TimerService {
    static timer = null
    static intervalId = null
    static localId = Math.round(Math.random() * 1000000000)

    static start() {
        debug('start')
        return setInterval(TimerService.runner, 1000)
    }

    static stop() {
        debug('stop')
        return TimerService.intervalId != null
            ? clearInterval(TimerService.intervalId)
            : false
    }

    static getTimer() {
        debug('getTimer')
        return TimerService.timer?.time != null
            ? TimerService.timer.time
            : false
    }

    static removeTimer() {
        debug('removeTimer')
        if (TimerService.timer?.callback != null) TimerService.timer.callback()

        TimerService.timer = null
    }

    static setTimer(time, callback) {
        debug('setTimer', 'time:', time)
        callback = callback || function () {}

        TimerService.timer = {
            time,
            callback
        }

        return true
    }

    static runner() {
        if (
            TimerService.timer?.time != null &&
            TimerService.timer.time <= Date.now()
        ) {
            debug('runner', 'TIME!')
            TimerService.removeTimer()
        }
    }
}

if (global.TimerServiceInstance == null) {
    global.TimerServiceInstance = TimerService
    global.TimerServiceInstance.start()
}

const TimerServiceInstance = global.TimerServiceInstance

export default TimerServiceInstance
