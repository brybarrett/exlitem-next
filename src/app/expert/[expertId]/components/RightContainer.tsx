import {
  CheckCircle2,
  Star,
  TrendingUp,
  Users,
  FileText,
  Award
} from 'lucide-react';
import { GatekeeperReportTeaser } from './GatekeeperReportTeaser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function RightContainer({
  expert,
  visibilitySettings
}: {
  expert: any;
  visibilitySettings: any;
}) {
  return (
    <div className='space-y-6'>
      {/* {visibilitySettings.find((item: any) => item.key == 'show_gatekeeper_teaser')?.value && ( */}
      <GatekeeperReportTeaser expert={expert} />
      {/* // )} */}

      {/* Claimed */}
      {expert?.profile_type == 'Claimed' && (
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Verification Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-3 text-sm'>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
                  <span>Full Gatekeeper Report access</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
                  <span>Direct messaging capabilities</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
                  <span>Profile visibility controls</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
                  <span>Analytics and insights</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-500' />
                  <span>Priority in search results</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Edit Profile Card */}
          <Card className='border-primary/20 bg-primary/5'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Edit className='h-4 w-4' />
                Manage Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-muted-foreground text-sm'>
                As the profile owner, you can update your information while
                verification is pending.
              </p>
              <Button variant='outline' className='w-full'>
                <Edit className='mr-2 h-4 w-4' />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Verified */}
      {expert?.profile_type == 'Verified' && (
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Expert Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                    <Users className='h-4 w-4' />
                    <span>Profile Views</span>
                  </div>
                  <span className='font-medium'>2,847</span>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                    <Star className='h-4 w-4' />
                    <span>Average Rating</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className='font-medium'>4.9</span>
                    <span className='text-muted-foreground text-sm'>(47)</span>
                  </div>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                    <TrendingUp className='h-4 w-4' />
                    <span>Response Rate</span>
                  </div>
                  <span className='font-medium'>98%</span>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                    <FileText className='h-4 w-4' />
                    <span>Cases Reviewed</span>
                  </div>
                  <span className='font-medium'>
                    {expert.expertExperience?.cases || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Preview */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-lg'>Recent Reviews</CardTitle>
                <Badge variant='secondary'>4.9 ★</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <div className='flex gap-0.5'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className='h-3 w-3 fill-amber-400 text-amber-400'
                        />
                      ))}
                    </div>
                    <span className='text-muted-foreground text-sm'>
                      2 weeks ago
                    </span>
                  </div>
                  <p className='text-sm'>
                    "Exceptional expertise and thorough analysis. Highly
                    recommended for complex medical cases."
                  </p>
                </div>
                <Separator />
                <Button variant='link' className='h-auto w-full p-0'>
                  View all reviews →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Premium */}
      {expert?.profile_type == 'Premium' && (
        <div className='space-y-6'>
          {/* Enhanced Stats */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Expert Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <div className='mb-2 flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>
                      Client Satisfaction
                    </span>
                    <span className='text-sm font-medium'>98%</span>
                  </div>
                  <Progress value={98} className='h-2' />
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                    <Star className='h-4 w-4' />
                    <span>Average Rating</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className='font-medium'>4.9</span>
                    <span className='text-muted-foreground text-sm'>(127)</span>
                  </div>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                    <TrendingUp className='h-4 w-4' />
                    <span>Response Rate</span>
                  </div>
                  <span className='font-medium'>99.2%</span>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                    <FileText className='h-4 w-4' />
                    <span>Total Cases</span>
                  </div>
                  <span className='font-medium'>
                    {expert.expertExperience?.cases || 0}+
                  </span>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                    <Award className='h-4 w-4' />
                    <span>Success Rate</span>
                  </div>
                  <span className='font-medium'>94%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Reviews */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-lg'>Featured Reviews</CardTitle>
                <Badge className='bg-amber-100 text-amber-700'>Top Rated</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <div className='flex gap-0.5'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className='h-3 w-3 fill-amber-400 text-amber-400'
                        />
                      ))}
                    </div>
                    <Badge variant='secondary' className='text-xs'>
                      U.S. District Court Judge
                    </Badge>
                  </div>
                  <p className='text-sm'>
                    "..testimony is reliable and helpful to the jury. will be
                    admitted."
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    Medical Malpractice Case • 1 week ago
                  </p>
                </div>
                <Separator />
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <div className='flex gap-0.5'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className='h-3 w-3 fill-amber-400 text-amber-400'
                        />
                      ))}
                    </div>
                    <Badge variant='secondary' className='text-xs'>
                      Verified Client
                    </Badge>
                  </div>
                  <p className='text-sm'>
                    "Thorough analysis and clear communication throughout the
                    process."
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    Personal Injury Case • 2 weeks ago
                  </p>
                </div>
                <Separator />
                <Button variant='link' className='h-auto w-full p-0'>
                  View all 127 reviews →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
