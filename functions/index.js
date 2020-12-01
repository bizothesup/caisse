const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp()
const gmailEmail = "smartcaisseapp@gmail.com";
const gmailPassword = "smart@2020!";

const { SENDER_EMAIL, SENDER_PASSWORD } = process.env;

exports.sendEmailNotification = functions.firestore.document('licences/{docId}')
    .onCreate((snap, ctx) => {
        const data = snap.data();
        const doc = snap.id;
        // let authData = nodemailer.createTransport({
        //     host: 'smtp.gmail.com',
        //     port: 465,
        //     secure: true,
        //     auth: {
        //         user: SENDER_EMAIL,
        //         pass: SENDER_PASSWORD
        //     }
        // });
        let authData = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailEmail,
                pass: gmailPassword
                // user: SENDER_EMAIL,
                // pass: SENDER_PASSWORD
            }
        });
        authData.sendMail({
            from: '"Smart Caisse" <smartcaisseapp@gmail.com>',
            to: 'ysalissou@gmail.com',
            subject: 'Nouvelle inscription à Smart Caisse',
            text: `${data.commerce}`,
            // html: `${data.commerce}`,
            html: `Bonjour,<br>Nous avons le plaisir de vous informer qu'une nouvelle inscription vient d'être enregistrée.<br>Paramètres:<br><ul><li>Commerce:${data.commerce}</li><li>Tél:` + snap.id + `</li></ul>`,
        }).then(res => console.log('successfully sent that mail')).catch(err => console.log(err));

    });