'use client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Crown,
  Zap,
  Settings,
  Eye,
  EyeOff,
  Target,
  BarChart3,
  Award,
  Clock
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUp } from 'lucide-react';

export function Premium({
  visibilitySettings,
  toggleVisibility,
  isOwner,
  isAdmin,
  isActionLoading
}: any) {
  const analyticsData = {
    viewsThisMonth: 3847,
    viewsChange: 23,
    inquiriesThisMonth: 142,
    inquiriesChange: 15,
    conversionRate: 3.7,
    conversionChange: 0.5,
    avgResponseTime: '2h 15m'
  };
  return (
    <div className='mt-6 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 dark:border-amber-900 dark:from-amber-950/20 dark:to-orange-950/20'>
      {/* Premium Badge Banner */}
      <div className='mt-6 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 dark:border-amber-900 dark:from-amber-950/20 dark:to-orange-950/20'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='rounded-full bg-amber-100 p-2 dark:bg-amber-900/50'>
              <Crown className='h-5 w-5 text-amber-600' />
            </div>
            <div>
              <p className='flex items-center gap-2 font-medium text-amber-900 dark:text-amber-100'>
                Premium Expert
                <Badge className='bg-amber-600 hover:bg-amber-700'>
                  <Zap className='mr-1 h-3 w-3' />
                  Featured
                </Badge>
              </p>
              <p className='text-sm text-amber-700 dark:text-amber-300'>
                Priority placement • Enhanced analytics • Premium support
              </p>
            </div>
          </div>
          {(isOwner || isAdmin) && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='border-amber-300'
                >
                  <Settings className='mr-2 h-4 w-4' />
                  Advanced Settings
                </Button>
              </SheetTrigger>
              <SheetContent className='w-[400px] px-4 sm:w-[540px]'>
                <SheetHeader>
                  <SheetTitle>Advanced Profile Settings</SheetTitle>
                  <SheetDescription>
                    Fine-tune your profile visibility and features
                  </SheetDescription>
                </SheetHeader>
                <Tabs defaultValue='visibility' className='mt-6'>
                  <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='visibility'>Visibility</TabsTrigger>
                    <TabsTrigger value='features'>Features</TabsTrigger>
                  </TabsList>
                  <TabsContent value='visibility' className='space-y-4'>
                    {visibilitySettings.map((value: any) => (
                      <div
                        key={value.key}
                        className='flex items-center justify-between'
                      >
                        <Label
                          htmlFor={value.key}
                          className='flex items-center gap-2 capitalize'
                        >
                          {value.value ? (
                            <Eye className='h-4 w-4' />
                          ) : (
                            <EyeOff className='h-4 w-4' />
                          )}
                          {value.label
                            .replaceAll('_', ' ')
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^show /, '')
                            .trim()}
                        </Label>
                        <Switch
                          id={value.key}
                          disabled={isActionLoading}
                          checked={value.value}
                          onCheckedChange={() =>
                            toggleVisibility(value.key, value.value)
                          }
                        />
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value='features' className='space-y-4'>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <Label className='flex items-center gap-2'>
                          <Target className='h-4 w-4' />
                          Priority Placement
                        </Label>
                        <Badge variant='secondary'>Active</Badge>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Label className='flex items-center gap-2'>
                          <BarChart3 className='h-4 w-4' />
                          Advanced Analytics
                        </Label>
                        <Badge variant='secondary'>Active</Badge>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Label className='flex items-center gap-2'>
                          <Award className='h-4 w-4' />
                          Featured Badge
                        </Label>
                        <Switch defaultChecked />
                      </div>
                      <div className='flex items-center justify-between'>
                        <Label className='flex items-center gap-2'>
                          <Clock className='h-4 w-4' />
                          Response Time Display
                        </Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      {/* Analytics Preview - Premium Only */}
      {isOwner && (
        <Card className='mt-6 border-amber-200/50'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <BarChart3 className='h-5 w-5' />
              Performance Analytics
              <Badge variant='outline' className='ml-auto'>
                Last 30 days
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              <div className='space-y-2'>
                <p className='text-muted-foreground text-sm'>Profile Views</p>
                <p className='text-2xl font-bold'>
                  {analyticsData.viewsThisMonth.toLocaleString()}
                </p>
                <div className='flex items-center gap-1 text-sm'>
                  <ArrowUp className='h-3 w-3 text-green-500' />
                  <span className='text-green-500'>
                    +{analyticsData.viewsChange}%
                  </span>
                </div>
              </div>
              <div className='space-y-2'>
                <p className='text-muted-foreground text-sm'>Inquiries</p>
                <p className='text-2xl font-bold'>
                  {analyticsData.inquiriesThisMonth}
                </p>
                <div className='flex items-center gap-1 text-sm'>
                  <ArrowUp className='h-3 w-3 text-green-500' />
                  <span className='text-green-500'>
                    +{analyticsData.inquiriesChange}%
                  </span>
                </div>
              </div>
              <div className='space-y-2'>
                <p className='text-muted-foreground text-sm'>Conversion Rate</p>
                <p className='text-2xl font-bold'>
                  {analyticsData.conversionRate}%
                </p>
                <div className='flex items-center gap-1 text-sm'>
                  <ArrowUp className='h-3 w-3 text-green-500' />
                  <span className='text-green-500'>
                    +{analyticsData.conversionChange}%
                  </span>
                </div>
              </div>
              <div className='space-y-2'>
                <p className='text-muted-foreground text-sm'>Avg Response</p>
                <p className='text-2xl font-bold'>
                  {analyticsData.avgResponseTime}
                </p>
                <Progress value={85} className='h-2' />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
