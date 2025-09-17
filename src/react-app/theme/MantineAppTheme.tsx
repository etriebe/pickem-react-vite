import * as React from 'react';
import { MantineProvider } from '@mantine/core';

interface MantineAppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
}

export default function MantineAppTheme({ children, disableCustomTheme }: MantineAppThemeProps) {
  // Keep this minimal for now — primary goal is to provide MantineProvider for global styles and color scheme
  if (disableCustomTheme) return <>{children}</>;

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'light' }}>
      {children}
    </MantineProvider>
  );
}
