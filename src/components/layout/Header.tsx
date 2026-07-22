"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MobileNav } from "@/components/layout/MobileNav"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Dictionary } from "@/types"
import { siteConfig } from "@/config/site"

interface HeaderProps {
  nav: Dictionary["nav"]
}

export function Header({ nav }: HeaderProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-md">
      {/* Top accent strip */}
      <div className="h-1 w-full bg-gradient-to-r from-secondary via-accent to-secondary/80" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/logo.png"
            alt="श्री पालीवाल ब्राह्मण समाज पंचायत लोगो"
            width={48}
            height={48}
            className="h-10 w-auto sm:h-12 shrink-0"
            priority
          />
          <span className="flex flex-col leading-tight">
            <span
              className="text-xs font-semibold text-primary-foreground transition-colors group-hover:text-accent sm:text-sm"
              title={siteConfig.name}
            >
              श्री पालीवाल ब्राह्मण समाज पंचायत
            </span>
            <span className="text-xs font-semibold text-primary-foreground/90 sm:text-sm">
              44 श्रेणी ( रजि. ), इंदौर
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="मुख्य नेविगेशन">
          {nav.items.map((item) => {
            const itemKey = `${item.href}-${item.label}`
            return (
            item.children ? (
              <DropdownMenu key={itemKey}>
                <DropdownMenuTrigger
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "text-primary-foreground hover:bg-secondary/25 hover:text-secondary gap-1 cursor-pointer border-b-2 border-transparent rounded-none px-3",
                    isActive(item.href) && "border-secondary text-secondary"
                  )}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="min-w-[160px] border-primary/20"
                >
                  {item.children.map((child) => (
                    <DropdownMenuItem
                      key={`${item.href}-${child.href}-${child.label}`}
                      render={<Link href={child.href} />}
                    >
                      {child.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={itemKey}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-primary-foreground hover:bg-secondary/25 hover:text-secondary border-b-2 border-transparent rounded-none px-3",
                  isActive(item.href) && "border-secondary text-secondary"
                )}
              >
                {item.label}
              </Link>
            )
          )})}
        </nav>

        {/* CTA + mobile menu */}
        <div className="flex items-center gap-2">
          <Link
            href="/booking"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden sm:flex bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            )}
          >
            {nav.cta}
          </Link>
          <MobileNav
            items={nav.items}
            cta={nav.cta}
            siteName={siteConfig.name}
          />
        </div>
      </div>
    </header>
  )
}
