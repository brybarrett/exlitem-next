import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Presentation } from 'lucide-react';
import { formatDateString } from '@/composables/dates';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';
interface ReferenceSectionProps {
  reference: {
    reference_name: string;
    reference_type: string;
    reference_occupation: string;
    reference_description: string;
    country_code: string;
    reference_phone: string;
    reference_email: string;
    reference_address: string;
    reference_city: string;
    uuid?: string;
    display_setting: string;
  }[];
  isOwner: boolean;
  isAdmin: boolean;
  profileType: string;
  handleActionLoading: (isLoading: boolean) => void;
  setShowUpgradeDialog: (show: boolean) => void;
}

export function ReferenceSection({
  reference: initialReference,
  isOwner,
  isAdmin,
  profileType,
  handleActionLoading,
  setShowUpgradeDialog
}: ReferenceSectionProps) {
  const [reference, setReference] = useState(initialReference);
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

  if (!reference || reference.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>References</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <Presentation className='text-muted-foreground mb-4 h-12 w-12' />
            <p className='text-muted-foreground text-sm'>
              No references available.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>References</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {reference.map((reference, index) => (
            <div key={index} className='flex items-start justify-between gap-2'>
              <div className='flex gap-4'>
                <div className='bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg'>
                  <Presentation className='text-muted-foreground h-6 w-6' />
                </div>
                <div className='flex-1'>
                  <h3 className='font-medium'>
                    {reference.reference_type && (
                      <span className='bg-primary/10 text-primary mr-2 inline-block rounded px-2 py-0.5 text-xs font-semibold'>
                        {reference.reference_type}
                      </span>
                    )}
                    {reference.reference_name}
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    {reference.reference_occupation}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {reference.reference_phone}
                  </p>
                  {reference.reference_email &&
                    reference.reference_email.length > 0 && (
                      <p className='text-muted-foreground text-sm'>
                        {reference.reference_email}
                      </p>
                    )}
                </div>
              </div>
              {(isOwner || isAdmin) && (
                <div key={reference.uuid} className='flex items-center gap-1'>
                  <Label
                    htmlFor={reference.uuid}
                    className='flex items-center gap-2'
                  >
                    Private
                  </Label>
                  <Switch
                    id={reference.uuid}
                    checked={reference.display_setting === 'Public'}
                    onCheckedChange={async (checked) => {
                      const newDisplaySetting = checked ? 'Public' : 'Private';
                      try {
                        const updatedSetting = await updateDisplaySetting(
                          reference.uuid!,
                          'expert_reference',
                          newDisplaySetting,
                          reference.display_setting
                        );
                        setReference((prevReference) =>
                          prevReference.map((item) =>
                            item.uuid === reference.uuid
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
                    htmlFor={reference.uuid}
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
