export class SetPasswordRequest {
  token: string;
  newPassword: string;
}

export class SetPasswordResponse {
  message: string;
}
