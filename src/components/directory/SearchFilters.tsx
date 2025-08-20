'use client';

import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';
import debounce from 'lodash/debounce';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SearchFiltersProps {
  filters: any;
  filteroptions: any;
  onFiltersChange: (filters: any) => void;
  totalExperts?: number;
}

const SearchFiltersComponent = function SearchFilters({
  filteroptions,
  filters,
  totalExperts,
  onFiltersChange
}: SearchFiltersProps) {
  // Create a debounced version of onFiltersChange
  const [inputValue, setInputValue] = useState('');
  const [selectedStates, setSelectedStates] = useState<string[]>(
    filters?.filter_state ? filters?.filter_state?.trim().split(',') : []
  );
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    filters?.filter_country ? filters?.filter_country?.trim().split(',') : []
  );
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(
    filters?.filter_area_of_expertise
      ? filters?.filter_area_of_expertise?.trim().split(',')
      : []
  );
  const [visibleDisciplines, setVisibleDisciplines] = useState(10);
  const [availability, setAvailability] = useState(
    filters?.availability || false
  );
  const [verified, setVerified] = useState(filters?.verified || false);
  const [mustHaveEmail, setMustHaveEmail] = useState(
    filters?.mustHaveEmail || false
  );
  const [mustHavePhone, setMustHavePhone] = useState(
    filters?.mustHavePhone || false
  );

  // Search states for type-ahead functionality
  const [disciplineSearchValue, setDisciplineSearchValue] = useState('');
  const [countrySearchValue, setCountrySearchValue] = useState('');

  // Collapsible states for proper arrow icon behavior - expanded by default
  const [isDisciplinesOpen, setIsDisciplinesOpen] = useState(true);
  const [isCountryOpen, setIsCountryOpen] = useState(true);
  const [openCountryStates, setOpenCountryStates] = useState<Set<string>>(
    new Set()
  );
  const [disciplineSearchQuery] = useDebounce(disciplineSearchValue, 300);
  const [countrySearchQuery] = useDebounce(countrySearchValue, 300);

  const formatDisciplineName = (name: string, count: number) => {
    if (name.length <= 25) {
      return `${name} (${count})`;
    }
    return `${name.substring(0, 25)}... (${count})`;
  };

  const clearallFilters = () => {
    setSelectedDisciplines([]);
    setSelectedStates([]);
    setSelectedCountries([]);
    setAvailability(false);
    setVerified(false);
    setMustHaveEmail(false);
    setMustHavePhone(false);
    setInputValue('');
    setDisciplineSearchValue('');
    setCountrySearchValue('');
    setOpenCountryStates(new Set());
    setIsDisciplinesOpen(true);
    setIsCountryOpen(true);
    onFiltersChange({ page: 1, page_size: 12, sort_by: 'relevance' });
  };

  // Filtered disciplines based on search query - exclude active filters

  const filteredDisciplines = useMemo(() => {
    if (!filteroptions?.disciplines) return [];
    let filtered = filteroptions.disciplines;

    // First filter by search query if provided
    if (disciplineSearchQuery) {
      filtered = filtered.filter((discipline: any) =>
        discipline.key
          .toLowerCase()
          .includes(disciplineSearchQuery.toLowerCase())
      );
    }

    // Then exclude already selected disciplines to prevent duplication
    filtered = filtered.filter(
      (discipline: any) => !selectedDisciplines.includes(discipline.key)
    );

    return filtered;
  }, [filteroptions?.disciplines, disciplineSearchQuery, selectedDisciplines]);

  // Filtered countries based on search query - exclude active filters
  const filteredCountries = useMemo(() => {
    if (!filteroptions?.country_states) return [];
    let filtered = filteroptions.country_states;

    // First filter by search query if provided
    if (countrySearchQuery) {
      filtered = filtered.filter(
        (countryState: any) =>
          countryState.label
            .toLowerCase()
            .includes(countrySearchQuery.toLowerCase()) ||
          countryState.states?.some((state: any) =>
            state.label.toLowerCase().includes(countrySearchQuery.toLowerCase())
          )
      );
    }

    // Then exclude already selected countries to prevent duplication
    filtered = filtered.filter(
      (countryState: any) => !selectedCountries.includes(countryState.label)
    );

    // Finally filter out selected states from country state lists
    filtered = filtered.map((countryState: any) => ({
      ...countryState,
      states:
        countryState.states?.filter(
          (state: any) => !selectedStates.includes(state.label)
        ) || []
    }));

    return filtered;
  }, [
    filteroptions?.country_states,
    countrySearchQuery,
    selectedCountries,
    selectedStates
  ]);

  const toggleCountryState = (countryLabel: string) => {
    const newOpenStates = new Set(openCountryStates);
    if (newOpenStates.has(countryLabel)) {
      newOpenStates.delete(countryLabel);
    } else {
      newOpenStates.add(countryLabel);
    }
    setOpenCountryStates(newOpenStates);
  };

  const hasActiveFilters =
    inputValue ||
    selectedStates.length > 0 ||
    selectedCountries.length > 0 ||
    selectedDisciplines.length > 0 ||
    availability ||
    verified ||
    mustHaveEmail ||
    mustHavePhone;
  const debouncedSearch = useCallback(
    debounce((key: string, value: string) => {
      onFiltersChange({ ...filters, [key]: value });
    }, 500),
    [filters, onFiltersChange]
  );

  return (
    <div className='flex flex-col gap-4'>
      <Card>
        <CardContent>
          <div className='relative'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder='Search by name, expertise, or keyword...'
              defaultValue={filters?.query || ''}
              onChange={(e) => debouncedSearch('query', e.target.value)}
              className='pl-10'
            />
          </div>
        </CardContent>
      </Card>
      {hasActiveFilters && (
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Active Filters:</span>
            <Button
              variant='outline'
              size='sm'
              onClick={clearallFilters}
              className='h-7 px-2 text-xs'
            >
              Clear All
            </Button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {selectedDisciplines.map((discipline: string) => (
              <TooltipProvider key={discipline}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='bg-popover pointer-events-none line-clamp-1 flex max-w-full cursor-default items-center gap-1 rounded-lg border px-2 py-1 text-xs'>
                      <span className='mr-1 text-xs opacity-70'>D:</span>
                      {discipline}
                      <X
                        className='pointer-events-auto ml-1 h-3 w-3 cursor-pointer hover:opacity-70'
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const updatedDisciplines = selectedDisciplines.filter(
                            (d) => d !== discipline
                          );
                          setSelectedDisciplines(updatedDisciplines);
                          onFiltersChange({
                            ...filters,
                            filter_area_of_expertise:
                              updatedDisciplines.join(',')
                          });
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Discipline: {discipline}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

            {selectedStates.map((state: string) => (
              <TooltipProvider key={state}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='bg-popover pointer-events-none line-clamp-1 flex max-w-full cursor-default items-center gap-1 rounded-lg border px-2 py-1 text-xs'>
                      <span className='mr-1 text-xs opacity-70'>S:</span>
                      {state}
                      <X
                        className='pointer-events-auto ml-1 h-3 w-3 cursor-pointer hover:opacity-70'
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const updatedStates = selectedStates.filter(
                            (s) => s !== state
                          );
                          setSelectedStates(updatedStates);
                          onFiltersChange({
                            ...filters,
                            filter_state: updatedStates.join(',')
                          });
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>State: {state}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

            {selectedCountries.map((country: string) => (
              <TooltipProvider key={country}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='bg-popover pointer-events-none line-clamp-1 flex max-w-full cursor-default items-center gap-1 rounded-lg border px-2 py-1 text-xs'>
                      <span className='mr-1 text-xs opacity-70'>C:</span>
                      {country}
                      <X
                        className='pointer-events-auto ml-1 h-3 w-3 cursor-pointer hover:opacity-70'
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const newCountries = selectedCountries.filter(
                            (c) => c !== country
                          );
                          setSelectedCountries(newCountries);
                          onFiltersChange({
                            ...filters,
                            filter_country: newCountries.join(',')
                          });
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Country: {country}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      )}

      {/* Main filters Section */}
      <div className='space-y-4'>
        <Card>
          <CardHeader className='-mb-4'>
            <CardTitle className='text-md'>Filter Options</CardTitle>
          </CardHeader>
          <CardContent className='space-y-5'>
            {/* Disciplines Filters */}

            <Collapsible
              className='w-full'
              open={isDisciplinesOpen}
              onOpenChange={setIsDisciplinesOpen}
            >
              <CollapsibleTrigger className='bg-muted flex w-full items-center justify-between rounded-md p-2'>
                <span>Disciplines</span>
                {isDisciplinesOpen ? (
                  <ChevronUp className='ml-auto h-4 w-4' />
                ) : (
                  <ChevronDown className='ml-auto h-4 w-4' />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='mt-2 space-y-2'>
                  {/* Search input for disciplines */}
                  <div className='relative'>
                    <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                    <Input
                      placeholder='Search disciplines...'
                      value={disciplineSearchValue}
                      onChange={(e) => setDisciplineSearchValue(e.target.value)}
                      className='pl-10'
                    />
                  </div>
                  <ul className='max-h-60 space-y-1 overflow-y-auto pl-2 text-sm'>
                    {filteredDisciplines
                      ?.slice(0, visibleDisciplines)
                      ?.map((discipline: any) => (
                        <li key={discipline.key} className='flex items-center'>
                          <Checkbox
                            className='mr-2'
                            id={discipline.key}
                            checked={selectedDisciplines.includes(
                              discipline.key
                            )}
                            onCheckedChange={(checked: boolean) => {
                              const newDisciplines = checked
                                ? [...selectedDisciplines, discipline.key]
                                : selectedDisciplines.filter(
                                    (d: string) => d !== discipline.key
                                  );

                              setSelectedDisciplines(newDisciplines);
                              onFiltersChange({
                                ...filters,
                                filter_area_of_expertise:
                                  newDisciplines.join(',')
                              });
                            }}
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <label
                                  htmlFor={discipline.key}
                                  className='line-clamp-1 text-left'
                                >
                                  {formatDisciplineName(
                                    discipline.key,
                                    discipline.doc_count
                                  )}
                                </label>
                              </TooltipTrigger>
                              <TooltipContent>
                                {discipline.key} ({discipline.doc_count})
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </li>
                      ))}
                    {filteredDisciplines?.length > visibleDisciplines && (
                      <li className='mt-2'>
                        <span
                          className='text-primary cursor-pointer text-sm hover:underline'
                          onClick={() =>
                            setVisibleDisciplines(visibleDisciplines + 10)
                          }
                        >
                          Show More
                        </span>
                      </li>
                    )}
                    {filteredDisciplines?.length === 0 &&
                      disciplineSearchQuery && (
                        <li className='text-muted-foreground py-2 text-center text-sm'>
                          No disciplines found matching "{disciplineSearchQuery}
                          "
                        </li>
                      )}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Country state Filters */}
            <Collapsible
              className='w-full'
              open={isCountryOpen}
              onOpenChange={setIsCountryOpen}
            >
              <CollapsibleTrigger className='bg-muted flex w-full items-center justify-between rounded-md p-2'>
                <span>Country</span>
                {isCountryOpen ? (
                  <ChevronUp className='ml-auto h-4 w-4' />
                ) : (
                  <ChevronDown className='ml-auto h-4 w-4' />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='mt-2 space-y-1'>
                  {/* Search input for countries */}
                  <div className='relative'>
                    <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                    <Input
                      placeholder='Search countries/states...'
                      value={countrySearchValue}
                      onChange={(e) => setCountrySearchValue(e.target.value)}
                      className='pl-10'
                    />
                  </div>
                  <ul className='max-h-60 overflow-y-auto pl-2 text-sm'>
                    {filteredCountries
                      ?.slice(0, 10)
                      ?.map(
                        (country_state: {
                          states: any[];
                          label: string;
                          doc_count: number;
                        }) =>
                          country_state?.states?.length > 0 ? (
                            <Collapsible
                              key={country_state.label}
                              className='w-full'
                              open={openCountryStates.has(country_state.label)}
                              onOpenChange={() =>
                                toggleCountryState(country_state.label)
                              }
                            >
                              <div className='flex w-full items-center justify-between rounded-md py-1'>
                                <div className='flex flex-1 items-center'>
                                  <Checkbox
                                    className='mr-2'
                                    id={country_state.label}
                                    checked={selectedCountries.includes(
                                      country_state.label
                                    )}
                                    onCheckedChange={(checked: boolean) => {
                                      if (checked) {
                                        setSelectedCountries((prev) => {
                                          const newCountries = [
                                            ...prev,
                                            country_state.label
                                          ];
                                          onFiltersChange({
                                            ...filters,
                                            filter_country:
                                              newCountries.join(',')
                                          });
                                          return newCountries;
                                        });
                                      } else {
                                        setSelectedCountries((prev) => {
                                          const newCountries = prev.filter(
                                            (s: string) =>
                                              s !== country_state.label
                                          );
                                          onFiltersChange({
                                            ...filters,
                                            filter_country:
                                              newCountries.join(',')
                                          });
                                          return newCountries;
                                        });
                                      }
                                    }}
                                  />
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <label
                                          htmlFor={country_state.label}
                                          className='line-clamp-1 text-left'
                                        >
                                          {country_state.label} (
                                          {country_state.doc_count})
                                        </label>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {country_state.label} (
                                        {country_state.doc_count})
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <CollapsibleTrigger className='ml-2 p-1'>
                                  {openCountryStates.has(
                                    country_state.label
                                  ) ? (
                                    <ChevronUp className='h-4 w-4' />
                                  ) : (
                                    <ChevronDown className='h-4 w-4' />
                                  )}
                                </CollapsibleTrigger>
                              </div>
                              <CollapsibleContent className='py-2'>
                                <ul className='space-y-1 pl-2'>
                                  {country_state.states
                                    ?.slice(0, 10)
                                    ?.map((state: any) => (
                                      <li key={state.label}>
                                        <Checkbox
                                          className='mr-2'
                                          id={state.label}
                                          checked={selectedStates.includes(
                                            state.label
                                          )}
                                          onCheckedChange={(
                                            checked: boolean
                                          ) => {
                                            const newStates = checked
                                              ? [...selectedStates, state.label]
                                              : selectedStates.filter(
                                                  (s: string) =>
                                                    s !== state.label
                                                );

                                            setSelectedStates(newStates);
                                            onFiltersChange({
                                              ...filters,
                                              filter_state: newStates.join(',')
                                            });
                                          }}
                                        />
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger>
                                              <label htmlFor={state.label}>
                                                {state.label} ({state.doc_count}
                                                )
                                              </label>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              {state.label} ({state.doc_count})
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </li>
                                    ))}
                                </ul>
                              </CollapsibleContent>
                            </Collapsible>
                          ) : (
                            <li key={country_state.label}>
                              <Checkbox
                                className='mr-2'
                                id={country_state.label}
                                checked={selectedCountries.includes(
                                  country_state.label
                                )}
                                onCheckedChange={(checked: boolean) => {
                                  if (checked) {
                                    setSelectedCountries((prev) => {
                                      const newCountries = [
                                        ...prev,
                                        country_state.label
                                      ];
                                      onFiltersChange({
                                        ...filters,
                                        filter_country: newCountries.join(',')
                                      });
                                      return newCountries;
                                    });
                                  } else {
                                    setSelectedCountries((prev) => {
                                      const newCountries = prev.filter(
                                        (s: string) => s !== country_state.label
                                      );
                                      onFiltersChange({
                                        ...filters,
                                        filter_country: newCountries.join(',')
                                      });
                                      return newCountries;
                                    });
                                  }
                                }}
                              />
                              <label htmlFor={country_state.label}>
                                {country_state.label}
                              </label>
                            </li>
                          )
                      )}
                    {filteredCountries?.length === 0 && countrySearchQuery && (
                      <li className='text-muted-foreground py-2 text-center text-sm'>
                        No countries/states found matching "{countrySearchQuery}
                        "
                      </li>
                    )}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className='space-y-4'>
              {/* Additional Options */}
              <div className='space-y-3'>
                <Label>Additional Options</Label>
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='availability'
                      checked={availability}
                      onCheckedChange={(checked) => {
                        const isAvailable = !!checked;
                        setAvailability(isAvailable);
                        onFiltersChange({
                          ...filters,
                          availability: isAvailable
                        });
                      }}
                    />
                    <Label htmlFor='availability' className='text-sm'>
                      Available for immediate engagement
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='verified'
                      checked={verified}
                      onCheckedChange={(checked) => {
                        const isVerified = !!checked;
                        setVerified(isVerified);
                        onFiltersChange({ ...filters, verified: isVerified });
                      }}
                    />
                    <Label htmlFor='verified' className='text-sm'>
                      Verified experts only
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='mustHaveEmail'
                      checked={mustHaveEmail}
                      onCheckedChange={(checked) => {
                        const hasEmail = !!checked;
                        setMustHaveEmail(hasEmail);
                        onFiltersChange({
                          ...filters,
                          mustHaveEmail: hasEmail
                        });
                      }}
                    />
                    <Label htmlFor='mustHaveEmail' className='text-sm'>
                      Must have email
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='mustHavePhone'
                      checked={mustHavePhone}
                      onCheckedChange={(checked) => {
                        const hasPhone = !!checked;
                        setMustHavePhone(hasPhone);
                        onFiltersChange({
                          ...filters,
                          mustHavePhone: hasPhone
                        });
                      }}
                    />
                    <Label htmlFor='mustHavePhone' className='text-sm'>
                      Must have phone
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const SearchFilters = memo(SearchFiltersComponent);
