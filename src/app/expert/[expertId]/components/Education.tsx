import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { formatDateString } from '@/composables/dates';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';

interface EducationSectionProps {
  education: {
    degree_course_name: string;
    university_institution_name: string;
    start_date: string;
    end_date: string;
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

export function EducationSection({
  education: initialEducation,
  isOwner,
  isAdmin,
  profileType,
  handleActionLoading,
  setShowUpgradeDialog
}: EducationSectionProps) {
  const [education, setEducation] = useState(initialEducation);
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
  if (!education || education.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>Education</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <GraduationCap className='text-muted-foreground mb-4 h-12 w-12' />
            <p className='text-muted-foreground text-sm'>
              No education information available.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>Education</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {education && education.length > 0 && (
            <div>
              <div className='space-y-6'>
                {education.map((edu, index) => (
                  <div
                    key={index}
                    className='flex items-start justify-between gap-2'
                  >
                    <div className='flex gap-4'>
                      <div className='bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg'>
                        <GraduationCap className='text-muted-foreground h-6 w-6' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-medium'>
                          {edu.degree_course_name}
                        </h4>
                        <p className='text-muted-foreground text-sm'>
                          {edu.university_institution_name}
                        </p>
                        <p className='text-muted-foreground text-sm'>
                          {formatDateString(edu.start_date)}
                          {edu.start_date &&
                            (edu.end_date || edu.is_current) && (
                              <span className='mx-2'>-</span>
                            )}
                          {edu.end_date
                            ? formatDateString(edu.end_date)
                            : edu.is_current
                              ? 'Present'
                              : ''}
                        </p>
                      </div>
                    </div>
                    {(isOwner || isAdmin) && (
                      <div key={edu.uuid} className='flex items-center gap-1'>
                        <Label
                          htmlFor={edu.uuid}
                          className='flex items-center gap-2'
                        >
                          Private
                        </Label>
                        <Switch
                          id={edu.uuid}
                          checked={edu.display_setting === 'Public'}
                          onCheckedChange={async (checked) => {
                            const newDisplaySetting = checked
                              ? 'Public'
                              : 'Private';
                            try {
                              const updatedSetting = await updateDisplaySetting(
                                edu.uuid!,
                                'expert_education',
                                newDisplaySetting,
                                edu.display_setting
                              );
                              setEducation((prevEducation) =>
                                prevEducation.map((item) =>
                                  item.uuid === edu.uuid
                                    ? {
                                        ...item,
                                        display_setting:
                                          updatedSetting || item.display_setting
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
                          htmlFor={edu.uuid}
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
        </div>
      </CardContent>
    </Card>
  );
}
