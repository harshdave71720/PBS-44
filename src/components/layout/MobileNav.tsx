"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import type { NavItem } from "@/types"

interface MobileNavProps {
  items: NavItem[]
  cta: string
  siteName: string
}

export function MobileNav({ items, cta, siteName }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "text-primary-foreground hover:bg-secondary/25 lg:hidden"
        )}
        aria-label="मेनू खोलें"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] bg-primary p-0 text-primary-foreground">
        <SheetTitle className="sr-only">{siteName} — नेविगेशन</SheetTitle>
        {/* Sheet header */}
        <div className="flex items-center justify-between border-b border-secondary/30 px-4 py-4">
          <span className="font-bold text-lg">{siteName}</span>
          <button
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "text-primary-foreground hover:bg-secondary/25"
            )}
            aria-label="बंद करें"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col py-4">
          {items.map((item) => {
            const itemKey = `${item.href}-${item.label}`
            return (
            <div key={itemKey}>
              {item.children ? (
                <>
                  <button
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-secondary/20 hover:text-secondary transition-colors"
                    onClick={() =>
                      setExpandedItem(expandedItem === itemKey ? null : itemKey)
                    }
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedItem === itemKey ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedItem === itemKey && (
                    <div className="border-l-2 border-accent ml-4 mb-1">
                      {item.children.map((child) => (
                        <Link
                          key={`${item.href}-${child.href}-${child.label}`}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block px-4 py-2 text-sm text-primary-foreground/85 hover:text-secondary hover:bg-secondary/20 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm font-medium hover:bg-secondary/20 hover:text-secondary transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          )})}
        </nav>

        {/* CTA */}
        <div className="px-4 pb-6 mt-auto">
          <Link
            href="/booking"
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants(),
              "w-full justify-center"
            )}
          >
            {cta}
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
