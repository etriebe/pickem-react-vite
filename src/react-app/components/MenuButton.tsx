import { ActionIcon, Indicator, type ActionIconProps } from '@mantine/core';

export interface MenuButtonProps extends ActionIconProps {
  showBadge?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function MenuButton({
  showBadge = false,
  ...props
}: MenuButtonProps) {
  return (
    <Indicator size={8} color="red" disabled={!showBadge} offset={6} position="top-end" label="">
      <ActionIcon size="sm" variant="default" {...props} />
    </Indicator>
  );
}
