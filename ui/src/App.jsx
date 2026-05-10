import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { HashRouter, Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "./context/snackbar";
import { AppThemeProvider } from "./context/theme";
import AppLayout from "./layouts";
import { AppStateProvider } from "./state/app/context";
import { QueryStateProvider } from "./state/query/context";
import { TimeStateProvider } from "./state/time/context";
import Home from "./pages/home/Home";

const App = () => {
  return (
    <>
      <HashRouter>
        <AppThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AppStateProvider>
              <TimeStateProvider>
                <QueryStateProvider>
                  <SnackbarProvider>
                    <Routes>
                      <Route path="/" element={<AppLayout />}>
                        <Route path="/" element={<Home/>} />
                      </Route>
                    </Routes>
                  </SnackbarProvider>
                </QueryStateProvider>
              </TimeStateProvider>
            </AppStateProvider>
          </LocalizationProvider>
        </AppThemeProvider>
      </HashRouter>
    </>
  );
};

export default App;
