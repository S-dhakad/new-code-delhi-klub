export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string; //JWT token
};

export enum SocialMediaPlatform {
  WEBSITE = 'WEBSITE',
  YOUTUBE = 'YOUTUBE',
  INSTAGRAM = 'INSTAGRAM',
  LINKEDIN = 'LINKEDIN',
  FACEBOOK = 'FACEBOOK',
  CUSTOM_URL1 = 'CUSTOM_URL1',
  CUSTOM_URL2 = 'CUSTOM_URL2',
}

export type SocialMediaLink = {
  platform: SocialMediaPlatform;
  url: string;
  label?: string;
};

export type ProfileUpdateRequest = {
  firstName: string;
  lastName: string;
  username: string;
  profilePictureUrl?: import('src/types/uploads.types').FileUploadPayload;
  bio?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  socialMediaLinks?: SocialMediaLink[];
};
