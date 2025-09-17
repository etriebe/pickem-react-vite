import * as React from 'react';
import { MantineProvider, type MantineThemeOverride } from '@mantine/core';
import { IconArrowsSort } from '@tabler/icons-react';
import { brand, gray, red, green, orange, typography, shape } from './themePrimitives';

interface AppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
  themeComponents?: Record<string, unknown>;
}

function mapColorRangeToArray(range: Record<string, string>) {
  // Mantine expects an array of 10 color stops (index 0..9). Our MUI ranges use 50..900.
  const arr = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => range[n]);
  return arr as [string, string, string, string, string, string, string, string, string, string];
}

function getInitialColorScheme(): 'light' | 'dark' {
  try {
    const attr = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-mui-color-scheme') : null;
    if (attr === 'dark') return 'dark';
  } catch (e) {
    // ignore
  }
  return 'light';
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme } = props;

  const initialScheme = React.useMemo(getInitialColorScheme, []);

  if (disableCustomTheme) return <>{children}</>;

  const mantineTheme: MantineThemeOverride = {
    colorScheme: initialScheme,
    primaryColor: 'brand',
    colors: {
      brand: mapColorRangeToArray(brand as unknown as Record<string, string>),
      gray: mapColorRangeToArray(gray as unknown as Record<string, string>),
      red: mapColorRangeToArray(red as unknown as Record<string, string>),
      green: mapColorRangeToArray(green as unknown as Record<string, string>),
      orange: mapColorRangeToArray(orange as unknown as Record<string, string>),
    },
    fontFamily: typography.fontFamily,
    headings: {
      fontFamily: typography.fontFamily,
      sizes: {
        h1: { fontSize: (typography as any).h1?.fontSize, lineHeight: (typography as any).h1?.lineHeight, fontWeight: (typography as any).h1?.fontWeight },
        h2: { fontSize: (typography as any).h2?.fontSize, lineHeight: (typography as any).h2?.lineHeight, fontWeight: (typography as any).h2?.fontWeight },
        h3: { fontSize: (typography as any).h3?.fontSize, lineHeight: (typography as any).h3?.lineHeight, fontWeight: (typography as any).h3?.fontWeight },
        h4: { fontSize: (typography as any).h4?.fontSize, lineHeight: (typography as any).h4?.lineHeight, fontWeight: (typography as any).h4?.fontWeight },
        h5: { fontSize: (typography as any).h5?.fontSize, lineHeight: (typography as any).h5?.lineHeight, fontWeight: (typography as any).h5?.fontWeight },
        h6: { fontSize: (typography as any).h6?.fontSize, lineHeight: (typography as any).h6?.lineHeight, fontWeight: (typography as any).h6?.fontWeight },
      },
    },
  defaultRadius: (shape as any)?.borderRadius ?? 8,
    // Component style overrides - provide reasonable parity with previous MUI theme customizations
    components: {
      Button: {
        styles: (theme) => ({
          root: {
            boxShadow: 'none',
            borderRadius: `${(shape as any)?.borderRadius ?? 8}px`,
            textTransform: 'none',
            padding: '8px 12px',
            // basic hover/active subtle mapping
            '&:hover': { transform: 'translateY(-1px)' },
          },
          leftIcon: { marginRight: 8 },
          // size mapping to roughly match previous small/medium sizes
          root_sm: {
            height: 36,
            padding: '8px 12px',
          },
          root_md: {
            height: 40,
          },
          // outline variant styling
          outline: {
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[2]}`,
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
          },
          // approximate contained / filled primary mapping
          filled: {
            ...theme.fn.variant({ color: 'brand', variant: 'filled' }),
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
            '&:hover': { boxShadow: 'none' },
          },
          // subtle/text-like mapping
          subtle: {
            color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[7],
            backgroundColor: 'transparent',
            '&:hover': { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[1] },
          },
        }),
      },
      ActionIcon: {
        styles: (theme) => ({
          root: {
            boxShadow: 'none',
            borderRadius: `${(shape as any)?.borderRadius ?? 8}px`,
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[2]}`,
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
            '&:hover': {
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[1],
            },
          },
          // sizes
          root_sm: { width: 36, height: 36 },
          root_md: { width: 40, height: 40 },
        }),
      },
      // Provide an IconButton alias so theme customizations that referenced MUI IconButton
      // can be approximated via Mantine's ActionIcon styling
      IconButton: {
        styles: (theme) => ({
          root: {
            boxShadow: 'none',
            borderRadius: `${(shape as any)?.borderRadius ?? 8}px`,
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[2]}`,
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
            '&:hover': { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[1] },
          },
          root_sm: { width: 36, height: 36 },
          root_md: { width: 40, height: 40 },
        }),
      },
      Checkbox: {
        styles: (theme) => ({
          input: {
            width: 16,
            height: 16,
            borderRadius: 5,
          },
          root: {
            margin: 6,
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[2]}`,
            backgroundColor: 'transparent',
          },
          // checked state styling (approximate) via data attribute
          label: {
            '&[data-checked]': {
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.brand[5] : theme.colors.brand[5],
              borderColor: theme.colorScheme === 'dark' ? theme.colors.brand[5] : theme.colors.brand[5],
            },
          },
        }),
      },
      TextInput: {
        styles: (theme) => ({
          input: {
            padding: '8px 12px',
            borderRadius: `${(shape as any)?.borderRadius ?? 8}px`,
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[2]}`,
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
            '&::placeholder': { opacity: 0.7, color: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[5] },
          },
          label: {
            marginBottom: 8,
            fontSize: theme.fontSizes.xs,
          },
        }),
      },
      PasswordInput: {
        styles: (theme) => ({
          input: {
            padding: '8px 12px',
            borderRadius: `${(shape as any)?.borderRadius ?? 8}px`,
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[2]}`,
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
          },
          label: { marginBottom: 8, fontSize: theme.fontSizes.xs },
        }),
      },
      Select: {
        defaultProps: {
          // Use the same sort icon used previously in MUI navigation theme
          icon: <IconArrowsSort size={16} />,
        },
        styles: (theme) => ({
          input: {
            padding: '8px 12px',
            borderRadius: `${(shape as any)?.borderRadius ?? 8}px`,
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[2]}`,
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
          },
          dropdown: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[2]}`,
            boxShadow: theme.colorScheme === 'dark' ? '0 8px 30px rgba(0,0,0,0.6)' : '0 8px 30px rgba(16,24,40,0.06)'
          },
          item: { padding: '8px', '&[data-hovered]': { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[1] } },
        }),
      },
      // Map toggle groups to SegmentedControl styling (approximate)
      SegmentedControl: {
        styles: (theme) => ({
          root: {
            borderRadius: `${(shape as any)?.borderRadius ?? 8}px`,
            boxShadow: theme.colorScheme === 'dark' ? '0 4px 16px rgba(0,0,0,0.5)' : '0 4px 16px rgba(16,24,40,0.06)',
          },
          control: {
            padding: '8px 12px',
          },
        }),
      },
      Card: {
        styles: (theme) => ({
          root: {
            padding: 16,
            gap: 16,
            transition: 'all 120ms ease',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
            borderRadius: `${(shape as any)?.borderRadius ?? 8}px`,
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[2]}`,
            boxShadow: 'none',
          },
        }),
      },
      Menu: {
        styles: (theme) => ({
          dropdown: {
            background: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[2]}`,
            boxShadow: theme.colorScheme === 'dark' ? '0 8px 30px rgba(0,0,0,0.6)' : '0 8px 30px rgba(16,24,40,0.06)'
          },
          item: { padding: '8px', borderRadius: 8 },
        }),
      },
      // Anchor (Link) styling to mirror MUI Link customizations
      Anchor: {
        defaultProps: {
          // Mantine Anchor uses underline by default; keep it none-like via styles
        },
        styles: (theme) => ({
          root: {
            color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[9],
            fontWeight: 500,
            position: 'relative',
            textDecoration: 'none',
            width: 'fit-content',
            '&::before': {
              content: "''",
              position: 'absolute',
              width: '100%',
              height: '1px',
              bottom: 0,
              left: 0,
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[5],
              opacity: 0.3,
              transition: 'width 0.3s ease, opacity 0.3s ease',
            },
            '&:hover::before': {
              width: 0,
            },
            '&:focus-visible': {
              outline: `3px solid ${brand[500] ? brand[500] : theme.colors.brand ? theme.colors.brand[5] : 'rgba(0,0,0,0.12)'}`,
              outlineOffset: '4px',
              borderRadius: 2,
            },
          },
        }),
      },
      // Drawer background mapping (matches MUI drawer.paper)
      Drawer: {
        styles: (theme) => ({
          drawer: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
          },
        }),
      },
      // Pagination item styling to reflect selected state mapping from MUI
      Pagination: {
        styles: (theme) => ({
          item: {
            '&[data-active]': {
              color: theme.colorScheme === 'dark' ? 'black' : 'white',
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[9],
            },
          },
        }),
      },
      Tabs: {
        styles: (theme) => ({
          tab: {
            padding: '6px 8px',
            marginBottom: 8,
            textTransform: 'none',
            borderRadius: `${(shape as any)?.borderRadius ?? 8}px`,
            ':hover': { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[1] },
          },
          tabActive: { color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[9] },
        }),
      },
      Chip: {
        styles: (theme) => ({
          root: {
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[2]}`,
            borderRadius: 999,
            padding: '2px 8px',
          },
        }),
      },
    },
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={mantineTheme}>
      {children}
    </MantineProvider>
  );
}
