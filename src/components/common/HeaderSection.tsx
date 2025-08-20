'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';

import { ChevronDown, Mail, Menu, Phone } from 'lucide-react';
import { ColorModeToggle } from '@/components/common/ColorModeToggle';
import { UserMenuDropdown } from '@/components/common/UserMenuDropdown';
import { useAuth } from '@clerk/nextjs';
import LogoBrand from '@/components/common/LogoBrand';
import LogoMini from '@/components/common/LogoMini';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
// Define navigation structure
type TNavLink = {
  href: string;
  label: string;
  children?: {
    href: string;
    label: string;
    description?: string;
    class?: string;
    target?: string;
    rel?: string;
  }[];
};

// Static navigation links
const staticNavLinks: TNavLink[] = [
  {
    href: '/directory',
    label: 'Find Experts',
    children: [
      {
        href: '/directory',
        label: 'Expert Directory',
        description: 'Search and contact expert witnesses',
        class: 'bg-primary/10 border border-primary/20 rounded-md'
      },
      {
        href: '/expert-search',
        label: 'Concierge: Expert Search',
        description: 'Let our team find and vet experts for you',
        class: 'border border-primary/60 bg-primary/5 rounded-md'
      },
      {
        href: '/directory?practice=Medical',
        label: 'Medical Experts',
        description: 'Medical, Nursing, and Allied Health Experts'
      },
      {
        href: '/directory?practice=Engineering',
        label: 'Engineering Experts',
        description: 'Licensed engineers and technical specialists'
      },
      {
        href: '/directory?practice=Financial',
        label: 'Financial Experts',
        description: 'Forensic accountants and economic analysts'
      }
    ]
  },
  {
    href: '/expert-witness-research',
    label: 'Research Experts'
  },
  {
    href: '/resources',
    label: 'Resources',
    children: [
      {
        href: '/blog',
        label: 'Expert Witness Blog',
        description: 'Insights and analysis on expert witness testimony'
      },
      {
        href: '/expert-witness-podcast/',
        label: 'Expert Witness Podcast',
        description: 'On the Stand with Ashish Arun: The Expert Witness Podcast'
      },
      {
        href: 'https://jurimatic.com?utm_source=exlitem&utm_medium=referral',
        target: '_blank',
        rel: 'noopener dofollow',
        label: 'Jury Verdicts and Settlements',
        description: 'Latest Jury Verdicts and Settlements'
      }
    ]
  }
];

// For Experts dropdown options
const forExpertsOptions = [
  {
    href: '/claim',
    label: 'Claim Your Profile',
    description:
      'Take control of your expert witness profile and enhance visibility'
  },
  {
    href: '/expert-dashboard',
    label: 'Expert Dashboard',
    description: 'Manage your profile, analytics, and subscription'
  },
  {
    href: '/pricing',
    label: 'Pricing Plans',
    description: 'Choose the right membership level for your practice'
  },
  {
    href: '/how-it-works',
    label: 'How It Works',
    description: 'Learn how to maximize your expert witness practice'
  }
];

