import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { AppStateProvider } from "./state/app/context";
import { TimeStateProvider } from "./state/time/context";
import { QueryStateProvider } from "./state/query/context";
import { SnackbarProvider } from "./context/snackbar";
import AppLayout from "./layouts";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const App = () => {
  return (
    <>
      <HashRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AppStateProvider>
            <TimeStateProvider>
              <QueryStateProvider>
                <SnackbarProvider>
                  <Routes>
                    <Route path="/" element={<AppLayout />} />
                  </Routes>
                </SnackbarProvider>
              </QueryStateProvider>
            </TimeStateProvider>
          </AppStateProvider>
        </LocalizationProvider>
      </HashRouter>
    </>
  );
};

export default App;
