import React, { useState } from 'react'
import {
  Text,
  Box,
  ThemeContext,
  lightTheme,
  darkTheme,
} from '@christoferolaison/primitives'

function Index() {
  const [currentTheme, setTheme] = useState(darkTheme)
  return (
    <ThemeContext.Provider value={currentTheme}>
      <Box
        backgroundColor="primary"
        widht="100vw"
        height="100vh"
        onClick={() =>
          setTheme(
            currentTheme === darkTheme
              ? lightTheme
              : darkTheme,
          )
        }
      >
        <Text
          color="secondary"
          size={100}
          weight="bold"
          marginBottom={10}
        >
          Hej!
        </Text>
      </Box>
    </ThemeContext.Provider>
  )
}

export default Index
