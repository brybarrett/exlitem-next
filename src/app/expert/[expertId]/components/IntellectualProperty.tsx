import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { formatDateString } from '@/composables/dates';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';
interface IntellectualPropertySectionProps {
  intellectual_property: {
    ip_type: string;
    ip_number: string;
    ip_title: string;
    ip_grant_date: string;
    ip_current_status: string;
    uuid?: string;
    display_setting: string;
  }[];
  isOwner: boolean;
  isAdmin: boolean;
  profileType: string;
  handleActionLoading: (isLoading: boolean) => void;
  setShowUpgradeDialog: (show: boolean) => void;
}

export function IntellectualPropertySection({
  intellectual_property: initialIntellectualProperty,
  isOwner,
  isAdmin,
  profileType,
  handleActionLoading,
  setShowUpgradeDialog
}: IntellectualPropertySectionProps) {
  const [intellectual_property, setIntellectualProperty] = useState(
    initialIntellectualProperty
  );
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
  if (!intellectual_property || intellectual_property.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>
            Intellectual Property
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <FileText className='text-muted-foreground mb-4 h-12 w-12' />
            <p className='text-muted-foreground text-sm'>
              No intellectual property available.
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
          Intellectual Property
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {intellectual_property.map((ip, index) => (
            <div key={index} className='flex items-start justify-between gap-2'>
              <div className='flex gap-4'>
                <div className='bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg'>
                  <FileText className='text-muted-foreground h-6 w-6' />
                </div>
                <div className='flex-1'>
                  <h3 className='font-medium'>{ip.ip_title}</h3>
                  <p className='text-muted-foreground text-sm'>
                    {ip.ip_number}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {formatDateString(ip.ip_grant_date)}
                  </p>
                  {ip.ip_current_status && ip.ip_current_status.length > 0 && (
                    <p className='text-muted-foreground text-sm capitalize'>
                      {ip.ip_current_status}
                    </p>
                  )}
                </div>
              </div>
              {(isOwner || isAdmin) && (
                <div key={ip.uuid} className='flex items-center gap-1'>
                  <Label htmlFor={ip.uuid} className='flex items-center gap-2'>
                    Private
                  </Label>
                  <Switch
                    id={ip.uuid}
                    checked={ip.display_setting === 'Public'}
                    onCheckedChange={async (checked) => {
                      const newDisplaySetting = checked ? 'Public' : 'Private';
                      try {
                        const updatedSetting = await updateDisplaySetting(
                          ip.uuid!,
                          'expert_intellectual_property',
                          newDisplaySetting,
                          ip.display_setting
                        );
                        setIntellectualProperty((prevIP) =>
                          prevIP.map((item) =>
                            item.uuid === ip.uuid
                              ? { ...item, display_setting: updatedSetting }
                              : item
                          )
                        );
                      } catch (error) {
                        // Error is already handled in updateDisplaySetting
                      }
                    }}
                  />
                  <Label htmlFor={ip.uuid} className='flex items-center gap-2'>
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
