import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Presentation } from 'lucide-react';
import { formatDateString } from '@/composables/dates';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';
interface PresentationSectionProps {
  presentation: {
    activity_type: string;
    activity_role: string;
    activity_title: string;
    activity_date: string;
    activity_location: string;
    expert_comment: string;
    uuid?: string;
    display_setting: string;
  }[];
  isOwner: boolean;
  isAdmin: boolean;
  profileType: string;
  handleActionLoading: (isLoading: boolean) => void;
  setShowUpgradeDialog: (show: boolean) => void;
}

export function PresentationSection({
  presentation: initialPresentation,
  isOwner,
  isAdmin,
  profileType,
  handleActionLoading,
  setShowUpgradeDialog
}: PresentationSectionProps) {
  const [presentation, setPresentation] = useState(initialPresentation);
  const updateDisplaySetting = async (
    uuid: string,
    model: string,
    display_setting: string,
    originalSetting: string
  ) => {
    if ((profileType == 'Claimed' || profileType == 'Unclaimed') && !isAdmin) {
      setShowUpgradeDialog(true);
      return originalSetting;
    }
    handleActionLoading(true);
    try {
      const response = await apiClient.patch(`/experts/${model}/${uuid}/`, {
        display_setting: display_setting
      });
      if (response?.data?.display_setting) {
        toast.success(
          response?.data?.detail ||
            `${model} display setting updated successfully`
        );
        return response.data.display_setting;
      }
      return originalSetting;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ||
          `Failed to update ${model} display setting`
      );
      return originalSetting;
    } finally {
      handleActionLoading(false);
    }
  };
  if (!presentation || presentation.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>
            Presentations And Conferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <Presentation className='text-muted-foreground mb-4 h-12 w-12' />
            <p className='text-muted-foreground text-sm'>
              No presentations and conferences available.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>
          Presentations And Conferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {presentation.map((presentation, index) => (
            <div key={index} className='flex items-start justify-between gap-2'>
              <div className='flex gap-4'>
                <div className='bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg'>
                  <Presentation className='text-muted-foreground h-6 w-6' />
                </div>
                <div className='flex-1'>
                  <h3 className='font-medium'>
                    {presentation.activity_type && (
                      <span className='bg-primary/10 text-primary mr-2 inline-block rounded px-2 py-0.5 text-xs font-semibold'>
                        {presentation.activity_type}
                      </span>
                    )}
                    {presentation.activity_title}
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    {presentation.activity_role}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {presentation.activity_location
                      ? `at ${presentation.activity_location} `
                      : ''}{' '}
                    {presentation.activity_date
                      ? `on ${formatDateString(presentation.activity_date)}`
                      : ''}
                  </p>
                  {presentation.expert_comment &&
                    presentation.expert_comment.length > 0 && (
                      <p className='text-muted-foreground text-sm capitalize'>
                        {presentation.expert_comment}
                      </p>
                    )}
                </div>
              </div>
              {isOwner ||
                (isAdmin && (
                  <div
                    key={presentation.uuid}
                    className='flex items-center gap-1'
                  >
                    <Label
                      htmlFor={presentation.uuid}
                      className='flex items-center gap-2'
                    >
                      Private
                    </Label>
                    <Switch
                      id={presentation.uuid}
                      checked={presentation.display_setting === 'Public'}
                      onCheckedChange={async (checked) => {
                        const newDisplaySetting = checked
                          ? 'Public'
                          : 'Private';
                        try {
                          const updatedSetting = await updateDisplaySetting(
                            presentation.uuid!,
                            'expert_networking_activity',
                            newDisplaySetting,
                            presentation.display_setting
                          );
                          setPresentation((prevPresentation) =>
                            prevPresentation.map((item) =>
                              item.uuid === presentation.uuid
                                ? { ...item, display_setting: updatedSetting }
                                : item
                            )
                          );
                        } catch (error) {
                          // Error is already handled in updateDisplaySetting
                        }
                      }}
                    />
                    <Label
                      htmlFor={presentation.uuid}
                      className='flex items-center gap-2'
                    >
                      Public
                    </Label>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
