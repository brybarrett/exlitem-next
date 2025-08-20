import {
  Address,
  AreaOfExpertise,
  EmailAddress,
  PhoneAddress
} from '@/types/report';
export const getPrimaryAddress = (data: Array<Address>) => {
  if (data?.length) {
    let primary_address = data?.find((address: Address) => address.is_primary);
    let address: string[] = [];
    if (primary_address) {
      if (primary_address.city) address.push(primary_address.city);
      if (primary_address?.state_detail?.label)
        address.push(primary_address.state_detail.label);
    } else {
      address.push(data[0]?.city || '');
      address.push(data[0]?.state_detail?.label || '');
    }
    return address.join(', ');
  }
  return '';
};

export const getPrimaryExpertise = (data: Array<AreaOfExpertise>) => {
  if (data?.length) {
    let primary_area_of_expertise = data?.find(
      (area_of_expertise: AreaOfExpertise) => area_of_expertise.is_primary
    );
    if (primary_area_of_expertise) {
      return primary_area_of_expertise.area_of_expertise;
    } else {
      return data[0]?.area_of_expertise;
    }
  }
  return '';
};

export const getPrimaryEmail = (data: Array<EmailAddress>) => {
  if (data?.length) {
    let primary_email = data?.find((email: EmailAddress) => email.is_primary);
    if (primary_email) {
      return primary_email.expert_email;
    }
  }
  return '';
};

export const getPrimaryPhone = (data: Array<PhoneAddress>) => {
  if (data?.length) {
    let primary_phone = data?.find((phone: PhoneAddress) => phone.is_primary);
    if (primary_phone) {
      return primary_phone.phone;
    }
  }
  return '';
};
