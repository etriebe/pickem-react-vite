import { Select } from '@mantine/core';
import useColorScheme from './useColorScheme';

export default function ColorModeSelect(props: any) {
  const { mode, setMode } = useColorScheme();
  if (!mode) return null;

  return (
    <Select
      data={[
        { value: 'system', label: 'System' },
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ]}
      value={mode}
  onChange={(val: string | null) => val && setMode(val as any)}
      sx={{ minWidth: 120 }}
      {...props}
    />
  );
}
