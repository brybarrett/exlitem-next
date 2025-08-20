import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { formatDateString } from '@/composables/dates';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';

interface WorkExperienceSectionProps {
  workExperience: {
    position_held: string;
    name_of_organization: string;
    start_date: string;
    end_date: string;
    experience_description: string;
    is_current: boolean;
    uuid?: string;
    display_setting: string;
  }[];
  isOwner: boolean;
  isAdmin: boolean;
  profileType: string;
  handleActionLoading: (isLoading: boolean) => void;
  setShowUpgradeDialog: (show: boolean) => void;
}

export function WorkExperienceSection({
  workExperience: initialWorkExperience,
  isOwner,
  isAdmin,
  profileType,
  handleActionLoading,
  setShowUpgradeDialog
}: WorkExperienceSectionProps) {
  const [workExperience, setWorkExperience] = useState(initialWorkExperience);

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
      // If no display_setting in response, return original to revert the switch
      return originalSetting;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ||
          `Failed to update ${model} display setting`
      );
      // Return original setting to revert the switch state
      return originalSetting;
    } finally {
      handleActionLoading(false);
    }
  };
  if (!workExperience || workExperience.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>
            Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <Building2 className='text-muted-foreground mb-4 h-12 w-12' />
            <p className='text-muted-foreground text-sm'>
              No work experience information available.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>Work Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {workExperience.map((exp, index) => (
            <div key={index} className='flex items-start justify-between gap-2'>
              <div className='flex gap-4 overflow-auto'>
                <div className='bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg'>
                  <Building2 className='text-muted-foreground h-6 w-6' />
                </div>
                <div className='flex-1'>
                  <h3 className='font-medium'>{exp.position_held}</h3>
                  <p className='text-muted-foreground text-sm'>
                    {exp.name_of_organization}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {formatDateString(exp.start_date)}
                    {exp.start_date && (exp.end_date || exp.is_current) && (
                      <span className='mx-2'>-</span>
                    )}
                    {exp.end_date
                      ? formatDateString(exp.end_date)
                      : exp.is_current
                        ? 'Present'
                        : ''}
                  </p>
                  {exp.experience_description && (
                    <p className='text-muted-foreground mt-2 line-clamp-2 text-sm'>
                      {exp.experience_description}
                    </p>
                  )}
                </div>
              </div>
              {(isOwner || isAdmin) && (
                <div key={exp.uuid} className='flex items-center gap-1'>
                  <Label htmlFor={exp.uuid} className='flex items-center gap-2'>
                    Private
                  </Label>
                  <Switch
                    id={exp.uuid}
                    checked={exp.display_setting === 'Public'}
                    onCheckedChange={async (checked) => {
                      const newDisplaySetting = checked ? 'Public' : 'Private';
                      try {
                        const updatedSetting = await updateDisplaySetting(
                          exp.uuid!,
                          'expert_work_experience',
                          newDisplaySetting,
                          exp.display_setting
                        );
                        setWorkExperience((prevExperience) =>
                          prevExperience.map((item) =>
                            item.uuid === exp.uuid
                              ? { ...item, display_setting: updatedSetting }
                              : item
                          )
                        );
                      } catch (error) {
                        // Error is already handled in updateDisplaySetting
                      }
                    }}
                  />
                  <Label htmlFor={exp.uuid} className='flex items-center gap-2'>
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
