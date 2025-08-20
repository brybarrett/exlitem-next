'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Grid, List } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ExpertCard } from '@/components/directory/ExpertCard';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { SearchFilters } from '@/components/directory/SearchFilters';

interface FitlerData {
  query?: string;
  page: number;
  page_size: number;
  sort_by?: string;
  filter_area_of_expertise?: string;
  filter_state?: string;
  filter_country?: string;
  availability?: boolean;
  verified?: boolean;
  mustHaveEmail?: boolean;
  mustHavePhone?: boolean;
}

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'response_time', label: 'Fastest Response' },
  { value: 'rate_low', label: 'Lowest Rate' },
  { value: 'rate_high', label: 'Highest Rate' }
];

export default function TestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const abortControllerRef = useRef<AbortController | null>(null);
  const [filters, setFilters] = useState<FitlerData>({
    query: searchParams.get('query') || '',
    page: Number(searchParams.get('page')) || 1,
    page_size: Number(searchParams.get('page_size')) || 12,
    sort_by: searchParams.get('sort_by') || 'relevance',
    filter_area_of_expertise:
      searchParams.get('filter_area_of_expertise') || '',
    filter_state: searchParams.get('filter_state') || '',
    filter_country: searchParams.get('filter_country') || '',
    availability: searchParams.get('availability') === 'true' ? true : false,
    verified: searchParams.get('verified') === 'true' ? true : false,
    mustHaveEmail: searchParams.get('mustHaveEmail') === 'true' ? true : false,
    mustHavePhone: searchParams.get('mustHavePhone') === 'true' ? true : false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [totalExperts, setTotalExperts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [experts, setExperts] = useState<any[]>([]);
  const [filteroptions, setFilteroptions] = useState<any>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getPrimaryAddress = (data: any) => {
    if (data?.length) {
      let responseAddress: any = {
        city: '',
        state: ''
      };
      let primary_address = data?.find((address: any) => address.is_primary);
      if (primary_address) {
        if (primary_address.city) responseAddress.city = primary_address.city;
        if (primary_address?.state?.label)
          responseAddress.state = primary_address.state.label;
      } else {
        responseAddress.city = data[0]?.city || '';
        responseAddress.state = data[0]?.state?.label || '';
      }
      return responseAddress;
    }
    return null;
  };

  const getPrimaryExpertise = (expert: any) => {
    let obj: any = {};
    let primaryExperties = '';
    if (
      expert?.expert_area_of_expertise &&
      expert?.expert_area_of_expertise?.length
    ) {
      let sortedArray = expert.expert_area_of_expertise.sort(
        (a: any, b: any) => b.is_primary - a.is_primary
      );
      let experties = sortedArray
        .slice(0, 1)
        .map((item: any) => item.area_of_expertise);
      primaryExperties = experties.join(',');
      if (sortedArray.length > 1) {
        let otherExperties = sortedArray.slice(1);
        let otherDetails = otherExperties.map((item: any) => {
          try {
            if (item.area_of_expertise) return item.area_of_expertise;
          } catch (e) {
            return item.area_of_expertise;
          }
          return '';
        });
        obj['other'] = otherDetails;
      }
    }
    obj['experties'] = primaryExperties.replaceAll(',', ', ');
    return obj;
  };

  const removeEmptyFilters = (filters: any) => {
    return Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => {
        if (value === null || value === undefined || value === '') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === 'object' && !Array.isArray(value)) {
          // For objects like feeRange, check if they have meaningful values
          const objValue = value as any;
          if (objValue.min === 200 && objValue.max === 2000) return false; // Default range
          return true;
        }
        return true;
      })
    );
  };

  const getExperts = useCallback(async () => {
    // Set loading only if there's no existing request
    if (!abortControllerRef.current) {
      setIsLoading(true);
    }

    try {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      const cleanedParams = removeEmptyFilters(filters);
      const response = await apiClient.get('/experts/expert_directory/', {
        params: cleanedParams,
        signal: abortControllerRef.current.signal
      });

      // Clear the abort controller after successful request
      abortControllerRef.current = null;

      setTotalExperts(response.data.count || 0);
      setTotalPages(response.data.total);
      setExperts(
        response.data.results.map((expert: any) => ({
          uuid: expert.uuid,
          first_name: expert.first_name,
          middle_name: expert.middle_name,
          last_name: expert.last_name,
          id: expert.id,
          name: `${expert.salutation || ''} ${expert.first_name || ''} ${expert.middle_name || ''} ${expert.last_name || ''} ${expert.professional_suffix || ''}`.trim(),
          title: getPrimaryExpertise(expert)?.experties,
          imageUrl: expert.profile_image,
          isVerified: expert.profile_claimed,
          status: expert.profile_claimed ? 'claimed' : 'unclaimed',
          practiceAreas: getPrimaryExpertise(expert)?.other,
          location: getPrimaryAddress(expert.expert_address),
          bio: expert.profile_introduction || '',
          specialties: getPrimaryExpertise(expert)?.other || [],
          rating: expert.rating || 4,
          reviewCount: expert.review_count,
          languages: expert.languages || ['English'],
          gatekeeperDataAvailable: true,
          isAvailable: true,
          avgResponseTime: '2 hours',
          profile_type: expert.profile_type
        }))
      );
      const newFilterOptions = {
        disciplines:
          response?.data?.aggregations?.area_of_expertise_agg?.buckets,
        country_states: response?.data?.aggregations?.country_state_agg?.buckets
      };

      setFilteroptions(newFilterOptions);
      setIsLoading(false);
    } catch (e: any) {
      // Only show error if it's not a cancellation error
      if (e.name !== 'CanceledError') {
        toast.error(e.response?.data?.detail || 'Failed to fetch the experts.');
        setIsLoading(false);
      }
      // Clear the abort controller on error
      abortControllerRef.current = null;
    }
  }, [filters]);

  useEffect(() => {
    let params = removeEmptyFilters(filters);
    router.push(`/directory?${new URLSearchParams(params as any).toString()}`);
    getExperts();
  }, [filters, getExperts]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className='flex min-h-screen flex-col'>
      <main className='bg-muted/30 flex-1'>
        <div className='container mx-auto px-4 py-8'>
          {/* Page Header */}
          <div className='mb-8'>
            <h1 className='mb-2 text-3xl font-bold'>
              Expert Witness Directory
            </h1>
            <p className='text-muted-foreground text-lg'>
              Find qualified expert witnesses for your case
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
            {/* Sidebar - Filters */}
            <div className='lg:col-span-1'>
              <div className='sticky top-16 z-10'>
                <SearchFilters
                  filters={filters}
                  totalExperts={totalExperts || 0}
                  onFiltersChange={setFilters}
                  filteroptions={filteroptions}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className='lg:col-span-3'>
              {/* Results Header */}
              <div className='bg-background mb-6 flex items-center justify-between rounded-lg border p-4'>
                <div className='flex items-center gap-4'>
                  <div className='text-muted-foreground text-sm'>
                    {experts.length > 0 && (
                      <span>
                        Showing {(filters.page - 1) * filters.page_size + 1} to{' '}
                        {Math.min(
                          filters.page * filters.page_size,
                          totalExperts
                        )}{' '}
                        of {totalExperts} experts
                      </span>
                    )}
                  </div>

                  {/* Featured Experts Badge */}
                  {experts.some((e) => e.status === 'premium') && (
                    <Badge
                      variant='outline'
                      className='border-amber-200 text-amber-600'
                    >
                      Premium experts available
                    </Badge>
                  )}
                </div>

                <div className='flex items-center gap-4'>
                  {/* Sort */}
                  <div className='flex items-center gap-2'>
                    {/* <ArrowUpDown className='text-muted-foreground h-4 w-4' /> */}
                    <Select
                      value={filters.sort_by}
                      onValueChange={(value) =>
                        setFilters({ ...filters, sort_by: value })
                      }
                    >
                      <SelectTrigger className='w-[180px]'>
                        <div className='flex items-center gap-2'>
                          <ArrowUpDown className='h-4 w-4' />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className='flex items-center rounded-md border'>
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size='sm'
                      onClick={() => setViewMode('grid')}
                      className='rounded-r-none'
                    >
                      <Grid className='h-4 w-4' />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size='sm'
                      onClick={() => setViewMode('list')}
                      className='rounded-l-none'
                    >
                      <List className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Loading Skeleton for loading state */}
              {isLoading ? (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'
                      : 'space-y-4'
                  }
                >
                  {Array.from({ length: viewMode === 'grid' ? 6 : 4 }).map(
                    (_, i) =>
                      viewMode === 'grid' ? (
                        <Card
                          key={i}
                          className='h-full transition-shadow hover:shadow-lg'
                        >
                          <CardHeader className='pb-3'>
                            <div className='flex items-start gap-3'>
                              <Skeleton className='h-12 w-12 rounded-full' />
                              <div className='min-w-0 flex-1'>
                                <div className='mb-1 flex items-center gap-2'>
                                  <Skeleton className='h-5 w-[150px]' />
                                  <Skeleton className='h-3 w-3 rounded-full' />
                                </div>
                                <Skeleton className='h-4 w-[200px]' />
                              </div>
                            </div>
                            <div className='mt-2 flex items-center justify-between'>
                              <Skeleton className='h-5 w-[80px]' />
                              <Skeleton className='h-5 w-[80px]' />
                            </div>
                          </CardHeader>
                          <CardContent className='space-y-4'>
                            <div className='space-y-2'>
                              <Skeleton className='h-4 w-full' />
                              <Skeleton className='h-4 w-[90%]' />
                            </div>
                            <div className='flex flex-wrap gap-2'>
                              <Skeleton className='h-5 w-[100px]' />
                              <Skeleton className='h-5 w-[80px]' />
                              <Skeleton className='h-5 w-[120px]' />
                            </div>
                            <div className='space-y-3 pt-4'>
                              <Skeleton className='h-9 w-full' />
                              <Skeleton className='h-9 w-full' />
                              <Skeleton className='h-9 w-full' />
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card
                          key={i}
                          className='transition-shadow hover:shadow-lg'
                        >
                          <CardContent className='p-6'>
                            <div className='flex gap-6'>
                              <Skeleton className='h-20 w-20 flex-shrink-0 rounded-full' />
                              <div className='min-w-0 flex-1'>
                                <div className='mb-2 flex items-start justify-between'>
                                  <div>
                                    <div className='flex items-center gap-2'>
                                      <Skeleton className='h-6 w-[200px]' />
                                      <Skeleton className='h-4 w-4 rounded-full' />
                                    </div>
                                    <Skeleton className='mt-1 h-4 w-[150px]' />
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <Skeleton className='h-6 w-[100px]' />
                                    <Skeleton className='h-6 w-[80px]' />
                                  </div>
                                </div>
                                <div className='space-y-4'>
                                  <div className='space-y-2'>
                                    <Skeleton className='h-4 w-full' />
                                    <Skeleton className='h-4 w-[90%]' />
                                  </div>
                                  <div className='flex flex-wrap gap-2'>
                                    <Skeleton className='h-6 w-[120px]' />
                                    <Skeleton className='h-6 w-[100px]' />
                                    <Skeleton className='h-6 w-[140px]' />
                                  </div>
                                </div>
                              </div>
                              <div className='flex w-48 flex-col gap-3'>
                                <div className='text-center'>
                                  <Skeleton className='h-7 w-full' />
                                  <Skeleton className='mx-auto mt-1 h-4 w-[80px]' />
                                </div>
                                <div className='flex flex-col gap-3'>
                                  <Skeleton className='h-9 w-full' />
                                  <Skeleton className='h-9 w-full' />
                                  <Skeleton className='h-9 w-full' />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                  )}
                </div>
              ) : experts.length === 0 ? (
                <div className='py-12 text-center'>
                  <div className='text-muted-foreground mb-4'>
                    No experts found matching your criteria
                  </div>
                </div>
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'
                      : 'space-y-4'
                  }
                >
                  {experts.map((expert) => (
                    <ExpertCard
                      key={expert.id}
                      expert={expert}
                      variant={viewMode}
                    />
                  ))}
                </div>
              )}

              {/* Load More - Placeholder for pagination */}
              {experts.length > 0 && (
                <div className='mt-8 flex flex-col gap-4'>
                  <div className='flex flex-wrap items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm'>Show</span>
                      <Select
                        value={filters.page_size?.toString()}
                        onValueChange={(value) => {
                          setFilters({
                            ...filters,
                            page_size: parseInt(value)
                          });
                        }}
                      >
                        <SelectTrigger className='w-[70px]'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[12, 24, 50, 100].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className='text-sm'>per page</span>
                    </div>
                    <div className='w-auto'>
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                setFilters({
                                  ...filters,
                                  page: Math.max(1, filters.page - 1)
                                })
                              }
                              className={
                                filters.page === 1
                                  ? 'pointer-events-none opacity-50'
                                  : ''
                              }
                            />
                          </PaginationItem>

                          {/* First Page */}
                          <PaginationItem>
                            <PaginationLink
                              onClick={() =>
                                setFilters({ ...filters, page: 1 })
                              }
                              isActive={filters.page === 1}
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>

                          {/* Left Ellipsis */}
                          {filters.page > 3 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}

                          {/* Pages around current page */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((pageNumber) => {
                              if (pageNumber === 1 || pageNumber === totalPages)
                                return false;
                              return Math.abs(pageNumber - filters.page) <= 1;
                            })
                            .map((pageNumber) => (
                              <PaginationItem key={pageNumber}>
                                <PaginationLink
                                  onClick={() =>
                                    setFilters({ ...filters, page: pageNumber })
                                  }
                                  isActive={filters.page === pageNumber}
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </PaginationItem>
                            ))}

                          {/* Right Ellipsis */}
                          {filters.page < totalPages - 2 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}

                          {/* Last Page */}
                          {totalPages > 1 && (
                            <PaginationItem>
                              <PaginationLink
                                onClick={() =>
                                  setFilters({ ...filters, page: totalPages })
                                }
                                isActive={filters.page === totalPages}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          )}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                setFilters({
                                  ...filters,
                                  page: Math.min(totalPages, filters.page + 1)
                                })
                              }
                              className={
                                filters.page === totalPages
                                  ? 'pointer-events-none opacity-50'
                                  : ''
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
