'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  CheckCircle,
  MapPin,
  Star,
  Eye,
  Shield,
  Phone,
  Mail,
  ExternalLink,
  Building,
  BadgeCheck
} from 'lucide-react';
import type { ExpertProfile } from '@/types';
import { useMemo } from 'react';

interface FeaturedExpertCardProps {
  expert: ExpertProfile;
}

// Extended expert type for featured experts with additional fields
interface ExtendedExpertProfile extends ExpertProfile {
  website?: string;
  phone?: string;
  companyLogo?: string;
  companyName?: string;
}

export function FeaturedExpertCard({
  expert: baseExpert
}: FeaturedExpertCardProps) {
  // Add demo data for featured experts
  const expert: ExtendedExpertProfile = {
    ...baseExpert,
    website: `https://www.${baseExpert.name.toLowerCase().replace(/\s+/g, '')}.com`,
    phone: '+1 (555) 123-4567',
    companyLogo: `/api/placeholder/80/80?text=${baseExpert.name
      .split(' ')
      .map((n) => n[0])
      .join('')}`,
    companyName: `${baseExpert.name.split(' ')[1] || 'Expert'} Consulting Group`
  };

  const getFallbackImage = useMemo(() => {
    return `${expert?.first_name?.charAt(0) || ''}${expert?.last_name?.charAt(0) || ''}`.trim();
  }, [expert]);

  const handleContactExpert = () => {
    // This would open a web form instead of showing email
    console.log('Opening contact form for:', expert.name);
  };

  const handleCallExpert = () => {
    // This would initiate a call or show phone options
    console.log('Initiating call to:', expert.name);
  };

  const handleWebsiteVisit = () => {
    if (expert.website) {
      window.open(expert.website, '_blank');
    }
  };

  return (
    <Card className='via-background dark:via-background h-full border-amber-200 bg-gradient-to-br from-amber-50 to-amber-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-amber-800 dark:from-amber-950/10 dark:to-amber-950/10'>
      <CardHeader className='relative pb-4'>
        <div className='space-y-4'>
          {/* Large Profile */}
          <div className='relative mx-auto w-fit'>
            <Avatar className='ring-offset-background h-28 w-28 ring-4 ring-amber-200 ring-offset-4 dark:ring-amber-800'>
              <AvatarImage src={expert.imageUrl} alt={expert.name} />
              <AvatarFallback className='bg-gradient-to-br from-amber-100 to-amber-50 text-2xl font-bold text-amber-900 uppercase dark:from-amber-900 dark:to-amber-950 dark:text-amber-100'>
                {getFallbackImage}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Expert Info */}
          <div className='space-y-2 text-center'>
            <Link
              href={`/expert/${expert.slug || expert.id}`}
              className='hover:text-primary block text-2xl font-bold transition-colors'
            >
              <div className='flex items-center justify-center gap-2'>
                {expert.name}
                {/* Verification Badge */}
                {expert.isVerified && (
                  <BadgeCheck className='h-6 w-6 text-amber-500' />
                )}
              </div>
            </Link>
            <p className='text-muted-foreground text-lg font-semibold'>
              {expert.title}
            </p>

            {expert.companyName && (
              <p className='flex items-center justify-center gap-2 font-medium text-amber-700 dark:text-amber-300'>
                {expert.companyLogo ? (
                  <img
                    src={expert.companyLogo}
                    alt={`${expert.companyName} logo`}
                    className='h-4 w-4 rounded object-contain'
                  />
                ) : (
                  <Building className='h-4 w-4' />
                )}
                {expert.companyName}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Location */}
        {expert.location && (
          <div className='text-muted-foreground flex items-center justify-center gap-1 text-center'>
            <MapPin className='h-4 w-4' />
            <span className='font-medium'>
              {expert.location.city}, {expert.location.state}
            </span>
          </div>
        )}

        {/* Practice Areas */}
        <div className='flex flex-wrap justify-center gap-2'>
          {expert.practiceAreas?.slice(0, 3).map((area, index) => (
            <Badge
              key={index}
              variant='secondary'
              className='bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
            >
              {area}
            </Badge>
          ))}
        </div>

        {/* Contact Options */}
        <div className='grid grid-cols-3 gap-2'>
          <Button onClick={handleContactExpert} size='sm'>
            <Mail className='h-4 w-4' />
          </Button>
          <Button variant='outline' onClick={handleCallExpert} size='sm'>
            <Phone className='h-4 w-4' />
          </Button>
          {expert.website && (
            <Button variant='outline' onClick={handleWebsiteVisit} size='sm'>
              <ExternalLink className='h-4 w-4' />
            </Button>
          )}
        </div>

        {/* Premium Actions */}
        <div className='space-y-2'>
          <Button className='w-full' asChild>
            <Link href={`/expert/${expert.slug || expert.id}`}>
              <Eye className='mr-2 h-4 w-4' />
              View Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
