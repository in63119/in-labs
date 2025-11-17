export type PinResponse = {
  pinCode: string;
};

export type PinVerifyResponse = {
  verified: boolean;
};

export type PostPinResponse = {
  pin: number;
};

export type EmailContent = {
  recipient: string;
  subject: string;
  body: string;
};
