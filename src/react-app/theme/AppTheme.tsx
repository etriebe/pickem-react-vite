import { ReactNode, useMemo } from 'react';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

const brand = [
  'hsl(210, 100%, 95%)',
  'hsl(210, 100%, 92%)',
  'hsl(210, 100%, 80%)',
  'hsl(210, 100%, 65%)',
  'hsl(210, 98%, 48%)',
  'hsl(210, 98%, 42%)',
  'hsl(210, 98%, 55%)',
  'hsl(210, 100%, 35%)',
  'hsl(210, 100%, 16%)',
  'hsl(210, 100%, 21%)',
] as const;

export default function AppTheme(props: { children: ReactNode }) {
  const { children } = props;
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const theme = useMemo(
    () => ({
      colorScheme,
      fontFamily: 'Roboto, Helvetica, Arial, Inter, sans-serif',
      primaryColor: 'brand',
      defaultRadius: 8,
      colors: {
        brand: brand as [string, string, string, string, string, string, string, string, string, string],
      },
      headings: {
        fontFamily: 'Roboto, Helvetica, Arial, Inter, sans-serif',
        fontWeight: 600,
      },
    }),
    [colorScheme],
  );

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={theme}
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
