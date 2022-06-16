import { Component } from 'react'

import { Container, Row, Col, Button, Form } from 'react-bootstrap'

import Head from 'next/head'

import Clock from 'src/components/Clock/Clock'

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
    const response = await fetch('/config.json').then(res => res.json())

    console.log('loading config', response)

    this.setState({ ...response })
  }

  async fetchTimer () {
    const response = await fetch('/api/timer').then(res => res.json())

    const { timer } = response

    this.setState({ timer })
  }

  async bumpTimer (hours) {
    const { timer } = this.state

    const baseTimer = timer === false ? Date.now() : timer

    this.updateTimer(baseTimer + hours * 60 * 60 * 1000)
  }

  async setTimer () {
    if (this.state.timeInput === '') return

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
    await fetch('/api/timer', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())

    this.setState({ timer: false, timeInput: '' })
  }

  async updateTimer (timer) {
    console.log('setTimer', 'timer', timer)

    await fetch('/api/timer', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ timer })
    }).then(res => res.json())

    this.setState({ timer })
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
    const { title } = this.state

    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content="{title}" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Container className={styles.container}>
          <Row>
            <Col className="centered">
              <h1 className={styles.title}>{title}</h1>
            </Col>
          </Row>

          <Row>
            <Col className="centered">
              <Clock time={this.state.timer} color="red" />
            </Col>
          </Row>

          <Row>
            <Col className="centered">
              <Clock time={this.state.time} color="green"/>
            </Col>
          </Row>

          <Row>
            <Col>
              <Row className="spacious">
                <Col>
                  <Button variant="primary" onClick={() => this.bumpTimer(1)}>Increase 1 hour</Button>
                </Col>
              </Row>
              <Row className="spacious">
                <Col>
                  <Button variant="primary" onClick={() => this.bumpTimer(3)}>Increase 3 hours</Button>
                </Col>
              </Row>
              <Row className="spacious">
                <Col>
                  <Button variant="primary" onClick={() => this.bumpTimer(6)}>Increase 6 hours</Button>
                </Col>
              </Row>
              <Row className="spacious">
                <Col>
                  <Button variant="primary" onClick={() => this.bumpTimer(8)}>Increase 8 hours</Button>
                </Col>
              </Row>
              <Row className="spacious">
                <Col>
                  <Button variant="primary" onClick={() => this.bumpTimer(12)}>Increase 12 hours</Button>
                </Col>
              </Row>
            </Col>
            <Col style={{ textAlign: 'right' }}>
              <Row>
                <Col>
                  Set end time:
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Control name="timeInput" type="time" value={this.state.timeInput} onChange={this.handleChangeInput} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="primary" className="pull-right" onClick={() => this.setTimer()}>Set</Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="primary" className="pull-right" onClick={() => this.clearTimer()}>Clear</Button>
                </Col>
              </Row>
            </Col>
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
