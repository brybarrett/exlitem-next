'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Shield,
  TrendingUp,
  Lock,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  Info
} from 'lucide-react';
import type { ExpertProfile } from '@/types';
import type { ExpertStatus } from '../types';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface GatekeeperReportTeaserProps {
  expert: ExpertProfile;
}

interface StatusConfig {
  title: string;
  description: string;
  ctaText: string;
  ctaVariant: 'default' | 'secondary' | 'outline';
  icon: React.ReactNode;
  showMetrics: boolean;
  blurMetrics: boolean;
}

const statusConfigs: Record<ExpertStatus, StatusConfig> = {
  Unclaimed: {
    title: 'Gatekeeper Report Preview',
    description: 'Claim this profile to access the full report',
    ctaText: 'Claim Profile to Access',
    ctaVariant: 'secondary',
    icon: <Lock className='h-4 w-4' />,
    showMetrics: true,
    blurMetrics: true
  },
  Claimed: {
    title: 'Gatekeeper Report Preview',
    description: 'Complete verification for full report access',
    ctaText: 'Verify to Unlock Full Report',
    ctaVariant: 'secondary',
    icon: <AlertTriangle className='h-4 w-4' />,
    showMetrics: true,
    blurMetrics: true
  },
  Verified: {
    title: 'Gatekeeper Report',
    description: 'Professional credibility analysis',
    ctaText: 'View Full Report',
    ctaVariant: 'default',
    icon: <CheckCircle className='h-4 w-4' />,
    showMetrics: true,
    blurMetrics: false
  },
  Premium: {
    title: 'Gatekeeper Report',
    description: 'Independently Verified Expert Analytics',
    ctaText: 'View Full Report',
    ctaVariant: 'default',
    icon: <Shield className='h-4 w-4 text-amber-500' />,
    showMetrics: true,
    blurMetrics: false
  }
};

export function GatekeeperReportTeaser({
  expert
}: GatekeeperReportTeaserProps) {
  const status = (expert?.profile_type as ExpertStatus) || 'Unclaimed';
  const config = statusConfigs[status];
  const hasData = expert?.gatekeeperDataAvailable !== false;

  // Mock metrics for demonstration
  const mockMetrics = {
    challengeScore: 92,
    verifiedCredentials: 15,
    yearsExperience: expert?.expertExperience?.totalCases || 0
  };

  if (!hasData && status === 'Unclaimed') {
    return (
      <Card className='h-fit'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              Gatekeeper Report
            </CardTitle>
            <Badge variant='secondary'>Coming Soon</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='py-8 text-center'>
            <Clock className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <p className='text-muted-foreground mb-4'>
              Our team is preparing a comprehensive credibility report for this
              expert.
            </p>
            <Button variant='outline' disabled>
              <Lock className='mr-2 h-4 w-4' />
              Report in Progress
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasData && (status === 'Verified' || status === 'Premium')) {
    // Verified/Premium experts can hide this section if no data
    return null;
  }

  return (
    <Card className='h-fit'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              {config.title}
              {status === 'Premium' && (
                <Badge variant='default' className='bg-amber-500'>
                  Premium
                </Badge>
              )}
            </CardTitle>
            <p className='text-muted-foreground mt-1 text-sm'>
              {config.description}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className='text-muted-foreground h-4 w-4' />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Gatekeeper Reports provide independent verification of expert
                  credentials
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Key Metrics Preview */}
        {config.showMetrics && (
          <div
            className={cn(
              'grid grid-cols-3 gap-4',
              config.blurMetrics && 'relative'
            )}
          >
            {config.blurMetrics && (
              <div className='bg-background/50 absolute inset-0 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm'>
                <div className='text-center'>
                  <p className='mb-2 font-medium'>{config.icon}</p>
                  <p className='text-muted-foreground text-sm'>
                    {config.ctaText}
                  </p>
                </div>
              </div>
            )}

            <div className='bg-muted/50 rounded-lg p-4 text-center'>
              <div className='text-primary text-2xl font-bold'>
                {mockMetrics.challengeScore}%
              </div>
              <p className='text-muted-foreground mt-1 text-xs'>
                Expert Challenges Score
              </p>
            </div>

            <div className='bg-muted/50 rounded-lg p-4 text-center'>
              <div className='text-2xl font-bold'>
                {mockMetrics.verifiedCredentials}
              </div>
              <p className='text-muted-foreground mt-1 text-xs'>
                Verified Credentials
              </p>
            </div>

            <div className='bg-muted/50 rounded-lg p-4 text-center'>
              <div className='text-2xl font-bold'>
                {mockMetrics.yearsExperience}+
              </div>
              <p className='text-muted-foreground mt-1 text-xs'>
                Years Experience
              </p>
            </div>
          </div>
        )}

        {/* Report Highlights - Only for verified/premium */}
        {(status === 'Verified' || status === 'Premium') && (
          <div className='space-y-3'>
            <h4 className='text-sm font-medium'>Report Highlights</h4>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                <span>All licenses verified and current</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                <span>No disciplinary actions found</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <TrendingUp className='h-4 w-4 text-blue-500' />
                <span>Above average case experience</span>
              </div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Button
          className='w-full'
          variant={config.ctaVariant}
          disabled={!hasData && status === 'Claimed'}
        >
          {!hasData && status === 'Claimed' ? (
            <>
              <Clock className='mr-2 h-4 w-4' />
              Report in Progress
            </>
          ) : (
            <>
              {config.icon && <span className='mr-2'>{config.icon}</span>}
              {config.ctaText}
              <ArrowRight className='ml-2 h-4 w-4' />
            </>
          )}
        </Button>

        {/* Additional Info for Premium */}
        {status === 'Premium' && (
          <div className='border-t pt-2'>
            <div className='text-muted-foreground flex items-center gap-2 text-xs'>
              <BarChart3 className='h-3 w-3' />
              <span>Enhanced analytics and insights available</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
