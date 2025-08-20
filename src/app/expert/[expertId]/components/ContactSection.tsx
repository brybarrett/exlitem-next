import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Home,
  Building,
  Briefcase
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';

const getAddressIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'home':
      return Home;
    case 'work':
      return Building;
    case 'business':
      return Briefcase;
    default:
      return MapPin;
  }
};

interface ContactSectionProps {
  expert_address: Array<{
    uuid: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string | null;
    state_detail: { label: string } | null;
    zip_code: string | null;
    country_detail: { label: string };
    address_type: string;
    display_setting: string;
    is_primary: boolean;
  }>;
  expert_phone: Array<{
    uuid: string;
    country_code: string;
    phone: string;
    phone_type: string;
    display_setting: string;
    is_primary: boolean;
  }>;
  expert_email: Array<{
    uuid: string;
    expert_email: string;
    is_primary: boolean;
    display_setting: string;
  }>;
  isOwner: boolean;
  profileType: string;
  isAdmin: boolean;
  handleActionLoading: (isLoading: boolean) => void;
  setShowUpgradeDialog: (show: boolean) => void;
}

export function ContactSection({
  expert_address: initialAddress,
  expert_phone: initialPhone,
  expert_email: initialEmail,
  isOwner,
  profileType,
  isAdmin,
  handleActionLoading,
  setShowUpgradeDialog
}: ContactSectionProps) {
  const [addresses, setAddresses] = useState(initialAddress);
  const [phones, setPhones] = useState(initialPhone);
  const [emails, setEmails] = useState(initialEmail);

  const updateDisplaySetting = async (
    uuid: string,
    model: string,
    display_setting: string
  ) => {
    if ((profileType == 'Claimed' || profileType == 'Unclaimed') && !isAdmin) {
      setShowUpgradeDialog(true);
      return display_setting;
    }
    handleActionLoading(true);
    try {
      const response = await apiClient.patch(`/experts/${model}/${uuid}/`, {
        display_setting: display_setting
      });
      if (response?.data?.display_setting) {
        return response.data.display_setting;
      }
      toast.success(
        response?.data?.detail ||
          `${model} display setting updated successfully`
      );
      return response.data.display_setting || display_setting;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ||
          `Failed to update ${model} display setting`
      );
      throw error;
    } finally {
      handleActionLoading(false);
    }
  };

  if (
    (!addresses || addresses.length === 0) &&
    (!phones || phones.length === 0) &&
    (!emails || emails.length === 0)
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <Building2 className='text-muted-foreground mb-4 h-12 w-12' />
            <p className='text-muted-foreground text-sm'>
              No contact information available.
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
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {/* Addresses Section */}
          {addresses && addresses.length > 0 && (
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Addresses</h3>
              {addresses.map((address) => (
                <div
                  key={address.uuid}
                  className='flex items-start justify-between gap-2'
                >
                  <div className='flex gap-4'>
                    <div className='bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg'>
                      {(() => {
                        const Icon = getAddressIcon(address.address_type);
                        return (
                          <Icon className='text-muted-foreground h-6 w-6' />
                        );
                      })()}
                    </div>
                    <div className='flex-1'>
                      <h4 className='flex items-center font-medium'>
                        {address.address_type}
                        {address.is_primary && (
                          <Badge
                            variant='outline'
                            className='ml-2 bg-green-500/20 text-xs'
                          >
                            Primary
                          </Badge>
                        )}
                      </h4>
                      <p className='text-muted-foreground text-sm'>
                        {address.address_line_1}
                        {address.address_line_2 && (
                          <>, {address.address_line_2}</>
                        )}
                        {address.city && <>, {address.city}</>}
                        {address.state_detail?.label && (
                          <>, {address.state_detail.label}</>
                        )}
                        {address.zip_code && <>, {address.zip_code}</>}
                        {address.country_detail?.label && (
                          <>, {address.country_detail.label}</>
                        )}
                      </p>
                    </div>
                  </div>
                  {(isOwner || isAdmin) && (
                    <div className='flex items-center gap-1'>
                      <Label
                        htmlFor={`addr-${address.uuid}`}
                        className='flex items-center gap-2'
                      >
                        Private
                      </Label>
                      <Switch
                        id={`addr-${address.uuid}`}
                        checked={address.display_setting === 'Public'}
                        onCheckedChange={async (checked) => {
                          const newDisplaySetting = checked
                            ? 'Public'
                            : 'Private';
                          try {
                            const updatedSetting = await updateDisplaySetting(
                              address.uuid,
                              'expert_address',
                              newDisplaySetting
                            );
                            setAddresses((prevAddresses) =>
                              prevAddresses.map((item) =>
                                item.uuid === address.uuid
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
                        htmlFor={`addr-${address.uuid}`}
                        className='flex items-center gap-2'
                      >
                        Public
                      </Label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Phone Numbers Section */}
          {phones && phones.length > 0 && (
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Phone Numbers</h3>
              {phones.map((phone) => (
                <div
                  key={phone.uuid}
                  className='flex items-start justify-between gap-2'
                >
                  <div className='flex gap-4'>
                    <div className='bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg'>
                      <Phone className='text-muted-foreground h-6 w-6' />
                    </div>
                    <div className='flex-1'>
                      <h4 className='flex items-center font-medium'>
                        {phone.phone_type}
                        {phone.is_primary && (
                          <Badge
                            variant='outline'
                            className='ml-2 bg-green-500/20 text-xs'
                          >
                            Primary
                          </Badge>
                        )}
                      </h4>
                      <p className='text-sm'>
                        <a
                          href={`tel:+${phone.country_code}${phone.phone}`}
                          className='text-primary hover:underline'
                        >
                          +{phone.country_code} {phone.phone}
                        </a>
                      </p>
                    </div>
                  </div>
                  {(isOwner || isAdmin) && (
                    <div className='flex items-center gap-1'>
                      <Label
                        htmlFor={`phone-${phone.uuid}`}
                        className='flex items-center gap-2'
                      >
                        Private
                      </Label>
                      <Switch
                        id={`phone-${phone.uuid}`}
                        checked={phone.display_setting === 'Public'}
                        onCheckedChange={async (checked) => {
                          const newDisplaySetting = checked
                            ? 'Public'
                            : 'Private';
                          try {
                            const updatedSetting = await updateDisplaySetting(
                              phone.uuid,
                              'expert_phone',
                              newDisplaySetting
                            );
                            setPhones((prevPhones) =>
                              prevPhones.map((item) =>
                                item.uuid === phone.uuid
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
                        htmlFor={`phone-${phone.uuid}`}
                        className='flex items-center gap-2'
                      >
                        Public
                      </Label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Email Addresses Section */}
          {emails && emails.length > 0 && (
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Email Addresses</h3>
              {emails.map((email) => (
                <div
                  key={email.uuid}
                  className='flex items-start justify-between gap-2'
                >
                  <div className='flex gap-4'>
                    <div className='bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg'>
                      <Mail className='text-muted-foreground h-6 w-6' />
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-medium'>
                        <a
                          href={`mailto:${email.expert_email}`}
                          className='text-primary hover:underline'
                        >
                          {email.expert_email}
                        </a>
                        {email.is_primary && (
                          <Badge
                            variant='outline'
                            className='ml-2 bg-green-500/20 text-xs'
                          >
                            Primary
                          </Badge>
                        )}
                      </h4>
                    </div>
                  </div>
                  {(isOwner || isAdmin) && (
                    <div className='flex items-center gap-1'>
                      <Label
                        htmlFor={`email-${email.uuid}`}
                        className='flex items-center gap-2'
                      >
                        Private
                      </Label>
                      <Switch
                        id={`email-${email.uuid}`}
                        checked={email.display_setting === 'Public'}
                        onCheckedChange={async (checked) => {
                          const newDisplaySetting = checked
                            ? 'Public'
                            : 'Private';
                          try {
                            const updatedSetting = await updateDisplaySetting(
                              email.uuid,
                              'expert_email',
                              newDisplaySetting
                            );
                            setEmails((prevEmails) =>
                              prevEmails.map((item) =>
                                item.uuid === email.uuid
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
                        htmlFor={`email-${email.uuid}`}
                        className='flex items-center gap-2'
                      >
                        Public
                      </Label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
