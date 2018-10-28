import React from 'react'

function Text({
  children,
  align = 'left',
  size = 14,
  weight = 'regular',
  color = '#000000',
  marginTop = 0,
  marginRight = 0,
  marginLeft = 0,
  marginBottom = 0,
}) {
  return (
    <p
      style={{
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
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
