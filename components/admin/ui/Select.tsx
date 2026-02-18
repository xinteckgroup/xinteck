"use client";

import { cn } from "@/lib/utils";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

const SelectRoot = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      // horizontal layout lock
      "flex items-center gap-2 w-full",
      // sizing + visuals
      "min-h-9 h-9 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm overflow-hidden",
      // behavior
      "whitespace-nowrap leading-none",
      "focus:outline-none focus:ring-1 focus:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {/* LEFT — icon (fixed) */}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-60 shrink-0" />
    </SelectPrimitive.Icon>

    {/* RIGHT — text (flexible) */}
    <span className="flex-1 truncate text-left min-w-0">
      {children}
    </span>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4 rotate-180 text-[var(--admin-text)]" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4 text-[var(--admin-text)]" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => {
  return (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      data-slot="admin-select"
      avoidCollisions
      collisionPadding={16}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-[10px] admin-surface-primary backdrop-blur-md border border-[var(--admin-border)] text-[var(--admin-text)] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-black uppercase tracking-widest text-[var(--admin-text)]", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-[6px] py-1.5 pl-2 pr-8 text-xs font-bold outline-none transition-all text-[var(--admin-text)] hover:bg-gold/10 hover:text-gold focus:bg-gold/10 focus:text-gold data-[state=checked]:text-gold data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-gold" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-[var(--admin-border)]", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

interface SelectProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    label?: string;
    error?: string;
    className?: string; // Trigger className
    placeholder?: string;
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(({ value, onChange, options, label, error, className, placeholder = "Select..." }, ref) => {
    
    // Adapter handler
    const handleValueChange = (val: string) => {
        if (onChange) {
            const syntheticEvent = {
                target: { value: val },
                currentTarget: { value: val }
            } as unknown as React.ChangeEvent<HTMLSelectElement>;
            onChange(syntheticEvent);
        }
    };

    return (
        <div className="flex flex-col gap-1 md:gap-2">
            {label && (
                <label className="text-[8px] md:text-xs font-bold text-muted-foreground uppercase">{label}</label>
            )}
            <SelectRoot value={value} onValueChange={handleValueChange}>
                <SelectTrigger 
                    ref={ref}
                    className={cn(
                        "w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] text-[var(--admin-text)] text-xs md:text-sm outline-none focus:ring-1 focus:ring-gold/50 transition-colors",
                        error ? "border-destructive/50 focus:ring-destructive" : "focus:border-gold/50",
                        className
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options.map((opt) => (
                            <SelectItem 
                                key={opt.value} 
                                value={opt.value}
                            >
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </SelectRoot>
            {error && <span className="text-[10px] text-destructive">{error}</span>}
        </div>
    );
});
Select.displayName = "Select";
