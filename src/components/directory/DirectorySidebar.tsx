'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Users } from 'lucide-react';
import { practiceAreas } from '@/lib/mock-data/practice-areas';
import { mockExperts } from '@/lib/mock-data/experts';

interface DirectorySidebarProps {
  onExpertiseAreaClick: (areaId: string) => void;
  selectedArea?: string;
}

export function DirectorySidebar({
  onExpertiseAreaClick,
  selectedArea
}: DirectorySidebarProps) {
  return (
    <div className='space-y-6'>
      {/* Browse by Expertise */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Users className='h-5 w-5' />
            Browse by Expertise
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          {practiceAreas.map((area) => {
            const expertCount = mockExperts.filter((e) =>
              e.practiceAreas?.some(
                (pa) =>
                  area.subcategories.includes(pa) || pa.includes(area.name)
              )
            ).length;

            const isSelected = selectedArea === area.name;

            return (
              <Button
                key={area.id}
                variant={isSelected ? 'default' : 'ghost'}
                className='group hover:bg-primary/5 h-auto w-full justify-between p-3'
                onClick={() => onExpertiseAreaClick(area.id)}
              >
                <div className='flex flex-col items-start'>
                  <span className='text-sm font-medium'>{area.name}</span>
                  <span className='text-muted-foreground text-xs'>
                    {expertCount} experts
                  </span>
                </div>
                <ChevronRight className='text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors' />
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Directory Stats</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-sm'>Total Experts</span>
            <Badge variant='secondary'>{mockExperts.length}</Badge>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-sm'>
              Premium Experts
            </span>
            <Badge variant='default'>
              {mockExperts.filter((e) => e.status === 'Premium').length}
            </Badge>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-sm'>
              Practice Areas
            </span>
            <Badge variant='outline'>{practiceAreas.length}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
