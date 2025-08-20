'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface ExpertiseAreaCardProps {
  id: string;
  name: string;
  subcategories: string[];
  expertCount?: number;
  onClick?: (areaId: string) => void;
}

export function ExpertiseAreaCard({
  id,
  name,
  subcategories,
  expertCount,
  onClick
}: ExpertiseAreaCardProps) {
  return (
    <Card
      className='group hover:border-primary/20 bg-card/50 hover:bg-card cursor-pointer transition-all hover:shadow-md'
      onClick={() => onClick?.(id)}
    >
      <CardContent className='p-4'>
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='text-foreground group-hover:text-primary text-lg font-semibold transition-colors'>
            {name}
          </h3>
          <ChevronRight className='text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors' />
        </div>

        <div className='mb-3 flex flex-wrap gap-1'>
          {subcategories.slice(0, 3).map((sub, index) => (
            <Badge key={index} variant='secondary' className='text-xs'>
              {sub}
            </Badge>
          ))}
          {subcategories.length > 3 && (
            <Badge variant='outline' className='text-xs'>
              +{subcategories.length - 3} more
            </Badge>
          )}
        </div>

        {expertCount && (
          <p className='text-muted-foreground text-sm'>
            {expertCount} experts available
          </p>
        )}
      </CardContent>
    </Card>
  );
}
