import React from 'react'

function Text({ children }) {
  return (
    <span
      style={{
        color: 'gold',
        fontFamily:
          '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
      }}
    >
      {children}
    </span>
  )
}

export default Text
