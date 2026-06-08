
import { useContext } from "react";
import { ThemeContext } from "./ContextTheme";

export function useTheme() {

 const context = useContext(ThemeContext)

  if(context === undefined) {
    throw new Error("UseTheme must be used within ThemeProvider")
  }

  return context;
}