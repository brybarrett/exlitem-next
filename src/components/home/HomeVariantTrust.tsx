'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  IconSearch,
  IconStethoscope,
  IconRuler,
  IconBuildingBank,
  IconChevronRight,
  IconCurrencyDollar,
  IconBox,
  IconPackage,
  IconEmergencyBed,
  IconShieldLock,
  IconBriefcase,
  IconCertificate,
  IconTarget,
  IconDeviceDesktop,
  IconStar,
  IconUsers,
  IconTrophy,
  IconScale,
  IconTrendingUp
} from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const searchFeatures = [
  'Find an Expert Witness by Name',
  'Shortlist experts by discipline',
  'Find Daubert challenges on the opposing expert',
  'Contact an expert witness',
  "Review an expert's Gatekeeper Report"
];

const categories = [
  { icon: IconStethoscope, name: 'Medicine', slug: 'medical' },
  { icon: IconRuler, name: 'Engineering', slug: 'engineering' },
  { icon: IconBuildingBank, name: 'Banking', slug: 'accounting-finance' },
  { icon: IconCurrencyDollar, name: 'Finance', slug: 'accounting-finance' },
  { icon: IconBox, name: 'Accounting', slug: 'accounting-finance' },
  { icon: IconPackage, name: 'Products', slug: 'construction' },
  { icon: IconEmergencyBed, name: 'Slip & Fall', slug: 'medical' },
  { icon: IconShieldLock, name: 'Security', slug: 'law-enforcement' },
  { icon: IconBriefcase, name: 'Forensics', slug: 'law-enforcement' },
  { icon: IconCertificate, name: 'Patents', slug: 'technology' },
  { icon: IconTarget, name: 'Trademark', slug: 'technology' },
  { icon: IconDeviceDesktop, name: 'Software', slug: 'technology' }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    title: 'Partner, Chen & Associates',
    content:
      'Exlitem helped us find the perfect medical expert for our malpractice case. The Gatekeeper Report was invaluable.',
    avatar: 'SC',
    rating: 5
  },
  {
    name: 'Michael Rodriguez',
    title: 'Senior Attorney, Rodriguez Law',
    content:
      'The platform saved us weeks of research. We found 3 qualified experts in 24 hours.',
    avatar: 'MR',
    rating: 5
  },
  {
    name: 'Emily Thompson',
    title: 'Managing Partner, Thompson LLC',
    content:
      'Their intelligence reports on opposing experts have given us a significant advantage in court.',
    avatar: 'ET',
    rating: 5
  }
];

const clientLogos = [
  'BigLaw Firm',
  'National Insurance',
  'Regional Attorney Group',
  'Defense Counsel',
  'Plaintiff Specialists',
  'Corporate Legal'
];

const stats = [
  { number: '48,397+', label: 'Expert Profiles', icon: IconUsers },
  { number: '245k+', label: 'Daubert Challenges', icon: IconStar },
  { number: '5000+', label: 'Expert Categories', icon: IconTrophy },
  { number: '24/7', label: 'Concierge Support', icon: IconShieldLock }
];

const trendingSearches = [
  'Medical Malpractice Expert',
  'Construction Accident Witness',
  'Forensic Accountant',
  'Automotive Expert',
  'Intellectual Property Attorney',
  'Personal Injury Specialist',
  'Engineering Failure Analysis',
  'Economic Damages Expert',
  'Workers Compensation Doctor',
  'Real Estate Appraiser',
  'Cyber Security Expert',
  'Environmental Consultant',
  'Product Liability Engineer',
  'Patent Expert',
  'Tax Law Specialist',
  'Insurance Claims Expert',
  'Accident Reconstruction',
  'Vocational Rehabilitation',
  'Toxicology Expert',
  'Employment Law Attorney'
];

