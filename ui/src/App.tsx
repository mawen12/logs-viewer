import { Toaster } from 'sonner';
import { NavigationProgress } from './components/navigation-progress';
import { TooltipProvider } from './components/ui/tooltip';
import { SnackbarProvider } from './contexts/snackbar-provider';
import { ThemeProvider } from './contexts/theme-provider';
import { LogsProvider } from './features/home/components/logs-provider';
import { AppSidebar } from './components/layout/app-sidebar';
import { AuthenticatedLayout } from './components/layout/authenticated-layout';

function App() {

  return (
    // <WebsocketProvider>
    <ThemeProvider>
      <TooltipProvider>
        <SnackbarProvider>
          <NavigationProgress />
          <Toaster richColors duration={2500} position="top-right" />
          <LogsProvider>
            <AuthenticatedLayout>
              <AppSidebar />
            </AuthenticatedLayout>
          </LogsProvider>
        </SnackbarProvider>
      </TooltipProvider>
    </ThemeProvider>
    // </WebsocketProvider>
  )
}

export default App
