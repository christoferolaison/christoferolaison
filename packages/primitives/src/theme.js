import { createContext } from 'react'

export const darkTheme = {
  color: {
    primary: '#000000',
    secondary: '#ffffff',
  },
}

export const lightTheme = {
  color: {
    primary: '#ffffff',
    secondary: '#000000',
  },
}

export const ThemeContext = createContext(lightTheme)
