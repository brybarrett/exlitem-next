'use client';

import { useEffect, useState, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import {
  WorkExperienceSection,
  CredentialsSection,
  EducationSection,
  PublicationSection,
  SocialMediaSection,
  ProfileHeader,
  RightContainer,
  AboutSection,
  Unclaimed,
  Claimed,
  Premium,
  Verified,
  MembershipSection,
  AwardsHonorsSection,
  PresentationSection,
  IntellectualPropertySection,
  ReferenceSection,
  ContactSection
} from './components';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Crown, ShieldCheck, ArrowRight } from 'lucide-react';

export default function TestPage() {
  const params = useParams();
  const expertId = params.expertId;
  const [expertData, setExpertData]: any = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const [visibilitySettings, setVisibilitySettings] = useState([
    // {
    //   key : 'show_gatekeeper_teaser',
    //   label : 'Show Gatekeeper Teaser',
    //   value : true
    // },
    {
      key: 'about_me',
      label: 'Contact Information',
      value: true
    },
    {
      key: 'Work Experience',
      label: 'Professional History',
      value: true
    },
    {
      key: 'education',
      label: 'Education',
      value: true
    },
    {
      key: 'licenses_and_certification',
      label: 'Licenses and Certification',
      value: true
    },
    {
      key: 'publication',
      label: 'Publication',
      value: true
    },
    {
      key: 'association_membership',
      label: 'Memberships',
      value: true
    },
    {
      key: 'award_honor',
      label: 'Awards and Honors',
      value: true
    },
    {
      key: 'networking_activity',
      label: 'Presentations And Conferences',
      value: true
    },
    {
      key: 'intellectual_property',
      label: 'Intellectual Property',
      value: true
    },
    {
      key: 'references',
      label: 'References',
      value: true
    },
    {
      key: 'me_on_the_web',
      label: 'Social Media',
      value: true
    }
  ]);

  const checkVisibility = (key: string) => {
    return visibilitySettings.find((item: any) => item.key === key)?.value;
  };

  const toggleVisibility = async (
    key: keyof typeof visibilitySettings,
    value: boolean
  ) => {
    let obj = {
      expert: expertId,
      [key]: value ? 'Private' : 'Public'
    };
    try {
      setIsActionLoading(true);
      const response = await apiClient.put(
        '/experts/expert_profile_setting/update_profile_setting/',
        obj
      );
      setVisibilitySettings((prevSettings: any) => {
        const updatedSettings = prevSettings.map((setting: any) => {
          if (setting.key === key) {
            return { ...setting, value: !setting.value };
          }
          return setting;
        });
        return updatedSettings;
      });
      toast.success('Visibility updated successfully');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail || 'Failed to update visibility'
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const isContactVisible = useMemo(() => {
    return (
      checkVisibility('about_me') &&
      ((expertData?.expert_address && expertData?.expert_address.length > 0) ||
        (expertData?.expert_phone && expertData?.expert_phone.length > 0) ||
        (expertData?.expert_email && expertData?.expert_email.length > 0))
    );
  }, [visibilitySettings, expertData]);

  const handleActionLoading = (isLoading: boolean) => {
    setIsActionLoading(isLoading);
  };

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(
          `/experts/expert_profile/expert_detail/?expert_id=${expertId}`
        );
        if (response.data.results.length > 0) {
          setExpertData(response.data.results[0]);
          let visibility =
            response.data.results[0].expert_section_visibility || {};
          setVisibilitySettings([
            {
              key: 'show_gatekeeper_teaser',
              label: 'Show Gatekeeper Teaser',
              value:
                visibility?.show_gatekeeper_teaser === 'Private' ? false : true
            },
            {
              key: 'about_me',
              label: 'Contact Information',
              value: visibility?.about_me === 'Private' ? false : true
            },
            {
              key: 'professional_history',
              label: 'Professional History',
              value:
                visibility?.professional_history === 'Private' ? false : true
            },
            {
              key: 'licenses_and_certification',
              label: 'Licenses and Certification',
              value:
                visibility?.licenses_and_certification === 'Private'
                  ? false
                  : true
            },
            {
              key: 'education',
              label: 'Education',
              value: visibility?.education === 'Private' ? false : true
            },
            {
              key: 'publication',
              label: 'Publication',
              value: visibility?.publication === 'Private' ? false : true
            },
            {
              key: 'association_membership',
              label: 'Memberships',
              value:
                visibility?.association_membership === 'Private' ? false : true
            },
            {
              key: 'award_honor',
              label: 'Awards and Honors',
              value: visibility?.award_honor === 'Private' ? false : true
            },
            {
              key: 'networking_activity',
              label: 'Presentations And Conferences',
              value:
                visibility?.networking_activity === 'Private' ? false : true
            },
            {
              key: 'intellectual_property',
              label: 'Intellectual Property',
              value:
                visibility?.intellectual_property === 'Private' ? false : true
            },
            {
              key: 'references',
              label: 'References',
              value: visibility?.references === 'Private' ? false : true
            },
            {
              key: 'me_on_the_web',
              label: 'Social Media',
              value: visibility?.me_on_the_web === 'Private' ? false : true
            }
          ]);
        }
      } catch (e: any) {
        toast.error(e?.response?.data?.detail || 'Failed to fetch the expert.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpert();
  }, [expertId]);

  return (
    <main className='container mx-auto flex-1 px-8'>
      {isLoading ? (
        <div className='mt-5'>
          <div className='bg-card flex items-start space-x-6 rounded-lg p-6'>
            <Skeleton className='h-32 w-32 rounded-full' />
            <div className='flex-1'>
              <div className='space-y-3'>
                <div className='flex items-center space-x-2'>
                  <Skeleton className='h-8 w-[300px]' /> {/* Name with (Dr.) */}
                </div>
                <Skeleton className='h-5 w-[200px]' /> {/* Field */}
                <Skeleton className='h-5 w-[250px]' /> {/* Location */}
                <div className='flex space-x-2'>
                  <Skeleton className='h-6 w-[100px] rounded-full' />{' '}
                  {/* Tag */}
                  <Skeleton className='h-6 w-[100px] rounded-full' />{' '}
                  {/* Tag */}
                </div>
              </div>
            </div>
            <div className='flex flex-col space-y-2'>
              <Skeleton className='h-10 w-[150px]' /> {/* Message Expert */}
              <Skeleton className='h-10 w-[150px]' /> {/* Order Gatekeeper */}
              <Skeleton className='h-10 w-[40px]' /> {/* More menu */}
            </div>
          </div>

          {/* Warning Banner */}
          <div className='mt-4'>
            <Skeleton className='h-16 w-full rounded-lg bg-amber-100/20' />
          </div>

          <div className='relative mt-6 grid grid-cols-1 gap-6 sm:mt-8 lg:grid-cols-3'>
            <div className='space-y-6 lg:col-span-2'>
              {/* About Section */}
              <div className='bg-card space-y-4 rounded-lg p-6'>
                <Skeleton className='h-8 w-[100px]' /> {/* Section title */}
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-[90%]' />
                <Skeleton className='h-4 w-[95%]' />
              </div>

              {/* Other sections */}
              <div className='bg-card space-y-4 rounded-lg p-6'>
                <Skeleton className='h-8 w-[150px]' />
                <Skeleton className='h-[200px] w-full' />
              </div>
              <div className='bg-card space-y-4 rounded-lg p-6'>
                <Skeleton className='h-8 w-[150px]' />
                <Skeleton className='h-[200px] w-full' />
              </div>
            </div>
            <div className='sticky top-3 h-fit lg:col-span-1'>
              {/* Gatekeeper Report Preview Card */}
              <div className='bg-card space-y-4 rounded-lg p-6'>
                <div className='flex items-center space-x-2'>
                  <Skeleton className='h-6 w-6' /> {/* Icon */}
                  <Skeleton className='h-6 w-[200px]' /> {/* Title */}
                </div>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-[90%]' />
                <div className='grid grid-cols-3 gap-4'>
                  <Skeleton className='h-20 w-full' />
                  <Skeleton className='h-20 w-full' />
                  <Skeleton className='h-20 w-full' />
                </div>
                <Skeleton className='h-10 w-full' /> {/* Button */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='mt-5'>
          <ProfileHeader expert={expertData} />
          <div className='relative mt-6 grid grid-cols-1 gap-6 sm:mt-8 lg:grid-cols-3'>
            <div className='space-y-6 pb-5 lg:col-span-2'>
              {(expertData.is_owner || expertData.is_admin_or_researcher) && (
                <>
                  {expertData.profile_type == 'Unclaimed' && <Unclaimed />}
                  {expertData.profile_type == 'Claimed' && (
                    <Claimed
                      isOwner={expertData.is_owner || false}
                      isAdmin={expertData.is_admin_or_researcher || false}
                    />
                  )}
                  {expertData.profile_type == 'Premium' && (
                    <Premium
                      visibilitySettings={visibilitySettings}
                      toggleVisibility={toggleVisibility}
                      isOwner={expertData.is_owner || false}
                      isAdmin={expertData.is_admin_or_researcher || false}
                      isActionLoading={isActionLoading}
                    />
                  )}
                  {expertData.profile_type == 'Verified' && (
                    <Verified
                      visibilitySettings={visibilitySettings}
                      toggleVisibility={toggleVisibility}
                      isOwner={expertData.is_owner || false}
                      isAdmin={expertData.is_admin_or_researcher || false}
                      isActionLoading={isActionLoading}
                    />
                  )}
                </>
              )}

              <AboutSection
                bio={expertData.profile_introduction}
                expert={expertData}
              />
              {/* Contact Section */}
              {isContactVisible && (
                <ContactSection
                  expert_address={expertData?.expert_address || []}
                  expert_phone={expertData?.expert_phone || []}
                  expert_email={expertData?.expert_email || []}
                  isOwner={expertData.is_owner || false}
                  isAdmin={expertData.is_admin_or_researcher || false}
                  profileType={expertData.profile_type}
                  handleActionLoading={handleActionLoading}
                  setShowUpgradeDialog={setShowUpgradeDialog}
                />
              )}
              {checkVisibility('professional_history') &&
                expertData?.expert_work_experience &&
                expertData.expert_work_experience.length > 0 && (
                  <WorkExperienceSection
                    workExperience={expertData?.expert_work_experience || []}
                    isOwner={expertData.is_owner || false}
                    isAdmin={expertData.is_admin_or_researcher || false}
                    profileType={expertData.profile_type}
                    handleActionLoading={handleActionLoading}
                    setShowUpgradeDialog={setShowUpgradeDialog}
                  />
                )}
              {checkVisibility('education') &&
                expertData?.expert_education &&
                expertData.expert_education.length > 0 && (
                  <EducationSection
                    education={expertData?.expert_education || []}
                    isOwner={expertData.is_owner || false}
                    isAdmin={expertData.is_admin_or_researcher || false}
                    profileType={expertData.profile_type}
                    handleActionLoading={handleActionLoading}
                    setShowUpgradeDialog={setShowUpgradeDialog}
                  />
                )}
              {checkVisibility('licenses_and_certification') &&
                expertData?.expert_credential &&
                expertData.expert_credential.length > 0 && (
                  <CredentialsSection
                    licenses={expertData?.expert_credential || []}
                    isOwner={expertData.is_owner || false}
                    isAdmin={expertData.is_admin_or_researcher || false}
                    profileType={expertData.profile_type}
                    handleActionLoading={handleActionLoading}
                    setShowUpgradeDialog={setShowUpgradeDialog}
                  />
                )}
              {checkVisibility('publication') &&
                expertData?.expert_publication &&
                expertData.expert_publication.length > 0 && (
                  <PublicationSection
                    publication={expertData?.expert_publication || []}
                    isOwner={expertData.is_owner || false}
                    isAdmin={expertData.is_admin_or_researcher || false}
                    profileType={expertData.profile_type}
                    handleActionLoading={handleActionLoading}
                    setShowUpgradeDialog={setShowUpgradeDialog}
                  />
                )}
              {checkVisibility('association_membership') &&
                expertData?.expert_membership &&
                expertData.expert_membership.length > 0 && (
                  <MembershipSection
                    membership={expertData?.expert_membership || []}
                    isOwner={expertData.is_owner || false}
                    isAdmin={expertData.is_admin_or_researcher || false}
                    profileType={expertData.profile_type}
                    handleActionLoading={handleActionLoading}
                    setShowUpgradeDialog={setShowUpgradeDialog}
                  />
                )}
              {checkVisibility('award_honor') &&
                expertData?.expert_award_honor &&
                expertData.expert_award_honor.length > 0 && (
                  <AwardsHonorsSection
                    awards_honors={expertData?.expert_award_honor || []}
                    isOwner={expertData.is_owner || false}
                    isAdmin={expertData.is_admin_or_researcher || false}
                    profileType={expertData.profile_type}
                    handleActionLoading={handleActionLoading}
                    setShowUpgradeDialog={setShowUpgradeDialog}
                  />
                )}
              {checkVisibility('networking_activity') &&
                expertData?.expert_networking_activity &&
                expertData.expert_networking_activity.length > 0 && (
                  <PresentationSection
                    presentation={expertData?.expert_networking_activity || []}
                    isOwner={expertData.is_owner || false}
                    isAdmin={expertData.is_admin_or_researcher || false}
                    profileType={expertData.profile_type}
                    handleActionLoading={handleActionLoading}
                    setShowUpgradeDialog={setShowUpgradeDialog}
                  />
                )}
              {checkVisibility('intellectual_property') &&
                expertData?.expert_intellectual_property &&
                expertData.expert_intellectual_property.length > 0 && (
                  <IntellectualPropertySection
                    intellectual_property={
                      expertData?.expert_intellectual_property || []
                    }
                    isOwner={expertData.is_owner || false}
                    isAdmin={expertData.is_admin_or_researcher || false}
                    profileType={expertData.profile_type}
                    handleActionLoading={handleActionLoading}
                    setShowUpgradeDialog={setShowUpgradeDialog}
                  />
                )}
              {checkVisibility('references') &&
                expertData?.expert_reference &&
                expertData.expert_reference.length > 0 && (
                  <ReferenceSection
                    reference={expertData?.expert_reference || []}
                    isOwner={expertData.is_owner || false}
                    isAdmin={expertData.is_admin_or_researcher || false}
                    profileType={expertData.profile_type}
                    handleActionLoading={handleActionLoading}
                    setShowUpgradeDialog={setShowUpgradeDialog}
                  />
                )}
              {checkVisibility('me_on_the_web') &&
                expertData?.expert_online_presence &&
                expertData.expert_online_presence.length > 0 && (
                  <SocialMediaSection
                    social_media={expertData?.expert_online_presence || []}
                    isOwner={expertData.is_owner || false}
                    isAdmin={expertData.is_admin_or_researcher || false}
                    profileType={expertData.profile_type}
                    handleActionLoading={handleActionLoading}
                    setShowUpgradeDialog={setShowUpgradeDialog}
                  />
                )}
            </div>
            <div className='sticky top-16 h-fit lg:col-span-1'>
              <RightContainer
                expert={expertData}
                visibilitySettings={visibilitySettings}
              />
            </div>
          </div>
        </div>
      )}
      {isActionLoading && (
        <div className='bg-background/40 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm'>
          <div className='flex items-center space-x-2'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
            <p className='text-lg font-medium'>Loading...</p>
          </div>
        </div>
      )}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className='bg-background/95 border-2 shadow-lg backdrop-blur-sm sm:max-w-[425px]'>
          <div className='absolute inset-0 -z-10 rounded-lg bg-black/20' />
          <DialogHeader>
            <DialogTitle>Upgrade Your Plan</DialogTitle>
            <DialogDescription>
              Unlock more features by upgrading your plan to Premium or Verified
              status.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='hover:bg-accent flex cursor-pointer items-center gap-4 rounded-lg border p-4'>
              <div className='bg-primary/20 rounded-full p-2'>
                <Crown className='text-primary h-6 w-6' />
              </div>
              <div className='flex-1'>
                <h4 className='font-medium'>Premium Plan</h4>
                <p className='text-muted-foreground text-sm'>
                  Get advanced features and priority support
                </p>
              </div>
              <ArrowRight className='text-muted-foreground h-5 w-5' />
            </div>

            <div className='hover:bg-accent flex cursor-pointer items-center gap-4 rounded-lg border p-4'>
              <div className='bg-primary/20 rounded-full p-2'>
                <ShieldCheck className='text-primary h-6 w-6' />
              </div>
              <div className='flex-1'>
                <h4 className='font-medium'>Verified Plan</h4>
                <p className='text-muted-foreground text-sm'>
                  Get verified status and enhanced visibility
                </p>
              </div>
              <ArrowRight className='text-muted-foreground h-5 w-5' />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => setShowUpgradeDialog(false)}
            >
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
