export abstract class IMailService {
  abstract sendVerifyEmail(email: string, code: string): Promise<void>;
  abstract sendForgotPassword(email: string, token: string): Promise<void>;
}
