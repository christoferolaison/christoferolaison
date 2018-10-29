import React, { useContext } from 'react'
import systemFont from '@christoferolaison/system-font'
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
  lineHeight = 1.25,
}) {
  const theme = useContext(ThemeContext)

  return (
    <p
      style={{
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        lineHeight,
        fontSize: size,
        textAlign: align,
        fontWeight: weight,
        fontFamily: systemFont,
        color: theme.color[color],
      }}
    >
      {children}
    </p>
  )
}

export default Text
