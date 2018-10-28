import React from 'react'

function Text({
  children,
  align = 'left',
  size = 14,
  weight = 'regular',
}) {
  return (
    <p
      style={{
        color: '#000000',
        fontSize: size,
        textAlign: align,
        fontWeight: weight,
        fontFamily:
          '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
      }}
    >
      {children}
    </p>
  )
}

export default Text
