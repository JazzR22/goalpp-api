const nodemailer = require('nodemailer');

async function sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.WEB_URI}/verify?token=${token}`;
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: '"Goals app" <no-reply@goalsapp.com>',
        to: email,
        subject: 'Confirma tu cuenta',
        html: `<p>Confirma tu cuenta haciendo clic aquí:</p><a href="${verificationUrl}">Verificar cuenta</a>`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
