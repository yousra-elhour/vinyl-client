"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Option {
  label: string;
  value: string;
}

interface SelectMenuProps {
  label: string;
  options: Option[];
}

function SelectMenu({ label, options }: SelectMenuProps) {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder={label.toUpperCase()} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label.toUpperCase()}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectMenu;
