import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type SendPasswordResetEmailParams = {
  to: string;
  resetUrl: string;
  userName?: string;
};

export async function sendPasswordResetEmail({
  to,
  resetUrl,
  userName,
}: SendPasswordResetEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ui-gohan <noreply@yourdomain.com>', // 本番環境では認証済みドメインを使用
      to: [to],
      subject: 'パスワードリセットのご案内 - ui-gohan',
      html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button { 
                  display: inline-block; 
                  padding: 12px 24px; 
                  background-color: #007AFF; 
                  color: white; 
                  text-decoration: none; 
                  border-radius: 8px;
                  margin: 20px 0;
                }
                .footer { margin-top: 30px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>パスワードリセットのご案内</h2>
                ${userName ? `<p>こんにちは、${userName}さん</p>` : '<p>こんにちは</p>'}
                <p>ui-gohan のパスワードリセットリクエストを受け付けました。</p>
                <p>以下のボタンをクリックして、新しいパスワードを設定してください。</p>
                <a href="${resetUrl}" class="button">パスワードをリセット</a>
                <p>このリンクは1時間有効です。</p>
                <p>もしパスワードリセットをリクエストしていない場合は、このメールを無視
  してください。</p>
                <div class="footer">
                  <p>このメールに心当たりがない場合は、返信せずに削除してください。</p>
                  <p>© 2025 ui-gohan. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      // テキスト版(HTML非対応のメールクライアント用)
      text: `
  パスワードリセットのご案内

  ${userName ? `こんにちは、${userName}さん` : 'こんにちは'}

  ui-gohan のパスワードリセットリクエストを受け付けました。

  以下のリンクをクリックして、新しいパスワードを設定してください:
  ${resetUrl}

  このリンクは1時間有効です。

  もしパスワードリセットをリクエストしていない場合は、このメールを無視してください。
        `,
    });

    if (error) {
      console.error('Resend email error:', error);
      throw new Error('メール送信に失敗しました');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
}
