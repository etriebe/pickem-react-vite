import { useMantineColorScheme, Select } from '@mantine/core';
import type { ComponentProps } from 'react';

export default function ColorModeSelect(props: ComponentProps<typeof Select>) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { data, ...rest } = props;

  return (
    <Select
      value={colorScheme}
      onChange={(value) => toggleColorScheme(value as 'light' | 'dark')}
      data={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}
      rightSectionWidth={0}
      {...rest}
    />
  );
}
