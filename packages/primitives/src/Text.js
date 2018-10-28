import React from 'react'

function Text({ children }) {
  return (
    <span
      style={{
        color: 'pink',
        fontSize: 200,
        fontFamily:
          '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
      }}
    >
      {children}
    </span>
  )
}

export default Text
