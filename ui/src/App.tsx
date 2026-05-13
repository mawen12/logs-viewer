import './App.css'
import { Header } from './components/layout/Header'
import { Main } from './components/layout/Main'
import { AppStateProdiver } from './contexts/AppStateProvider'
import { LogsStateProvider } from './contexts/LogsStateProvider'
import { QueryStateProvider } from './contexts/QueryStateProvider'
import { ThemeProvider } from './contexts/ThemeProvider'
import { TimeStateProvider } from './contexts/TimeStateProvider'

function App() {

  return (
    <AppStateProdiver>
      <QueryStateProvider>
        <TimeStateProvider>
          <LogsStateProvider>
            <ThemeProvider>
              <div className="h-screen overflow-hidden flex flex-col">
                <Header/>
                <Main/>
              </div>
            </ThemeProvider>
          </LogsStateProvider>
        </TimeStateProvider>
      </QueryStateProvider>
    </AppStateProdiver>
  )
}

export default App
