import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { formatDateString } from '@/composables/dates';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';
interface PublicationSectionProps {
  publication: {
    publication_title: string;
    publication_publisher: string;
    publication_date: string;
    publication_web_url: string;
    publication_description: string;
    publication_author: string[];
    publication_s3_url: string;
    uuid?: string;
    display_setting: string;
  }[];
  isOwner: boolean;
  isAdmin: boolean;
  profileType: string;
  handleActionLoading: (isLoading: boolean) => void;
  setShowUpgradeDialog: (show: boolean) => void;
}

export function PublicationSection({
  publication: initialPublication,
  isOwner,
  isAdmin,
  profileType,
  handleActionLoading,
  setShowUpgradeDialog
}: PublicationSectionProps) {
  const [publication, setPublication] = useState(initialPublication);
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
  if (!publication || publication.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>Publications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <Building2 className='text-muted-foreground mb-4 h-12 w-12' />
            <p className='text-muted-foreground text-sm'>
              No publications available.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>Publications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {publication.map((pub, index) => (
            <div key={index} className='flex items-start justify-between gap-2'>
              <div className='flex gap-4'>
                <div className='bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg'>
                  <Building2 className='text-muted-foreground h-6 w-6' />
                </div>
                <div className='flex-1'>
                  <h3 className='font-medium'>
                    <a
                      className='text-primary'
                      href={pub.publication_web_url || pub.publication_s3_url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {pub.publication_title}
                    </a>
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    {pub.publication_publisher}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {formatDateString(pub.publication_date)}
                  </p>
                  {pub.publication_author &&
                    pub.publication_author.length > 0 && (
                      <p className='text-muted-foreground text-sm capitalize'>
                        Other authors: {pub.publication_author.join(', ')}
                      </p>
                    )}
                </div>
              </div>
              {(isOwner || isAdmin) && (
                <div key={pub.uuid} className='flex items-center gap-1'>
                  <Label htmlFor={pub.uuid} className='flex items-center gap-2'>
                    Private
                  </Label>
                  <Switch
                    id={pub.uuid}
                    checked={pub.display_setting === 'Public'}
                    onCheckedChange={async (checked) => {
                      const newDisplaySetting = checked ? 'Public' : 'Private';
                      try {
                        const updatedSetting = await updateDisplaySetting(
                          pub.uuid!,
                          'expert_publication',
                          newDisplaySetting,
                          pub.display_setting
                        );
                        setPublication((prevPublication) =>
                          prevPublication.map((item) =>
                            item.uuid === pub.uuid
                              ? { ...item, display_setting: updatedSetting }
                              : item
                          )
                        );
                      } catch (error) {
                        // Error is already handled in updateDisplaySetting
                      }
                    }}
                  />
                  <Label htmlFor={pub.uuid} className='flex items-center gap-2'>
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
