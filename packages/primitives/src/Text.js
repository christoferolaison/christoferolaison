import React from 'react'

function Text({
  children,
  align = 'left',
  size = 14,
  weight = 'regular',
  color = '#000000',
}) {
  return (
    <p
      style={{
        color,
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
