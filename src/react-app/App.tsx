// src/App.tsx
import '@mantine/core/styles.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import "./App.css";
import AppTheme from "./theme/AppTheme";
import AppRouter from './components/AppRouter';
import { createTheme, MantineProvider } from '@mantine/core';
const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {

  return (
    <>
    <MantineProvider theme={theme}>
      <AppTheme>
        <CssBaseline enableColorScheme />
        <AppRouter />
      </AppTheme>
    </MantineProvider>
    </>
  );
}

export default App;
