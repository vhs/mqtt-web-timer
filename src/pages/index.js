import { Component } from 'react'

import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import Head from 'next/head'

import Clock from 'src/components/Clock/Clock'

import 'react-toastify/dist/ReactToastify.css'

import styles from 'src/styles/Home.module.css'

export default class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      timer: false,
      time: false,
      timeInput: ''
    }
  }

  componentDidMount () {
    this.loadConfig()
    this.fetchTimerIntervalId = setInterval(() => this.fetchTimer(), 5000)
    this.updateTimeIntervalId = setInterval(() => this.updateTime(), 1000)
  }

  componentWillUnmount () {
    clearInterval(this.fetchTimerIntervalId)
    clearInterval(this.updateTimeIntervalId)
  }

  async loadConfig () {
    try {
      const response = await fetch('/config.json').then(res => res.json())

      console.log('loading config', response)

      this.setState({ ...response })
    } catch (e) {
      console.log('error loading config', e)
      setTimeout(() => this.loadConfig(), 1000)
    }
  }

  async fetchTimer () {
    try {
      const response = await fetch('/api/timer').then(res => res.json())

      const { timer } = response

      this.setState({ timer })
    } catch (e) {
      console.log('error fetching timer', e)
    }
  }

  async bumpTimer (hours) {
    const { timer } = this.state

    const baseTimer = timer === false ? Date.now() : timer

    this.updateTimer(baseTimer + hours * 60 * 60 * 1000)
  }

  async setTimer () {
    if (this.state.timeInput === '') {
      toast.error('Please enter a time')
      return
    }

    const localTime = new Date()

    const [hours, minutes] = this.state.timeInput.split(':').map((x) => parseInt(x))

    if (hours < localTime.getHours()) {
      localTime.setDate(localTime.getDate() + 1)
    }

    localTime.setHours(hours)
    localTime.setMinutes(minutes)

    this.updateTimer(localTime.valueOf())
  }

  async clearTimer (timer) {
    try {
      await fetch('/api/timer', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())

      this.setState({ timer: false, timeInput: '' })

      toast.success('Timer cleared')
    } catch (e) {
      toast.error('An error occurred clearing the timer')
    }
  }

  async updateTimer (timer) {
    try {
      const response = await fetch('/api/timer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ timer })
      }).then(res => res.json())

      this.setState({ timer: response.timer })

      toast.success('Timer has been set to ' + new Date(timer).toLocaleTimeString())
    } catch (e) {
      toast.error('An error occurred updating the timer')
    }
  }

  async updateTime () {
    this.setState({ time: Date.now() })
  }

  handleChangeInput = (event) => {
    const { name, value, type, checked } = event.target

    type === 'checkbox'
      ? this.setState({ [name]: checked })
      : this.setState({ [name]: value })
  }

  render () {
    const { title, instructions } = this.state

    return (
      <>
        <ToastContainer />

        <Head>
          <title>{title}</title>
          <meta name="description" content="{title}" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Container className={styles.container}>
          <Row>
            <Col></Col>
            <Col className="centered" md={7}>

              <Row>
                <Col className="centered">
                  <h2 className={styles.title}>{title}</h2>
                 <p className={styles.instructions}>{instructions}</p>
                </Col>
              </Row>

              <Row>
                <Col className="centered">
                  Current time:<br />
                  <Clock time={this.state.time} color="green"/>
                </Col>
              </Row>

              <Row>
                <Col className="centered">
                  Set until:<br />
                  <Clock time={this.state.timer} color="red" />
                </Col>
              </Row>

              <Row>
                <Col></Col>
                <Col md={8}>
                  <Row>
                    <Col>
                      Set end time:
                    </Col>
                  </Row>
                  <Row className="spacious">
                    <Col>
                      <Form.Control className={styles.timeInput} name="timeInput" type="time" value={this.state.timeInput} onChange={this.handleChangeInput} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button className={styles.setButton} variant="primary" onClick={() => this.setTimer()}>Set</Button>
                      &nbsp;
                      <Button className={styles.clearButton} variant="primary" onClick={() => this.clearTimer()}>Clear</Button>
                    </Col>
                  </Row>
                </Col>
                <Col></Col>
              </Row>

              <Row>
                <Col>
                  <Row className="spacious">
                    <Col className="centered">
                      <p className={styles.bumpInstructions}>If you need the time extended, click one of the buttons below.</p>
                    </Col>
                  </Row>
                  <Row className="spacious">
                    <Col xs={6}>
                      <Button className={styles.increaseButton} variant="primary" onClick={() => this.bumpTimer(1)}>Increase&nbsp;1&nbsp;hour</Button>
                    </Col>
                    <Col xs={6}>
                      <Button className={styles.increaseButton} variant="primary" onClick={() => this.bumpTimer(3)}>Increase&nbsp;3&nbsp;hours</Button>
                    </Col>
                    <Col xs={6}>
                      <Button className={styles.increaseButton} variant="primary" onClick={() => this.bumpTimer(6)}>Increase&nbsp;6&nbsp;hours</Button>
                    </Col>
                    <Col xs={6}>
                      <Button className={styles.increaseButton} variant="primary" onClick={() => this.bumpTimer(8)}>Increase&nbsp;8&nbsp;hours</Button>
                    </Col>
                  </Row>
                </Col>

              </Row>

            </Col>
            <Col></Col>
          </Row>

        </Container>
      </>
    )
  }
}

export async function getStaticProps (context) {
  return {
    props: {} // will be passed to the page component as props
  }
}
