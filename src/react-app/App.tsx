// src/App.tsx

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import "./App.css";
import AppTheme from "./theme/AppTheme";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './components/AppRouter';

const queryClient = new QueryClient()

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppTheme>
          <CssBaseline enableColorScheme />
          <AppRouter />
        </AppTheme>
      </QueryClientProvider>
    </>
  );
}

export default App;
