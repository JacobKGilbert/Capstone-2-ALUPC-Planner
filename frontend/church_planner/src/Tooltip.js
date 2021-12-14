import { useEffect, useRef } from 'react'
import { Tooltip } from 'bootstrap'
import { FontAwesomeIcon }  from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

const MyTooltip = () => {
  const tooltipRef = useRef()

  useEffect(() => {
    new Tooltip(tooltipRef.current, {
      title: 'One day: Select the same day twice. Multiple days: Select start and end date.',
      placement: 'left',
    })
  })

  return (
    <span ref={tooltipRef}>
      <FontAwesomeIcon icon={faCircleInfo} />
    </span>
  )
}

export default MyTooltip