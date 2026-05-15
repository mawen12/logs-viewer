import './App.css'
import { Header } from './components/layout/Header'
import { Main } from './components/layout/Main'
import { ScrollArea } from './components/ui/scroll-area'
import { TooltipProvider } from './components/ui/tooltip'
import { ThemeProvider } from './contexts/ThemeProvider'

function App() {

  return (
    <ThemeProvider>
      <TooltipProvider>
        <ScrollArea className="h-screen overflow-auto flex flex-col">
          <Header />
          <Main />
        </ScrollArea>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
