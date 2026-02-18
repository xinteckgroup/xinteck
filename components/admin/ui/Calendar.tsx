"use client"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"
import { Button, buttonVariants } from "./Button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3 [--cell-radius:10px] [--cell-size:2.1rem] admin-surface-primary backdrop-blur-md border border-[var(--admin-border)] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] rounded-[18px] group/calendar text-[var(--admin-text)]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit h-auto", defaultClassNames.root),
        months: cn(
          "flex gap-3 flex-col md:flex-row relative",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-3", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between z-10",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none !text-[var(--admin-text)] !opacity-100 hover:bg-gold/10 hover:!text-gold [&_svg]:!text-[var(--admin-text)] rounded-[10px] transition-all",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none !text-[var(--admin-text)] !opacity-100 hover:bg-gold/10 hover:!text-gold [&_svg]:!text-[var(--admin-text)] rounded-[10px] transition-all",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-black uppercase tracking-widest justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative cn-calendar-dropdown-root rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute admin-surface-primary border border-[var(--admin-border)] text-[var(--admin-text)] inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-black text-[var(--admin-text)] uppercase tracking-widest",
          captionLayout === "label"
            ? "text-sm"
            : "cn-calendar-caption-label rounded-(--cell-radius) flex items-center gap-1 text-sm [&>svg]:text-gold [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-[var(--admin-text)] opacity-40 rounded-(--cell-radius) flex-1 font-black text-[10px] uppercase tracking-widest select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[10px] font-black uppercase tracking-widest select-none text-[var(--admin-text)] opacity-20",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full rounded-(--cell-radius) h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius) group/day aspect-square select-none text-[var(--admin-text)]",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-(--cell-radius) bg-gold/20 relative after:bg-gold/20 after:absolute after:inset-y-0 after:w-4 after:right-0 z-0 isolate shadow-lg shadow-gold/10",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none bg-gold/5 text-gold", defaultClassNames.range_middle),
        range_end: cn(
          "rounded-r-(--cell-radius) bg-gold/20 relative after:bg-gold/20 after:absolute after:inset-y-0 after:w-4 after:left-0 z-0 isolate shadow-lg shadow-gold/10",
          defaultClassNames.range_end
        ),
        today: cn(
          "bg-gold/10 text-gold border border-gold/30 rounded-(--cell-radius) font-black",
          defaultClassNames.today
        ),
        outside: cn(
          "text-[var(--admin-text)] opacity-20 aria-selected:text-gold",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-[var(--admin-text)] opacity-10 cursor-not-allowed",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeft className={cn("cn-rtl-flip size-4 !text-gold", className)} {...props} />
            )
          }
          if (orientation === "right") {
            return (
              <ChevronRight className={cn("cn-rtl-flip size-4 !text-gold", className)} {...props} />
            )
          }
          return (
            <ChevronDown className={cn("size-4 !text-gold", className)} {...props} />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center text-[var(--admin-text)] opacity-20 font-black text-[10px]">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-gold data-[selected-single=true]:text-[var(--admin-text)] data-[selected-single=true]:font-black data-[selected-single=true]:shadow-[0_8px_20px_rgba(212,175,55,0.4)] data-[range-middle=true]:bg-gold/10 data-[range-middle=true]:text-gold data-[range-start=true]:bg-gold data-[range-start=true]:text-[var(--admin-text)] data-[range-end=true]:bg-gold data-[range-end=true]:text-[var(--admin-text)] group-data-[focused=true]/day:border-gold group-data-[focused=true]/day:ring-gold/20 hover:bg-gold/20 hover:text-white dark:hover:text-white relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-black text-xs group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) transition-all duration-300 !text-[var(--admin-text)] aria-selected:!text-[var(--admin-text)]",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}
export { Calendar, CalendarDayButton }
