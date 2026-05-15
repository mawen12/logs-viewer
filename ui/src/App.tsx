import './App.css'
import { Header } from './components/layout/Header'
import { Main } from './components/layout/Main'
import { TooltipProvider } from './components/ui/tooltip'
import { ThemeProvider } from './contexts/ThemeProvider'

function App() {

  return (
    <ThemeProvider>
      <TooltipProvider>
        <div className="h-screen overflow-auto flex flex-col">
          <Header />
          <Main />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
