import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { formatDateString } from '@/composables/dates';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';
interface AwardsHonorsSectionProps {
  awards_honors: {
    honor_type: string;
    honor_title: string;
    honor_description: string;
    given_by: string;
    given_on_date: string;
    uuid?: string;
    display_setting: string;
  }[];
  isOwner: boolean;
  isAdmin: boolean;
  profileType: string;
  handleActionLoading: (isLoading: boolean) => void;
  setShowUpgradeDialog: (show: boolean) => void;
}

export function AwardsHonorsSection({
  awards_honors: initialAwardsHonors,
  isOwner,
  isAdmin,
  profileType,
  handleActionLoading,
  setShowUpgradeDialog
}: AwardsHonorsSectionProps) {
  const [awards_honors, setAwardsHonors] = useState(initialAwardsHonors);
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
  if (!awards_honors || awards_honors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>
            Awards & Honors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <Award className='text-muted-foreground mb-4 h-12 w-12' />
            <p className='text-muted-foreground text-sm'>
              No awards & honors available.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>Awards & Honors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {awards_honors.map((award, index) => (
            <div key={index} className='flex items-start justify-between gap-2'>
              <div className='flex gap-4'>
                <div className='bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg'>
                  <Award className='text-muted-foreground h-6 w-6' />
                </div>
                <div className='flex-1'>
                  <h3 className='font-medium'>{award.honor_title}</h3>
                  <p className='text-muted-foreground text-sm'>
                    {award.given_by ? `by ${award.given_by}` : ''}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {formatDateString(award.given_on_date)}
                  </p>
                  {award.honor_description &&
                    award.honor_description.length > 0 && (
                      <p className='text-muted-foreground text-sm capitalize'>
                        {award.honor_description}
                      </p>
                    )}
                </div>
              </div>
              {(isOwner || isAdmin) && (
                <div key={award.uuid} className='flex items-center gap-1'>
                  <Label
                    htmlFor={award.uuid}
                    className='flex items-center gap-2'
                  >
                    Private
                  </Label>
                  <Switch
                    id={award.uuid}
                    checked={award.display_setting === 'Public'}
                    onCheckedChange={async (checked) => {
                      const newDisplaySetting = checked ? 'Public' : 'Private';
                      try {
                        const updatedSetting = await updateDisplaySetting(
                          award.uuid!,
                          'expert_award_honor',
                          newDisplaySetting,
                          award.display_setting
                        );
                        setAwardsHonors((prevAwards) =>
                          prevAwards.map((item) =>
                            item.uuid === award.uuid
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
                    htmlFor={award.uuid}
                    className='flex items-center gap-2'
                  >
                    Public
                  </Label>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