export function HeaderSection() {
  const { isSignedIn } = useAuth();

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur'>
      <div className='flex h-14 w-full items-center justify-between'>
        <div className='flex items-center'>
          <Link href='/' className='mr-6 flex items-center space-x-2'>
            <div className='hidden sm:block'>
              <LogoBrand />
            </div>
            <div className='sm:hidden'>
              <LogoMini />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Menu */}
        <div className='hidden md:flex md:flex-1 md:items-center md:justify-between'>
          <NavigationMenu className='flex-1'>
            <NavigationMenuList>
              {staticNavLinks.map((link, index) => (
                <NavigationMenuItem key={index}>
                  {link.children ? (
                    <>
                      <NavigationMenuTrigger className='h-9 px-4 text-sm'>
                        {link.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
                          {link.children.map((child, childIndex) => (
                            <li key={childIndex}>
                              <NavigationMenuLink asChild>
                                {child.href.startsWith('http') ? (
                                  <a
                                    href={child.href}
                                    target={child.target}
                                    rel={child.rel}
                                    className={`hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground relative block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none ${child.class || ''}`}
                                  >
                                    <div className='text-sm leading-none font-medium'>
                                      {child.label}
                                    </div>
                                    {child.description && (
                                      <p className='text-muted-foreground mt-1 line-clamp-2 text-xs leading-snug'>
                                        {child.description}
                                      </p>
                                    )}
                                  </a>
                                ) : (
                                  <Link
                                    href={child.href}
                                    className={`hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground relative block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none ${child.class || ''}`}
                                  >
                                    <div className='text-sm leading-none font-medium'>
                                      {child.label}
                                    </div>
                                    {child.description && (
                                      <p className='text-muted-foreground mt-1 line-clamp-2 text-xs leading-snug'>
                                        {child.description}
                                      </p>
                                    )}
                                  </Link>
                                )}
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        href={link.href}
                        className='group bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50'
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className='flex items-center gap-4'>
            {/* Contact Information */}
            <div className='text-muted-foreground mr-2 hidden items-center text-xs xl:flex'>
              <a
                href='mailto:support@exlitem.com'
                className='hover:text-primary flex items-center'
              >
                <Mail className='mr-1 h-3.5 w-3.5' />
                <span>support@exlitem.com</span>
              </a>
              <span className='mx-2'>|</span>
              <a
                href='tel:+18888948208'
                className='hover:text-primary flex items-center'
              >
                <Phone className='mr-1 h-3.5 w-3.5' />
                <span>(866) 955-4836</span>
              </a>
            </div>

            {/* Auth Buttons */}
            {!isSignedIn ? (
              <>
                <Button
                  variant='ghost'
                  size='sm'
                  className='hidden md:inline-flex'
                  asChild
                >
                  <Link href='/auth/sign-in'>Login</Link>
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='hidden md:inline-flex'
                  asChild
                >
                  <Link href='/login'>Login API</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size='sm'
                      className='bg-primary text-primary-foreground hover:bg-primary/90 hidden gap-1 md:inline-flex'
                    >
                      For Experts
                      <ChevronDown className='h-3 w-3' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-64'>
                    {forExpertsOptions.map((option, index) => (
                      <DropdownMenuItem key={index} asChild>
                        <Link
                          href={option.href}
                          className='flex flex-col items-start gap-1 p-3'
                        >
                          <div className='font-medium'>{option.label}</div>
                          <div className='text-muted-foreground line-clamp-2 text-xs'>
                            {option.description}
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <UserMenuDropdown />
            )}

            <ColorModeToggle />
          </div>
        </div>

        {/* Mobile Menu */}
        <div className='flex items-center gap-2 md:hidden'>
          <ColorModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='h-9 w-9 p-0'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side='left'
              className='flex w-full max-w-xs flex-col p-0'
            >
              <SheetHeader className='flex-shrink-0 p-6 pb-4'>
                <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
                <Link href='/' className='flex items-center'>
                  <LogoMini />
                </Link>
              </SheetHeader>

              {/* Scrollable Content Area */}
              <div className='flex-1 overflow-y-auto pb-4'>
                {/* Mobile Navigation */}
                <nav className='flex flex-col space-y-4 px-6 pb-4'>
                  {staticNavLinks.map((link, index) => (
                    <div key={index}>
                      <Link
                        href={link.href}
                        className='block py-2 text-sm font-medium'
                      >
                        {link.label}
                      </Link>
                      {link.children && (
                        <div className='mt-2 space-y-2 pl-4'>
                          {link.children.map((child, childIndex) =>
                            child.href.startsWith('http') ? (
                              <a
                                key={childIndex}
                                href={child.href}
                                target={child.target}
                                rel={child.rel}
                                className='text-muted-foreground hover:text-primary block py-1 text-sm'
                              >
                                {child.label}
                              </a>
                            ) : (
                              <Link
                                key={childIndex}
                                href={child.href}
                                className='text-muted-foreground hover:text-primary block py-1 text-sm'
                              >
                                {child.label}
                              </Link>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* For Experts Section - Mobile */}
                  <div>
                    <div className='text-primary bg-primary/10 -mx-3 block rounded-md px-3 py-2 text-sm font-medium'>
                      For Experts
                    </div>
                    <div className='mt-2 space-y-2 pl-4'>
                      {forExpertsOptions.map((option, index) => (
                        <Link
                          key={index}
                          href={option.href}
                          className='text-muted-foreground hover:text-primary block py-1 text-sm'
                        >
                          {option.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>

                {/* Mobile Auth Buttons */}
                <div className='mt-6 border-t px-6 pt-6 pb-6'>
                  {!isSignedIn ? (
                    <Button className='w-full' asChild>
                      <Link href='/auth/sign-in'>Login</Link>
                    </Button>
                  ) : (
                    <UserMenuDropdown />
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
