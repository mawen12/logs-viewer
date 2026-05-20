import './App.css'
import { Header } from './components/layout/Header'
import { Main } from './components/layout/Main'
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
            <div className="h-screen overflow-auto flex flex-col">
              <Header />
              <Main />
            </div>
          </SnackbarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </WebsocketProvider>
  )
}

export default App
