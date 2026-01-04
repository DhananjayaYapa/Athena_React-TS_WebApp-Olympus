import React, { useState } from 'react'

// The status label component of the leave table
const StatusLabel: React.FC<{
  status: string
}> = (props) => {
  const [statusClass] = useState(props.status.toLowerCase().trim())

  if (props.status.toLowerCase().trim() === 'disabled') {
    return <span className={`statusChip disabled`}>{props.status}</span>
  } else {
    return <span className={`statusChip ${statusClass}`}>{props.status}</span>
  }
}

export default StatusLabel
