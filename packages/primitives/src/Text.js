import React, { useContext } from 'react'
import { ThemeContext } from './theme'

function Text({
  children,
  align = 'left',
  size = 14,
  weight = 'regular',
  color = 'primary',
  marginTop = 0,
  marginRight = 0,
  marginLeft = 0,
  marginBottom = 0,
}) {
  const theme = useContext(ThemeContext)

  return (
    <p
      style={{
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        color: theme.color[color],
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
