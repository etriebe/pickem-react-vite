import { useState } from 'react';
import { Avatar, Group, Select, Text } from '@mantine/core';
import { IconDeviceDesktop, IconDeviceMobile, IconTools, IconPlus } from '@tabler/icons-react';

const companies = [
  { value: 'sitemark-web', label: 'Sitemark-web', description: 'Web app', icon: <IconDeviceDesktop size={16} /> },
  { value: 'sitemark-app', label: 'Sitemark-app', description: 'Mobile application', icon: <IconDeviceMobile size={16} /> },
  { value: 'sitemark-store', label: 'Sitemark-Store', description: 'Web app', icon: <IconDeviceDesktop size={16} /> },
  { value: 'sitemark-admin', label: 'Sitemark-Admin', description: 'Web app', icon: <IconTools size={16} /> },
  { value: 'add-product', label: 'Add product', description: 'Web app', icon: <IconPlus size={16} /> },
];

export default function SelectContent() {
  const [company, setCompany] = useState('sitemark-web');

  return (
    <Select
      label="Company"
      value={company}
      onChange={(value) => setCompany(value ?? company)}
      data={companies.map((item) => ({
        value: item.value,
        label: item.label,
        description: item.description,
      }))}
      itemComponent={({ label, description, ...others }) => (
        <div {...others}>
          <Group noWrap>
            <Avatar radius="xl" size="sm">
              {companies.find((item) => item.value === others.value)?.icon}
            </Avatar>
            <div>
              <Text>{label}</Text>
              <Text size="xs" color="dimmed">
                {description}
              </Text>
            </div>
          </Group>
        </div>
      )}
      maxDropdownHeight={280}
      searchable
      nothingFound="No companies"
      withinPortal
    />
  );
}
