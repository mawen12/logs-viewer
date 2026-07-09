import { Toaster } from 'sonner';
import { NavigationProgress } from './components/navigation-progress';
import { TooltipProvider } from './components/ui/tooltip';
import { SnackbarProvider } from './contexts/snackbar-provider';
import { ThemeProvider } from './contexts/theme-provider';
import { Home } from './features/home';
import { Layout } from './components/layout/layout';

function App() {

  return (
    // <WebsocketProvider>
      <ThemeProvider>
        <TooltipProvider>
          <SnackbarProvider>
            <NavigationProgress />
            <Toaster richColors duration={2500} position="top-right" />
            <Layout>
              <Home/>
            </Layout>
          </SnackbarProvider>
        </TooltipProvider>
      </ThemeProvider>
    // </WebsocketProvider>
  )
}

export default App
