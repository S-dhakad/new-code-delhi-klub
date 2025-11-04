interface Social {
  platform: string;
  url: string;
  label?: string;
}

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  userSocialMedia?: Social[];
  createdAt?: string;
  followers?: number;
}
