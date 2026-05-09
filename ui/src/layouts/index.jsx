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

const AppLayout = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
      }}
    >
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Logs-Viewer
          </Typography>
          <Stack direction="row" spacing={2}>
            <TimeSelector />
            <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
              <SettingsIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppLayout;
