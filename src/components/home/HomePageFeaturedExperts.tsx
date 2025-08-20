// Convert to server component for better performance
import { Button } from '@/components/ui/button';
import { ExpertCard } from '@/components/ui/card/ExpertCard';
import { mockExperts } from '@/lib/mock-data/experts';
import { Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Pre-select featured experts at build time
function getFeaturedExperts() {
  return mockExperts
    .filter(
      (expert) => expert.isVerified && expert.isAvailable && expert.rating
    )
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8);
}

export function HomePageFeaturedExperts() {
  const featuredExperts = getFeaturedExperts();

  return (
    <div className='bg-muted/30 border-t py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold'>Featured Expert Witnesses</h2>
          <p className='text-muted-foreground text-lg'>
            Top-rated professionals across all practice areas, ready to provide
            expert testimony
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {featuredExperts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              variant='grid'
              showPricing={false}
              showStatusBadge={false}
              showIntelReport={false}
            />
          ))}
        </div>

        <div className='mt-12 text-center'>
          <p className='text-muted-foreground mb-6'>
            Looking for an expert in a specific field or need help finding the
            right witness?
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <Button size='lg' asChild>
              <Link href='/directory'>
                <Users className='mr-2 h-4 w-4' />
                Browse All {mockExperts.length.toLocaleString()} Experts
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button size='lg' variant='outline' asChild>
              <Link href='/search-concierge'>Order Concierge Search</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
