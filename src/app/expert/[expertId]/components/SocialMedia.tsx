import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';
import {
  Building2,
  User,
  Building,
  Globe,
  Users,
  Network,
  FileQuestion
} from 'lucide-react';
import { formatDateString } from '@/composables/dates';
const getWebsiteIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'personal':
      return User;
    case 'company':
      return Building;
    case 'public profile':
      return Globe;
    case 'expert directory':
      return Users;
    case 'social network':
      return Network;
    default:
      return FileQuestion;
  }
};

interface SocialMediaSectionProps {
  social_media: {
    website_name: string;
    website_url: string;
    website_type: string;
    uuid?: string;
    display_setting: string;
  }[];
  isOwner: boolean;
  isAdmin: boolean;
  profileType: string;
  handleActionLoading: (isLoading: boolean) => void;
  setShowUpgradeDialog: (show: boolean) => void;
}

export function SocialMediaSection({
  social_media: initialSocialMedia,
  isOwner,
  isAdmin,
  profileType,
  handleActionLoading,
  setShowUpgradeDialog
}: SocialMediaSectionProps) {
  const [social_media, setSocialMedia] = useState(initialSocialMedia);
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
  if (!social_media || social_media.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>Social Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <Building2 className='text-muted-foreground mb-4 h-12 w-12' />
            <p className='text-muted-foreground text-sm'>
              No social media available.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>Social Media</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {social_media.map((sm, index) => (
            <div key={index} className='flex items-start justify-between gap-2'>
              <div className='flex gap-4'>
                <div className='bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg'>
                  {(() => {
                    const Icon = getWebsiteIcon(sm.website_type);
                    return <Icon className='text-muted-foreground h-6 w-6' />;
                  })()}
                </div>
                <div className='flex-1'>
                  <h3 className='font-medium'>
                    <a
                      className='text-primary'
                      href={sm.website_url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {sm.website_name}
                    </a>
                  </h3>
                </div>
              </div>
              {(isOwner || isAdmin) && (
                <div key={sm.uuid} className='flex items-center gap-1'>
                  <Label htmlFor={sm.uuid} className='flex items-center gap-2'>
                    Private
                  </Label>
                  <Switch
                    id={sm.uuid}
                    checked={sm.display_setting === 'Public'}
                    onCheckedChange={async (checked) => {
                      const newDisplaySetting = checked ? 'Public' : 'Private';
                      try {
                        const updatedSetting = await updateDisplaySetting(
                          sm.uuid!,
                          'expert_online_presence',
                          newDisplaySetting,
                          sm.display_setting
                        );
                        setSocialMedia((prevSocialMedia) =>
                          prevSocialMedia.map((item) =>
                            item.uuid === sm.uuid
                              ? { ...item, display_setting: updatedSetting }
                              : item
                          )
                        );
                      } catch (error) {
                        // Error is already handled in updateDisplaySetting
                      }
                    }}
                  />
                  <Label htmlFor={sm.uuid} className='flex items-center gap-2'>
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
