"use client";

import { ReactNode, useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

import {
  CommandResponsiveDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "./ui/command";

interface Props {
  options: Array<{
    id: string;
    value: string;
    children: ReactNode;
  }>;

  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;

  value: string;

  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  className,
}: Props) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          "h-9 w-full justify-between px-3 font-normal",
          !selectedOption && "text-muted-foreground",
          className
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOption?.children ?? placeholder}
        </div>

        <ChevronsUpDownIcon className="size-4 opacity-50" />
      </Button>

      <CommandResponsiveDialog
        shouldFilter={!onSearch}
        open={open}
        onOpenChange={setOpen}
      >
        <CommandInput
          placeholder="Search..."
          onValueChange={onSearch}
        />

        <CommandList>
          <CommandEmpty>
            <span className="text-sm text-muted-foreground">
              No options found
            </span>
          </CommandEmpty>

          {options.map((option) => (
            <CommandItem
              key={option.id}
              value={option.value}
              onSelect={() => {
                onSelect(option.value);
                setOpen(false);
              }}
            >
              {option.children}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
};