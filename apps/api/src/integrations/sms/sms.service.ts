export class SmsService {
  async send(to: string, message: string) {
    return { to, messageId: `sms_${Date.now()}` };
  }
}
