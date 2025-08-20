import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, GraduationCap } from 'lucide-react';
import type { ExpertProfile } from '@/types';
import { formatDateString } from '@/composables/dates';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';

interface CredentialsSectionProps {
  licenses: {
    credential_name: string;
    credential_provider: string;
    year: string;
    state: string;
    number: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    credential_number: string;
    uuid?: string;
    display_setting: string;
  }[];
  isOwner: boolean;
  isAdmin: boolean;
  profileType: string;
  handleActionLoading: (isLoading: boolean) => void;
  setShowUpgradeDialog: (show: boolean) => void;
}

export function CredentialsSection({
  licenses: initialLicenses,
  isOwner,
  isAdmin,
  profileType,
  handleActionLoading,
  setShowUpgradeDialog
}: CredentialsSectionProps) {
  const [licenses, setLicenses] = useState(initialLicenses);
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
  if (!licenses || licenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>
            Licenses and Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <Award className='text-muted-foreground mb-4 h-12 w-12' />
            <p className='text-muted-foreground text-sm'>
              No licenses or certifications available.
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
          Licenses and Certifications
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-8'>
        {/* Licenses and Certifications */}
        {licenses && licenses.length > 0 && (
          <div>
            <div className='space-y-6'>
              {licenses.map((license, index) => (
                <div
                  key={index}
                  className='flex items-start justify-between gap-2'
                >
                  <div className='flex gap-4'>
                    <div className='bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg'>
                      <Award className='text-muted-foreground h-6 w-6' />
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-medium'>{license.credential_name}</h4>
                      <p className='text-muted-foreground text-sm'>
                        {license.credential_provider}
                      </p>

                      <p className='text-muted-foreground text-sm'>
                        {formatDateString(license.start_date)}
                        {license.start_date &&
                          (license.end_date || license.is_current) && (
                            <span className='mx-2'>-</span>
                          )}
                        {license.end_date
                          ? formatDateString(license.end_date)
                          : license.is_current
                            ? 'Present'
                            : ''}
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        {license.credential_number}
                      </p>
                    </div>
                  </div>
                  {(isOwner || isAdmin) && (
                    <div key={license.uuid} className='flex items-center gap-1'>
                      <Label
                        htmlFor={license.uuid}
                        className='flex items-center gap-2'
                      >
                        Private
                      </Label>
                      <Switch
                        id={license.uuid}
                        checked={license.display_setting === 'Public'}
                        onCheckedChange={async (checked) => {
                          const newDisplaySetting = checked
                            ? 'Public'
                            : 'Private';
                          try {
                            const updatedSetting = await updateDisplaySetting(
                              license.uuid!,
                              'expert_credential',
                              newDisplaySetting,
                              license.display_setting
                            );
                            setLicenses((prevLicenses) =>
                              prevLicenses.map((item) =>
                                item.uuid === license.uuid
                                  ? {
                                      ...item,
                                      display_setting: updatedSetting
                                    }
                                  : item
                              )
                            );
                          } catch (error) {
                            // Error is already handled in updateDisplaySetting
                          }
                        }}
                      />
                      <Label
                        htmlFor={license.uuid}
                        className='flex items-center gap-2'
                      >
                        Public
                      </Label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