export function HomeVariantTrust() {
  const router = useRouter();
  const [searchPlaceholder, setSearchPlaceholder] = useState(searchFeatures[0]);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [showTrending, setShowTrending] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % searchFeatures.length);
      setSearchPlaceholder(searchFeatures[currentFeatureIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentFeatureIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowTrending(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      router.push(`/directory?query=${encodeURIComponent(query.trim())}`);
      setShowTrending(false);
    }
  };

  const handleTrendingClick = (search: string) => {
    setSearchValue(search);
    handleSearchSubmit(search);
  };

  return (
    <section className='bg-background relative overflow-hidden'>
      {/* Hero Section with Trust Elements */}
      <div className='py-10 sm:py-16 lg:py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16'>
            {/* Left content */}
            <div className='space-y-6 lg:space-y-8'>
              <h1 className='text-center text-3xl font-bold tracking-tight sm:text-4xl lg:text-left lg:text-5xl xl:text-6xl'>
                The One Stop <br />
                <span className='from-primary/80 to-primary bg-gradient-to-r bg-clip-text text-transparent'>
                  Expert Witness
                </span>
                <br />
                Platform
              </h1>

              <p className='text-muted-foreground max-w-2xl text-center text-lg sm:text-lg lg:text-left'>
                Find, vet, research and retain expert witnesses. <br /> Obtain
                intel on opposing experts and depose/ challenge them with
                confidence.
              </p>

              {/* Stats */}
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className='text-center'>
                      <div className='mb-2 flex justify-center'>
                        <Icon className='text-primary/80 dark:text-primary h-6 w-6' />
                      </div>
                      <div className='text-primary text-2xl font-bold'>
                        {stat.number}
                      </div>
                      <div className='text-muted-foreground text-sm'>
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTAs */}
              <div className='space-y-4'>
                <div className='flex flex-col gap-3 sm:flex-row sm:gap-4'>
                  <Link href='/directory'>
                    <Button
                      size='lg'
                      className='from-primary to-primary/90 text-primary-foreground hover:from-primary/80 hover:to-primary w-full bg-gradient-to-r shadow-lg sm:w-auto'
                    >
                      Find an Expert
                    </Button>
                  </Link>
                  <Link href='/intel'>
                    <Button
                      size='lg'
                      variant='outline'
                      className='w-full sm:w-auto'
                    >
                      Research an Expert
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right content - Search */}
            <div>
              <Card className='relative bg-gradient-to-br from-amber-50/50 to-yellow-50/50 p-6 shadow-2xl ring-1 ring-amber-600/20 dark:from-amber-950/20 dark:to-yellow-950/20 dark:ring-amber-500/20'>
                <CardContent className='p-0'>
                  <h2 className='mb-6 text-2xl font-semibold'>
                    Find Your Expert Witness
                  </h2>
                  <div className='mb-6 space-y-4' ref={searchRef}>
                    <div className='relative'>
                      <IconSearch className='text-muted-foreground absolute top-1/2 left-3 z-10 h-5 w-5 -translate-y-1/2' />
                      <Input
                        ref={inputRef}
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={() => setShowTrending(true)}
                        className='bg-muted/50 hover:bg-muted/70 focus:bg-background w-full rounded-md py-6 pr-4 pl-10 text-lg sm:pr-24'
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearchSubmit(searchValue);
                          }
                        }}
                      />
                      {/* Desktop Search Button */}
                      <Button
                        className='from-primary to-primary/90 text-primary-foreground hover:from-primary/80 hover:to-primary absolute top-1/2 right-2 z-10 hidden -translate-y-1/2 bg-gradient-to-r shadow-lg sm:block'
                        onClick={() => handleSearchSubmit(searchValue)}
                      >
                        Search
                      </Button>

                      {/* Trending Searches Dropdown */}
                      {showTrending && (
                        <div className='bg-background border-border absolute top-full right-0 left-0 z-20 mt-2 max-h-80 overflow-y-auto rounded-lg border shadow-lg'>
                          <div className='border-border border-b p-4'>
                            <h3 className='text-muted-foreground mb-3 text-sm font-medium'>
                              Trending Searches
                            </h3>
                            <div className='space-y-1'>
                              {trendingSearches.map((search, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleTrendingClick(search)}
                                  className='hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors duration-200'
                                >
                                  <IconTrendingUp className='text-muted-foreground h-4 w-4' />
                                  <span>{search}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mobile Search Button */}
                    <Button
                      className='from-primary to-primary/90 text-primary-foreground hover:from-primary/80 hover:to-primary w-full bg-gradient-to-r shadow-lg sm:hidden'
                      onClick={() => handleSearchSubmit(searchValue)}
                    >
                      Search
                    </Button>
                  </div>

                  {/* Trust indicators in search */}
                  <div className='text-muted-foreground space-y-3 text-sm'>
                    <div className='flex items-center gap-2'>
                      <IconSearch className='h-4 w-4 text-green-500' />
                      AI enabled search engine to quickly find experts
                    </div>
                    <div className='flex items-center gap-2'>
                      <IconUsers className='h-4 w-4 text-green-500' />
                      New experts added daily from court records
                    </div>
                    <div className='flex items-center gap-2'>
                      <IconTrophy className='h-4 w-4 text-blue-500' />
                      Quarterly reviews to remove inactive experts
                    </div>
                    <div className='flex items-center gap-2'>
                      <IconShieldLock className='h-4 w-4 text-purple-500' />
                      Instant access to contact information
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className='bg-muted/30 border-t py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold'>
              Browse by Area of Expertise
            </h2>
            <p className='text-muted-foreground text-lg'>
              15,000+ verified experts across all major practice areas
            </p>
          </div>

          <div className='grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-6'>
            {categories.map((category, i) => {
              const Icon = category.icon;
              return (
                <Link
                  key={i}
                  href={`/expert-witness/${category.slug}`}
                  className='group hover:bg-background flex cursor-pointer flex-col items-center gap-3 rounded-lg p-4 transition-colors'
                >
                  <div className='bg-background flex h-12 w-12 transform items-center justify-center rounded-full shadow-sm transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-md'>
                    <Icon className='text-primary h-6 w-6 transition-transform duration-300 ease-out group-hover:scale-110' />
                  </div>
                  <span className='text-muted-foreground group-hover:text-primary text-center text-sm transition-colors duration-300 ease-out'>
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className='mt-12 text-center'>
            <Link href='/expert-witness/all-categories'>
              <Button
                size='lg'
                className='from-primary to-primary/90 text-primary-foreground hover:from-primary/80 hover:to-primary bg-gradient-to-r shadow-lg'
              >
                Browse All Categories <IconChevronRight />
              </Button>
            </Link>

            {/* Concierge Search CTA */}
            <div className='mt-6 space-y-2'>
              <p className='text-muted-foreground text-sm'>
                Don't have time to search? Let our experts find you the right
                expert witness.
              </p>
              <Link
                href='/search-concierge'
                className='text-primary hover:text-primary/80 text-sm font-medium underline decoration-2 underline-offset-4 transition-colors'
              >
                Try our Expert Search Concierge Service →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
