import Link from "next/link"
import { ChevronDown } from "lucide-react"
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
  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-md">
      {/* Top accent strip */}
      <div className="h-1 w-full bg-gradient-to-r from-secondary via-accent to-secondary" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group">
          <span className="text-xl font-bold tracking-tight group-hover:text-accent transition-colors">
            {siteConfig.name}
          </span>
          <span className="text-[10px] font-medium tracking-widest text-primary-foreground/70 uppercase">
            {siteConfig.tagline}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="मुख्य नेविगेशन">
          {nav.items.map((item) =>
            item.children ? (
              <DropdownMenu key={item.href}>
                <DropdownMenuTrigger
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "text-primary-foreground hover:bg-white/10 hover:text-white gap-1 cursor-pointer"
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
                      key={child.href}
                      render={<Link href={child.href} />}
                    >
                      {child.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-primary-foreground hover:bg-white/10 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* CTA + mobile menu */}
        <div className="flex items-center gap-2">
          <Link
            href="/services"
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
