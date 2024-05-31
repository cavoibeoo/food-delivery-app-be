'use strict';
const nodemailer = require('nodemailer');
const loginData = require('../data/login');
const userData = require('../data/user');

const checkLogin = async (req, res, next) => {
    try {
        const data = req.body;

        const checkEmail = await userData.checkEmailExist(data.email);
        if(!checkEmail){
            return res.send({
                status: 'Error',
                problem: 'Email',
                message: 'This email does not exist'
            })
        }

        const check = await loginData.checkLogin(data);
        if(check){
            const userInfo = await userData.getByEmail(data);
            if (userInfo[0].deleted) {
                return res.send({
                    status: 'Error',
                    problem: 'Disabled user',
                    message: 'This account has been disabled.'
                })
            }
            
            // Set the user ID in a cookie
            res.cookie('user_id', userInfo[0].user_id,{ httpOnly: true });
            return res.send(userInfo);
        }else{
                return res.send({
                    status: 'Error',
                    problem: 'Password',
                    message: 'Incorrect password'
                })
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const checkPassword = async (req, res, next) => {
    try {
        let data = req.body
        data.user_id = req.cookies.user_id
        const checkPassword = await loginData.checkPassword(data)
        res.status(200).send(checkPassword)
    }catch(error){
        return error.message
    }

}
const checkLoginStatus = async (req, res, next) => {
    const userId = req.cookies.user_id;
    // Check if userId is present in the cookie
    if(userId){
        res.send({
            status: true,
            message: 'logged'
        })
    }else{
        res.send({
            status: false,
            message: 'not logged in yet'
        })
    }
  
    next();
};

const logout = (req, res, next) => {
    // Clear the userId cookie
    res.clearCookie('user_id');
  
    res.send({
      status: true,
      message: 'Logged out successfully',
    });
  
    next();
  };

const forgotSendmail = async (req, res) => {
    try {
        const { to } = req.body;

        const checkEmail = await userData.checkEmailExist(req.body.to);
        if(!checkEmail){
            return res.send({
                status: 'Error',
                problem: 'Email',
                message: 'This email does not exist'
            })
        }

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'fooddeliveryhpv@gmail.com',
                pass : 'gmlgrpzxtcctjeit'
                // pass: 'jnff oafy huqc pnbn'
                //pass: 'axzaintevseezvcc'
                // for react app: yilxfskzbkifijpz
                // for postman: axzaintevseezvcc
            }
        });
    
        async function getConfirmationCode() {
            const code = await loginData.confirmCode(req.body.to);
            
            let html = `<h2>This is the confirmation code to reset your password,</h2>
            <p>Please do not share this code with anyone.</p>
            <b style"display: block">Your confirmation code: <h4 style="color: red; display: inline-block">${code}</h4></b>
            <p>Thanks for giving us your feedback. If you need support, please contact via the link below:</p>
            <p>https://www.facebook.com/dhspkt.hcmute</p>
            <img style="max-width: 450px;" src='https://sectona.com/wp-content/uploads/2022/09/Password-Rotation-PAM-101-Featured-Image.png' alt='security-img'></img>`;
        
            return {html, code};
        }
        
        const subject = 'Password recovery confirmation code';
        getConfirmationCode().then(({html, code}) => {
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
                    // res.cookie('confirm_code', code,{ httpOnly: true });

                    return res.send({
                        status: 'Success',
                        result: info.response
                    })

                }
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }    
}


const checkConfirmCode = async (req, res) =>{
    try {
        //data include email + otp
        const data = req.body;

        const checkEmail = await userData.checkEmailExist(req.body.to);
        if(!checkEmail){
            return res.send({
                status: 'Error',
                problem: 'Email',
                message: 'This email does not exist'
            })
        }

        const result = await loginData.checkConfirmCode(data);
        //console.log('result in controller: ', typeof result);
        res.clearCookie('confirm_code');
        if(result){
            return res.send({
                status: 'Success',
                result: result
            });
        }else{
            return res.send({
                status: 'Error',
                result: result
            });
        }
    } catch (error) {
        return error.message;
    }
}

module.exports = {
    checkLogin,
    checkPassword,
    checkLoginStatus,
    logout,
    forgotSendmail,
    checkConfirmCode
}