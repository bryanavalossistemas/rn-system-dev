import * as SelectPrimitive from '@radix-ui/react-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ComponentProps } from 'react';
import useStore from '@/store';

const COLORS = [
  {
    name: 'Default',
    value: 'default',
  },
  {
    name: 'Indigo',
    value: 'indigo',
  },
  {
    name: 'Lima',
    value: 'lime',
  },
  {
    name: 'Slate',
    value: 'slate',
  },
];

export function ThemeSelector({ ...props }: ComponentProps<typeof SelectPrimitive.Trigger>) {
  const { color, setColor } = useStore();

  return (
    <Select value={color} onValueChange={setColor}>
      <SelectTrigger {...props} size="sm">
        <SelectValue placeholder="Selecciona un tema" />
      </SelectTrigger>
      <SelectContent align="end">
        {COLORS.map((color) => (
          <SelectItem key={color.name} value={color.value}>
            {color.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
