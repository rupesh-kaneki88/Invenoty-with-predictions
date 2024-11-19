const nodemailer = require('nodemailer');
const dotenv = require('dotenv')

dotenv.config()

const send_mail = async (req, res) => {
    const { name, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'rupeshc048@gmail.com',
            pass: process.env.passcode
        },
    });

    const mailOptions = {
        from: name,
        to: 'rupeshchavan048@gmail.com',
        subject: 'Suggestions for Inventory Management',
        text: `Sent by ${name} \n\n ${message}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};

module.exports = { send_mail };
