export abstract class IMailService {
  abstract sendVerifyEmail(email: string);
  abstract sendForgotPassword(email: string);
}
