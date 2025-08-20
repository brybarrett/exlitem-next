

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
  Clock,
  DollarSign,
  Eye,
  Shield,
  MessageSquare,
  AlertCircle,
  Contact2Icon,
  Lock,
  CreditCard,
  BadgeCheck,
  BadgeAlert,
  ShieldCheck
} from 'lucide-react';
// import type { ExpertProfile } from '@/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
// import ContactUnlockDialog from './ContactUnlockDialog';

interface ExpertCardProps {
  expert: any;
  variant?: 'list' | 'grid';
  showPricing?: boolean;
  showStatusBadge?: boolean;
  showIntelReport?: boolean;
}

export function ExpertCard({
  expert,
  variant = 'grid',
  showPricing = true,
  showStatusBadge = true,
  showIntelReport = true
}: ExpertCardProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const router = useRouter();

  // Helper functions for claim profile functionality
  const getPrimaryAddress = (addresses: any[]) => {
    if (!addresses || addresses.length === 0) return '';
    const primaryAddress =
      addresses.find((addr) => addr.is_primary) || addresses[0];
    if (primaryAddress.city && primaryAddress.state) {
      return `${primaryAddress.city}, ${primaryAddress.state}`;
    }
    return '';
  };

  const getPrimaryExpertise = (expertise: any[]) => {
    if (!expertise || expertise.length === 0) return '';
    const primaryExpertise =
      expertise.find((exp) => exp.is_primary) || expertise[0];
    return primaryExpertise.expertise || primaryExpertise.name || '';
  };

  const handleClaimProfile = (expert: any) => {
    console.log('Claiming profile for expert:', expert);

    let qparams = new URLSearchParams();
    qparams.set('expert_uuid', expert.uuid || expert.id || '');
    qparams.set('first_name', expert.first_name || '');
    qparams.set('last_name', expert.last_name || '');
    qparams.set('profile_image', expert.imageUrl || '');

    if (expert.location) {
      const address = `${expert.location.city}, ${expert.location.state}`;
      qparams.set('address', address);
    }

    if (expert.practiceAreas && expert.practiceAreas.length > 0) {
      qparams.set('expertise', expert.practiceAreas[0]);
    }

    router.push(`/claim/verify-its-you?${qparams.toString()}`);
  };

  const getStatusBadge = () => {
    switch (expert.profile_type?.toLowerCase()) {
      case 'premium':
        return (
          <Badge className='bg-amber-500 hover:bg-amber-600'>Premium</Badge>
        );
      case 'verified':
        return (
          <Badge
            variant='secondary'
            className='bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-200'
          >
            Verified
          </Badge>
        );
      case 'claimed':
        return <Badge variant='outline'>Claimed</Badge>;
      default:
        return (
          <Badge variant='outline' className='text-muted-foreground'>
            Unclaimed
          </Badge>
        );
    }
  };

  // Status configuration constants
  const statusConfig = {
    Premium: {
      icon: ShieldCheck,
      color: 'text-amber-500',
      title: 'Premium Expert',
      description:
        'Verified expert with premium profile featuring detailed credentials, case history, and priority support.'
    },
    Verified: {
      icon: ShieldCheck,
      color: 'text-green-500',
      title: 'Verified Expert',
      description:
        'Expert credentials have been verified and profile is actively maintained.'
    },
    Claimed: {
      icon: BadgeCheck,
      color: 'text-blue-500',
      title: 'Claimed Profile',
      description:
        'Expert has claimed their profile and can update their information.'
    },
    Unclaimed: {
      icon: BadgeAlert,
      color: 'text-gray-500',
      title: 'Unclaimed Profile',
      description:
        'Profile created from public records. Expert has not yet claimed or verified their profile.'
    }
  };

  const getStatusIcon = () => {
    const status = expert.profile_type || 'Unclaimed';
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config?.icon || ShieldCheck;

    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className='absolute top-6 right-6 z-10'>
            <IconComponent className={`h-5 w-5 ${config?.color}`} />
          </div>
        </HoverCardTrigger>
        <HoverCardContent className='w-80'>
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <IconComponent className={`h-4 w-4 ${config?.color}`} />
              <h4 className='text-sm font-semibold'>{config?.title}</h4>
            </div>
            <p className='text-muted-foreground text-sm'>
              {config?.description}
            </p>

            {status === 'Unclaimed' && (
              <div className='border-t pt-3'>
                <p className='mb-3 text-sm font-medium'>Are you this expert?</p>
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    className='flex-1'
                    onClick={(e) => {
                      e.preventDefault();
                      handleClaimProfile(expert);
                    }}
                  >
                    Claim Profile
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    className='flex-1'
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Implement request removal functionality
                      console.log(
                        'Request removal clicked for expert:',
                        expert.uuid
                      );
                    }}
                  >
                    Request Removal
                  </Button>
                </div>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  const getContactButton = () => {
    switch (expert.profile_type?.toLowerCase()) {
      case 'Premium':
      case 'Verified':
        return (
          <Button className='mt-3 w-full'>
            <MessageSquare className='mr-2 h-4 w-4' />
            Contact Expert
          </Button>
        );
      case 'Claimed':
        return (
          <Button variant='outline' className='mt-3 w-full'>
            <MessageSquare className='mr-2 h-4 w-4' />
            Contact Expert
          </Button>
        );
      default:
        return (
          <>
            <Button
              variant='outline'
              className='mt-3 w-full'
              onClick={() => setIsContactModalOpen(true)}
            >
              <Contact2Icon className='mr-2 h-4 w-4' />
              Request Contact Details
            </Button>
            {/* <ContactUnlockDialog
              isOpen={isContactModalOpen}
              onClose={() => setIsContactModalOpen(false)}
              expertName={expert.name}
            /> */}
          </>
        );
    }
  };

  const getFallbackImage = useMemo(() => {
    return `${expert?.first_name?.charAt(0) || ''}${expert?.last_name?.charAt(0) || ''}`.trim();
  }, [expert]);

  if (variant === 'list') {
    return (
      <Card className='relative p-0 transition-shadow hover:shadow-lg'>
        {getStatusIcon()}
        <CardContent className='p-6'>
          <div className='flex gap-6'>
            {/* Avatar */}
            <Avatar className='h-20 w-20 flex-shrink-0'>
              <AvatarImage src={expert.imageUrl} alt={expert.name} />
              <AvatarFallback className='text-md font-medium uppercase'>
                {getFallbackImage}
              </AvatarFallback>
            </Avatar>

            {/* Main Content */}
            <div className='min-w-0 flex-1'>
              <div className='mb-2 flex items-start justify-between'>
                <div>
                  <Link
                    href={`/expert/${expert.uuid}/expert/`}
                    className='hover:text-primary text-lg font-semibold transition-colors'
                  >
                    {expert.name}
                  </Link>
                  <p className='text-muted-foreground'>{expert.title}</p>
                </div>
              </div>

              {/* Location and Rating */}
              <div className='text-muted-foreground mb-3 flex items-center gap-4 text-sm'>
                {expert.location && (
                  <div className='flex items-center gap-1'>
                    <MapPin className='h-3 w-3' />
                    <span>
                      {expert.location.city}, {expert.location.state}
                    </span>
                  </div>
                )}
                {/* {expert.rating && (
                  <div className='flex items-center gap-1'>
                    <Star className='h-3 w-3 fill-amber-400 text-amber-400' />
                    <span>{expert.rating}</span>
                    {expert.reviewCount && <span>({expert.reviewCount})</span>}
                  </div>
                )} */}
                {/* {expert.avgResponseTime && expert.profile_type !== 'not-claimed' && (
                  <div className='flex items-center gap-1'>
                    <Clock className='h-3 w-3' />
                    <span>~{expert.avgResponseTime}</span>
                  </div>
                )} */}
              </div>

              {/* Practice Areas */}
              <div className='mb-3 flex flex-wrap gap-2'>
                {expert.practiceAreas?.slice(0, 3).map((area: any, index: any) => (
                  <Badge key={index} variant='secondary' className='text-xs'>
                    {area}
                  </Badge>
                ))}
                {expert.practiceAreas && expert.practiceAreas.length > 3 && (
                  <Popover>
                    <PopoverTrigger>
                      <Badge
                        variant='outline'
                        className='cursor-pointer text-xs'
                      >
                        +{expert.practiceAreas.length - 3} more
                      </Badge>
                    </PopoverTrigger>
                    <PopoverContent className='w-80'>
                      <p className='text-md mb-2 font-medium'>Practice Areas</p>
                      <ul className='list-inside list-disc space-y-0.5'>
                        {expert.practiceAreas.slice(3).map((area: any, index: any) => (
                          <li key={index} className='text-xs'>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              {/* Bio Preview */}
              {expert.bio && (
                <p className='text-muted-foreground mb-3 line-clamp-2 text-sm'>
                  {expert.bio}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className='flex w-56 flex-col gap-3'>
              {showPricing && expert.hourlyRate && (
                <div className='text-center'>
                  <div className='text-lg font-semibold'>
                    ${expert.hourlyRate}/hr
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    Hourly Rate
                  </div>
                </div>
              )}

              <div className='flex flex-col gap-3'>
                <Link href={`/expert/${expert.uuid}/expert/`}>
                  <Button variant='outline' className='w-full'>
                    <Eye className='mr-2 h-4 w-4' />
                    View Profile
                  </Button>
                </Link>
                <div>{getContactButton()}</div>
                {showIntelReport && expert.gatekeeperDataAvailable && (
                  <Link
                    href={`/intel/${expert.slug || expert.uuid || expert.id}`}
                  >
                    <Button variant='secondary' className='w-full'>
                      <Shield className='mr-2 h-4 w-4' />
                      Intel Report
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid variant
  return (
    <Card className='relative h-full gap-2 transition-shadow hover:shadow-lg'>
      {getStatusIcon()}
      <CardHeader className='pb-3'>
        {/* Large Avatar at top */}
        <div className='flex justify-center'>
          <Avatar className='h-20 w-20'>
            <AvatarImage src={expert.imageUrl} alt={expert.name} />
            <AvatarFallback className='text-lg font-medium uppercase'>
              {getFallbackImage}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name and title below, center-aligned */}
        <div className='text-center'>
          <Link
            href={`/expert/${expert.uuid}/expert/`}
            className='hover:text-primary line-clamp-1 font-semibold transition-colors'
          >
            {expert.name}
          </Link>
          <p className='text-muted-foreground line-clamp-2 text-sm'>
            {expert.title}
          </p>
        </div>
      </CardHeader>

      <CardContent className='flex h-full flex-col justify-between gap-2'>
        {/* Location and Rating */}
        <div className='flex flex-col gap-2'>
          <div className='space-y-2 text-sm'>
            {expert.location && (
              <div className='text-muted-foreground flex items-center justify-center gap-1'>
                <MapPin className='h-3 w-3' />
                <span>
                  {expert.location.city}, {expert.location.state}
                </span>
              </div>
            )}
            {/* {expert.rating && (
              <div className='flex items-center gap-1'>
                <Star className='h-3 w-3 fill-amber-400 text-amber-400' />
                <span className='font-medium'>{expert.rating}</span>
                {expert.reviewCount && (
                  <span className='text-muted-foreground'>
                    ({expert.reviewCount})
                  </span>
                )}
              </div>
            )}
            {expert.avgResponseTime && expert.profile_type !== 'not-claimed' && (
              <div className='text-muted-foreground flex items-center gap-1'>
                <Clock className='h-3 w-3' />
                <span>~{expert.avgResponseTime} response</span>
              </div>
            )} */}
          </div>

          {/* Practice Areas */}
          <div className='flex flex-wrap justify-center gap-1'>
            {expert.practiceAreas?.slice(0, 2).map((area: any, index: any) => (
              <Badge
                key={index}
                variant='secondary'
                className='line-clamp-1 max-w-full text-xs text-ellipsis'
              >
                {area}
              </Badge>
            ))}
            {expert.practiceAreas && expert.practiceAreas.length > 2 && (
              <Popover>
                <PopoverTrigger>
                  <Badge variant='outline' className='cursor-pointer text-xs'>
                    +{expert.practiceAreas.length - 2} more
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className='max-h-96 w-80 overflow-y-auto'>
                  <p className='text-md mb-2 font-medium'>Practice Areas</p>
                  <ul className='list-inside list-disc space-y-0.5'>
                    {expert.practiceAreas.slice(2).map((area: any, index: any) => (
                      <li key={index} className='text-xs'>
                        {area}
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Pricing */}
          {showPricing && expert.hourlyRate && (
            <div className='bg-muted/50 rounded py-2 text-center'>
              <div className='font-semibold'>${expert.hourlyRate}/hr</div>
              <div className='text-muted-foreground text-xs'>Hourly Rate</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className='space-y-3'>
          <Link href={`/expert/${expert.uuid}/expert/`}>
            <Button variant='outline' className='w-full'>
              <Eye className='mr-2 h-4 w-4' />
              View Profile
            </Button>
          </Link>
          <div>{getContactButton()}</div>
          {showIntelReport && expert.gatekeeperDataAvailable && (
            <Link href={`/intel/${expert.slug || expert.uuid || expert.id}`}>
              <Button variant='secondary' className='w-full text-xs'>
                <Shield className='mr-2 h-3 w-3' />
                Intel Report
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
