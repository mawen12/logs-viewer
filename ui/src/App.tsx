import './App.css'
import { Header } from './components/layout/Header'
import { Main } from './components/layout/Main'
import { ScrollArea } from './components/ui/scroll-area'
import { TooltipProvider } from './components/ui/tooltip'
import { SnackbarProvider } from './contexts/SnackbarProvider'
import { ThemeProvider } from './contexts/ThemeProvider'

function App() {

  return (
    <ThemeProvider>
      <TooltipProvider>
        <SnackbarProvider>
          <ScrollArea className="h-screen overflow-auto flex flex-col">
            <Header />
            <Main />
          </ScrollArea>
        </SnackbarProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
