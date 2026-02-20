export class EmailService {
  async send(to: string, subject: string, html: string) {
    return { to, subject, id: `mail_${Date.now()}`, htmlLength: html.length };
  }
}
