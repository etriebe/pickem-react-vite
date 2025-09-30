// src/App.tsx

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import "./App.css";
import AppTheme from "./theme/AppTheme";
import AppRouter from './components/AppRouter';


function App() {

  return (
    <>
      <AppTheme>
        <CssBaseline enableColorScheme />
        <AppRouter />
      </AppTheme>
    </>
  );
}

export default App;
