'use strict';
const nodemailer = require('nodemailer');

const sendLetterMail = async (req, res) => {
    const { to, name } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fooddeliveryhpv@gmail.com',
            pass: 'gmlgrpzxtcctjeit'
            //pass: 'axzaintevseezvcc'
            // for react app: yilxfskzbkifijpz
            // for postman: axzaintevseezvcc
        }
    });
    
    const subject = 'UrCake send you a newsletter';
    const html = `<h2>Hi ${name}!</h2>
    <p>Thank you for your interest in our store. We will notify you when there are latest updates on store information.</p>
    <p>Visit the fan page link below to follow our information:</p>
    <p>https://www.facebook.com/dhspkt.hcmute</p>
    <img style="max-width: 450px;" src="https://butternutbakeryblog.com/wp-content/uploads/2023/04/chocolate-cake-1365x2048.jpg" alt="Newsletter Image">`;

    let mailOptions = {
        from: 'fooddeliveryhpv@gmail.com',
        to: to,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send('Email sent: ' + info.response);
        }
    });
    
}

module.exports ={
    sendLetterMail
}
