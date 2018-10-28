import React, { useContext } from 'react'
import { ThemeContext } from './theme'

function Box({
  children,
  backgroundColor = 'primary',
  marginTop = 0,
  marginRight = 0,
  marginLeft = 0,
  marginBottom = 0,
  height,
  width,
  ...rest
}) {
  const theme = useContext(ThemeContext)

  return (
    <div
      style={{
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        height,
        width,
        backgroundColor: theme.color[backgroundColor],
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Box
