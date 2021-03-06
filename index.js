const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const dotenv = require('dotenv').config();

//CONF
const port = 4000 | process.env.PORT;

const app = express()
app.use(cors({origin: "*"}))
app.use(express.json())

app.listen(port, () => {
    console.log("escuchando en el puerto "+port)
})

app.get("/", (req,res)=>{
    res.status(200).json({"Hola": "esto es un mensaje"})
})

app.post("/send", (req, res)=>{
    let user = req.body;

    try {
        sendMail(user, info => {
            console.log(`the mail id is ${info.messageId}`)
            res.status(200).send(info)
        })
    } catch (error) {
        res.status(400).json({message: "error: "+error})
    }
})

async function sendMail(user, callback){
    const {mailUser, message} = user;
    console.log(process.env.USERMAIL)
    if(verificarMessages(mailUser, message)){ throw true}
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASSMAIL
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    let mailOptions = {
        from: '"Portafolio Web" <webdamianal@gmail.com>',
        to: "webdamianal@gmail.com",
        subject: "Enviado desde el Portafolio Damian Almada",
        html: `<H2>De: ${mailUser}</H2><br/>${message}`
    }

    let info = await transporter.sendMail(mailOptions)

    callback(info)
}

const verificarMessages = (mail, messages) => {
    if(mail.includes("<") || mail.includes(">") || mail.includes("</")) {
        return true;
    }
    if(messages.includes("<") || messages.includes(">") || messages.includes("</")) {
        return true;
    }
    return false;
}