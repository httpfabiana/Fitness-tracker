import { useEffect, useState} from 'react'
import { ThemeContext } from './ContextTheme';



export function ThemeProvider({ children }: { children: React.ReactNode}) {
  
  const temaSalvo = localStorage.getItem("theme");

  const [theme, setTheme] = useState(temaSalvo ? temaSalvo : "light")

  useEffect(() => {
    const html = document.documentElement;

    html.classList.remove("light")
    html.classList.remove("dark")

    html.classList.add(theme)

    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      { children }
    </ThemeContext.Provider>
  )
}
