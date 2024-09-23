import React from 'react'
import PropTypes from 'prop-types'
import styles from './Clock.module.css'

const Clock = ({ time, color }) => {
    if (time == null || time === false) {
        return <div className={styles.Clock}>__:__</div>
    }

    const date = new Date(time)

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return (
        <div className={styles.Clock} style={{ color }}>
            {hours}:{minutes}
        </div>
    )
}

Clock.propTypes = {
    time: PropTypes.any.isRequired,
    color: PropTypes.string
}

Clock.defaultProps = {}

export default Clock
