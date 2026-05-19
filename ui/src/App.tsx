import './App.css'
import { Header } from './components/layout/Header'
import { Main } from './components/layout/Main'
import { ScrollArea } from './components/ui/scroll-area'
import { TooltipProvider } from './components/ui/tooltip'
import { SnackbarProvider } from './contexts/SnackbarProvider'
import { ThemeProvider } from './contexts/ThemeProvider'
import { WebsocketProvider } from './contexts/WebsocketProvider'

function App() {

  return (
    <WebsocketProvider>
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
    </WebsocketProvider>
  )
}

export default App
