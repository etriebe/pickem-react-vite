import { Indicator, ActionIcon } from '@mantine/core';
import type { ActionIconProps } from '@mantine/core';

export interface MenuButtonProps extends ActionIconProps {
  showBadge?: boolean;
}

export default function MenuButton({ showBadge = false, children, ...props }: MenuButtonProps) {
  return (
    <Indicator inline position="top-end" offset={4} color="red" disabled={!showBadge} size={8}>
      <ActionIcon size="sm" {...props}>
        {children}
      </ActionIcon>
    </Indicator>
  );
}
