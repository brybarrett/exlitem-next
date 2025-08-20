'use client';

import { useMemo } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle,
  Flag,
  Share2,
  Bookmark,
  MessageSquare,
  Shield,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

export function ProfileHeader({ expert }: { expert: any }) {
  const full_name = useMemo(
    () =>
      `${expert.first_name || ''} ${expert.middle_name || ''} ${expert.last_name || ''}`,
    [expert]
  );

  const getExpertise = useMemo(() => {
    if (
      !expert.expert_area_of_expertise ||
      expert.expert_area_of_expertise.length === 0
    ) {
      return {
        primaryDiscipline: null,
        otherDisciplines: []
      };
    }

    // Find primary expertise or use first one
    const primary = expert.expert_area_of_expertise.find(
      (item: any) => item.is_primary
    );
    const primaryDiscipline = primary || expert.expert_area_of_expertise[0];

    // Get other expertise areas excluding the primary one
    const otherDisciplines = expert.expert_area_of_expertise.filter(
      (item: any) => item !== primaryDiscipline
    );

    return {
      primaryDiscipline,
      otherDisciplines
    };
  }, [expert]);

  const getAddress = useMemo(() => {
    if (!expert.expert_address || !expert.expert_address.length) {
      return null;
    }
    // Find the primary address if available, otherwise use the first address
    let address =
      expert.expert_address.find((addr: any) => addr.is_primary) ||
      expert.expert_address[0];

    // Prefer city and state if available, else use state_detail.label or country_detail.label
    let city = address.city;
    let stateLabel = address.state_detail?.label;
    let countryLabel = address.country_detail?.label;

    // Compose address string based on available fields
    let addressParts = [];
    if (city) addressParts.push(city);
    if (stateLabel) addressParts.push(stateLabel);
    if (countryLabel) addressParts.push(countryLabel);

    return addressParts.length > 0 ? addressParts.join(', ') : null;
  }, [expert]);

  return (
    <>
      <div className='relative'>
        {/* Profile Info Card */}
        <div className='w-full'>
          <Card>
            <CardContent className='p-6'>
              <div className='flex flex-col gap-6 sm:flex-row'>
                {/* Left side - Avatar and basic info */}
                <div className='flex flex-col gap-4 sm:flex-row sm:gap-6'>
                  <Avatar className='border-background h-32 w-32 border-4 sm:h-40 sm:w-40'>
                    <AvatarImage src={expert.profile_image} alt={expert.name} />
                    <AvatarFallback className='text-4xl font-semibold'>
                      {expert?.first_name?.charAt(0)}
                      {expert?.last_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className='space-y-2'>
                    <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                      <h1 className='text-2xl font-bold sm:text-3xl'>
                        {expert.salutation || ''} {full_name}{' '}
                        {expert.professional_suffix && (
                          <span className='text-muted-foreground text-sm'>
                            ( {expert.professional_suffix} )
                          </span>
                        )}
                      </h1>
                      {expert.isVerified && (
                        <Badge variant='secondary' className='w-fit'>
                          <CheckCircle className='mr-1 h-4 w-4' />
                          Verified Expert
                        </Badge>
                      )}
                    </div>

                    {getExpertise?.primaryDiscipline?.area_of_expertise && (
                      <p className='text-muted-foreground text-lg'>
                        {getExpertise?.primaryDiscipline?.area_of_expertise ||
                          ' '}
                      </p>
                    )}

                    {expert.expert_address &&
                      expert.expert_address.length > 0 && (
                        <div className='text-muted-foreground flex items-center'>
                          {getAddress && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className='mr-2 text-lg'>
                                    {getAddress}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{getAddress}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      )}

                    {/* Areas of Expertise */}
                    <div className='flex flex-wrap items-center gap-2'>
                      {getExpertise?.primaryDiscipline && (
                        <Badge variant='outline' className='text-xs'>
                          {getExpertise.primaryDiscipline.area_of_expertise}
                        </Badge>
                      )}
                      {getExpertise?.otherDisciplines?.length > 0 && (
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Badge
                              variant='secondary'
                              className='hover:bg-secondary/80 cursor-pointer text-xs'
                            >
                              {getExpertise?.otherDisciplines?.length} more
                            </Badge>
                          </HoverCardTrigger>
                          <HoverCardContent
                            className='max-w-80 overflow-auto p-0'
                            align='start'
                          >
                            <div className='p-4'>
                              <h4 className='mb-3 font-medium'>
                                Additional Areas of Expertise
                              </h4>
                              <ScrollArea className='max-h-48'>
                                <div className='space-y-2'>
                                  {getExpertise?.otherDisciplines?.map(
                                    (area: any, index: number) => (
                                      <div
                                        key={index}
                                        className='text-muted-foreground text-sm'
                                      >
                                        • {area.area_of_expertise}
                                      </div>
                                    )
                                  )}
                                </div>
                              </ScrollArea>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side - Action buttons */}
                <div className='flex flex-col gap-3 sm:ml-auto lg:flex-row'>
                  <Button
                    variant='outline'
                    size='lg'
                    className='w-full sm:w-[200px]'
                  >
                    <MessageSquare className='mr-2 h-4 w-4' />
                    Message Expert
                  </Button>
                  <Button size='lg' className='w-full sm:w-[200px]'>
                    <Shield className='mr-2 h-4 w-4' />
                    Order Gatekeeper
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-10 w-10'
                      >
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success('Profile URL copied to clipboard');
                        }}
                      >
                        <Share2 className='mr-2 h-4 w-4' />
                        Share Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bookmark className='mr-2 h-4 w-4' />
                        Save Profile
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
