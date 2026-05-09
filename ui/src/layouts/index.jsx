import ContrastIcon from "@mui/icons-material/Contrast";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import TimeSelector from "./components/TimeSelector";
import { useAppTheme } from "../context/theme";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  const { toggleTheme } = useAppTheme();

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Logs-Viewer
          </Typography>
          <Stack direction="row" spacing={2}>
            <TimeSelector />
            <IconButton
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
              onClick={toggleTheme}
            >
              <ContrastIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <div style={{flexGrow: 1, overflow: 'hidden'}}>
      <Outlet />
      </div>
      
    </Box>
  );
};

export default AppLayout;
