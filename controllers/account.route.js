const express = require('express');
const accountModel = require('../models/account.model');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const fetch = require("isomorphic-fetch");
const Auth = require('../middlewares/auth.mdw');

const router = express.Router();
var userProfile;
var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//  service: 'gmail',
//  auth: {
//       user: 'lehuyforweb@gmail.com',			//email ID
// 	    pass: '01686293971Hhuy'				//Password 
//     }
// });
var transporter = nodemailer.createTransport({
 host: 'us2.smtp.mailhostbox.com',
 port: 587,
 secure: false,
 auth: {
      user: 'huyle@lab-io.tech',			//email ID
	  pass: '(oflrKiRB1'				//Password 
    },
    tls: {
        ciphers:'SSLv3',
		secureProtocol: "TLSv1_method"
    }
});
async function IsUserPremium(id){
  user = await accountModel.getUserbyID(id);
  let DEP = user[0].TimePremium;
  if(DEP == null) return false;
  let current_datetime = new Date();
  if(current_datetime<DEP)return true;
  else{
    await accountModel.removePremiumUser(id);
    return false;
  }
}
function sendMail(email , otp){
	var details = {
		from: 'huyle@lab-io.tech', // sender address same as above
		to: email, 					// Receiver's email id
		subject: 'Reset Password', // Subject of the mail.
		html: `<!doctype html>
    <html lang="en-US">
    
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Reset Password Email Template</title>
        <meta name="description" content="Reset Password Email Template.">
        <style type="text/css">
            a:hover {text-decoration: underline !important;}
        </style>
    </head>
    
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                              <a href="https://rakeshmandal.com" title="logo" target="_blank">
                                <img width="120" src="https://media3.s-nbcnews.com/i/newscms/2018_21/2442281/og-nbcnews1200x630_c986de7e1bb6ad2281723b692aa61990.png" title="logo" alt="logo">
                              </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                requested to reset your password</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                We cannot simply send you your old password. An OTP to reset your
                                                password has been generated for you. To reset your password, use the
                                                following OTP and follow the instructions.
                                            </p>
                                            <p 
                                                style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">${otp}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                                <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.rakeshmandal.com</strong></p>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>
    
    </html>`					// Sending OTP 
	};


	transporter.sendMail(details, function (error, data) {
		if(error)
			console.log(error)
		else
			console.log(data);
		});
	}
router.post('/login', async function (req, res) {
    const user = await accountModel.findByUsername_1(req.body.username);
    console.log(user)
    if (!user) {
      return res.json("fail");
      }
    const ret = bcrypt.compareSync(req.body.password, user[0].MKUS);
    if (ret === false) {
      return res.json("fail");
      }
    if(!user[0].Valid)
    {
      const email = user[0].Email;
      const Numotp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      const otp=Numotp.toString();
      await accountModel.updateOtp(user[0].MaUS,otp);
      await sendMail(email,otp);
      req.session.user=user;
      return res.json('/account/otp');
    }
    else
    {
      req.session.auth=true;
      req.session.user=user;
    }
    if(user[0].LoaiUS==="Writer")
    {
      return res.json('/writer/view')
    }
    else if(user[0].LoaiUS==="Admin")
    {
      return res.json('/admin/view/category')
    }
    else if(user[0].LoaiUS==="Editor")
    {
      return res.json('/editor/view')
    }
    else{
      const url = req.session.retUrl || '/home';
      return res.json(url);
    }
    
  
  })
  router.get('/is-available', async function (req, res) {
    

    const username = req.query.user;
    const mail=req.query.mail;
    if(typeof(username) !== "undefined"){
    const user = await accountModel.findByUsername_1(username);
    if (user === null) {
      return res.json(true);
    }}
    if(typeof(mail) !== "undefined"){
      if(req.session.user)
      {
        if(mail===req.session.user[0].Email) {res.json(true);}
      }
      const email = await accountModel.findByMail(mail);
      if (email === null ) {
      return res.json(true);
    }}
    res.json(false);
  })
  function createNewAccountID(ListID){
    var res ="";
      if(ListID.length === 0){
        res = "US000";
        return res;
      }
      else{
        var tmp = ListID[ListID.length -1]['MaUS'];
        var num = parseInt(tmp[2] + tmp[3] +tmp[4]) +1;
        var res = num.toString();
        console.log(tmp);
        console.log(num);
        console.log(res);
        if(num<10){
          res = "00" + res;
        }
        else if(num<99){
          res = "0" +res;
        }
        res = "US" +res;
        return res;
      }
  }
  router.get('/authentic', function(req, res){
    var email = "l.honghuy09@gmail.com";
	  var otp = "123456";
	  sendMail(email,otp);	
  })
  router.post('/register', async function (req, res) {
    const hash = bcrypt.hashSync(req.body.raw_password, 10);
    const list = await accountModel.allUsers();
    const newId = createNewAccountID(list);
    let isValid = 0;
    if(req.body.type==="Editor"||req.body.type==="Writer")
    {
      isValid =1;
    }
    const user = {
      MaUS: newId,
      LoaiUS: req.body.type,
      TKUS: req.body.username,
      MKUS: hash,
      NgaySinh: req.body.DOB,
      TenUS: req.body.name,
      Email: req.body.email,
      Valid: isValid,
      TrangThai: 1
    }
    if(req.body.type==="Subscriber")
    {
        const response_key = req.body["g-recaptcha-response"];
        // Put secret key here, which we get from google console
        const secret_key = "6Lddh_cbAAAAAEoHJxrPEsIaVo03sxCO38rDv3Yz";
        
        // Hitting POST request to the URL, Google will
        // respond with success or error scenario.
        const url = 
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;
        
        // Making POST request to verify captcha
        fetch(url, {
          method: "post",
        })
          .then((response) => response.json())
          .then(async(google_response) => {
        
            // google_response is the object return by
            // google as a response 
            if (google_response.success == true) {
              //   if captcha is verified
               await accountModel.addUser(user);
            } else {
              // if captcha is not verified
              res.redirect('/home');
            }
          });
    }
    else
    {
      await accountModel.addUser(user);
    }
    if(req.session.auth){
      if (req.session.user[0].LoaiUS==="Admin")
      {
        res.redirect('/admin/view/add-editor');
      }
      else res.redirect('/home');
    }
    else res.redirect('/home');
  })
  
  router.get('/success', async function(req, res){
    const user = await accountModel.findByMail(userProfile.emails[0].value);
      if (user === null) {
    const list = await accountModel.allUsers();
    const newId = createNewAccountID(list);
    const usergg = {
      MaUS: newId,
      LoaiUS: "Subscriber",
      TKUS: null,
      MKUS: null,
      NgaySinh: '2000-01-01',
      TenUS: userProfile.displayName,
      Email: userProfile.emails[0].value,
      Valid: 1,
      TrangThai: 1
    }
    await accountModel.addUser(usergg);
    const user_1 = await accountModel.findByUsername(newId);
    req.session.auth=true;
    req.session.user=user_1;
    const url = req.session.retUrl || '/';
    res.redirect('/');
  }
  else{
    req.session.auth=true;
    req.session.user=user;
    const url = req.session.retUrl || '/';
    res.redirect('/');
  }
  

  })
  router.get('/error', function(req, res){
    res.send("error logging in");
  })
  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });
  const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  const GOOGLE_CLIENT_ID = '598338795293-jr8fkbp8mh7cc9s0af161ttqddct9hfp.apps.googleusercontent.com';
    const GOOGLE_CLIENT_SECRET = 'sWXOxXQDk2eRSMI3_z87AApg';
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://worldvision.lab-io.tech/account/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
router.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/account/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/account/success');
  });
router.post('/verify', async function(req, res) {
  const otp = req.query.otp;
  const user = await accountModel.findByUsername(req.session.user[0].MaUS);
    if(typeof(otp) !== "undefined"){
      if(otp===user[0].OTP){
        req.session.auth=true;
        req.session.user=user;
        if(user[0].Valid===0)
        {await accountModel.updateValid(user[0].MaUS);}
        req.session.TKUS=null;
        req.session.otp=null;
        return res.json('yes');
    }}
    
    return res.json('no');

})
router.get('/forgotPass', function(req, res) {
  res.render('vwAccount/forgotpassword')
})
router.post('/verifyPass', async function(req, res) {
  const mail = req.body.email;
  req.session.mail=mail;
    if(typeof(mail) !== "undefined"){
      const Numotp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      const otp=Numotp.toString();
      req.session.otp=otp;
      await sendMail(mail,otp);
      return res.render('vwAccount/otp',
      {
        type: 1
      });
    }
    
    return res.json('no');

})
router.post('/verifyotpPass', async function(req, res) {
  const otp = req.query.otp;
  const email= req.session.mail;
  const pass= await bcrypt.hashSync(req.body.password, 10);
    if(typeof(otp) !== "undefined"){
      if(otp===req.session.otp){
        await accountModel.updatePass(email,pass);
        req.session.otp=null;
        req.session.email=null;
        return res.json('yes');
    }}
    
    return res.json('no');

})
router.get('/changepass', Auth.auth , function(req, res) {
  const type=0; //subscriber
  res.render('vwAccount/changepass',type)
})
router.post('/changepass', Auth.auth ,  async function(req, res) {
  const pass= await bcrypt.hashSync(req.body.password1, 10);
  const user= await accountModel.findByUsername(req.session.user[0].MaUS);
  await accountModel.updatePass(user[0].Email,pass);
  res.redirect('/home');

})
router.get('/profile', Auth.auth ,  async function(req, res){
  const account = await accountModel.findByUsername(req.session.user[0].MaUS);
  isPremium = await IsUserPremium(req.session.user[0].MaUS);
  var Pretime =0;
  if(isPremium){
    timeEnd = await accountModel.timeEndPremium(req.session.user[0].MaUS);
    current = new Date();
    Pretime = ((timeEnd[0].TimePremium - current)-(timeEnd[0].TimePremium - current) % 60000) /60000;
    console.log(Pretime);
  }
  res.render('vwAccount/profile',{
    account: account[0],
    IsPremium: isPremium,
    NeedPre: req.session.needPre,
    PreTime: Pretime
  });
  req.session.needPre=false;
})
//Thang
router.get('/profile_w',  Auth.auth ,  async function(req, res){
  const account = await accountModel.findByUsername(req.session.user[0].MaUS);
  isPremium = await IsUserPremium(req.session.user[0].MaUS);
  var Pretime =0;
  if(isPremium){
    timeEnd = await accountModel.timeEndPremium(req.session.user[0].MaUS);
    current = new Date();
    Pretime = ((timeEnd[0].TimePremium - current)-(timeEnd[0].TimePremium - current) % 60000) /60000;
    console.log(Pretime);
  }
  res.render('vwAccount/profile',{
    account: account[0],
    IsPremium: 1,
    NotUser:1,
    NeedPre: req.session.needPre,
    PreTime: Pretime,
    layout: 'writer.hbs'
  },);
  req.session.needPre=false;
})
router.get('/changepass_w', Auth.auth , function(req, res) {
  const type=1; //writer
  res.render('vwAccount/changepass',{layout: 'writer.hbs',type:type})
})
router.post('/changepass_w', Auth.auth ,  async function(req, res) {
  const pass= await bcrypt.hashSync(req.body.password1, 10);
  const user= await accountModel.findByUsername(req.session.user[0].MaUS);
  await accountModel.updatePass(user[0].Email,pass);
  res.redirect('/writer/view');

})
router.get('/profile_e',  Auth.auth ,  async function(req, res){
  const account = await accountModel.findByUsername(req.session.user[0].MaUS);
  isPremium = await IsUserPremium(req.session.user[0].MaUS);
  var Pretime =0;
  if(isPremium){
    timeEnd = await accountModel.timeEndPremium(req.session.user[0].MaUS);
    current = new Date();
    Pretime = ((timeEnd[0].TimePremium - current)-(timeEnd[0].TimePremium - current) % 60000) /60000;
    console.log(Pretime);
  }
  res.render('vwAccount/profile',{
    account: account[0],
    IsPremium: 1,
    NotUser:1,
    NeedPre: req.session.needPre,
    PreTime: Pretime,
    layout: 'editor.hbs'
  },);
  req.session.needPre=false;
})
router.get('/changepass_e', Auth.auth , function(req, res) {
  const type=2; //editor
  res.render('vwAccount/changepass',{layout: 'editor.hbs',type:type})
})
router.post('/changepass_e', Auth.auth ,  async function(req, res) {
  const pass= await bcrypt.hashSync(req.body.password1, 10);
  const user= await accountModel.findByUsername(req.session.user[0].MaUS);
  await accountModel.updatePass(user[0].Email,pass);
  res.redirect('/editor/view');

})
router.get('/profile_a',  Auth.auth ,  async function(req, res){
  const account = await accountModel.findByUsername(req.session.user[0].MaUS);
  isPremium = await IsUserPremium(req.session.user[0].MaUS);
  var Pretime =0;
  if(isPremium){
    timeEnd = await accountModel.timeEndPremium(req.session.user[0].MaUS);
    current = new Date();
    Pretime = ((timeEnd[0].TimePremium - current)-(timeEnd[0].TimePremium - current) % 60000) /60000;
    console.log(Pretime);
  }
  res.render('vwAccount/profile',{
    account: account[0],
    IsPremium: 1,
    NotUser:1,
    NeedPre: req.session.needPre,
    PreTime: Pretime,
    layout: 'adminprofile.hbs'
  },);
  req.session.needPre=false;
})
router.get('/changepass_a', Auth.auth , function(req, res) {
  const type=3; //admin
  res.render('vwAccount/changepass',{layout: 'adminprofile.hbs',type:type})
})
router.post('/changepass_a', Auth.auth ,  async function(req, res) {
  const pass= await bcrypt.hashSync(req.body.password1, 10);
  const user= await accountModel.findByUsername(req.session.user[0].MaUS);
  await accountModel.updatePass(user[0].Email,pass);
  res.redirect('/admin/view/category');

})
//---
router.post('/profile-update',  Auth.auth ,  async function(req, res){
  const email = req.body.email;
  const DOB = req.body.DOB;
  const name= req.body.name;
  const pseudonym = req.body.pseudonym;
  if(email!==req.session.user[0].Email)
  {
  const Numotp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  const otp=Numotp.toString();
  await accountModel.updateOtp(req.session.user[0].MaUS,otp);
  await sendMail(email,otp);
  return res.json(true);
  }
  else
  {
    if(pseudonym==="")
    {
      await accountModel.updateProfile(email, DOB, name, req.session.user[0].MaUS);
      const tmp=await accountModel.findByUsername(req.session.user[0].MaUS);
      req.session.user=tmp;
    }
    else
    {
      await accountModel.updateProfileforWriter(pseudonym,email, DOB, name, req.session.user[0].MaUS);
      const tmp= await accountModel.findByUsername(req.session.user[0].MaUS);
      console.log(tmp);
      req.session.user=tmp;
    }
    return res.json(false);
  }
}
  )
  router.post('/verifychangeprofile',  Auth.auth ,  async function(req, res) {
    const otp = req.body.otp;
    const email= req.body.email;
    const DOB = req.body.DOB;
    const name= req.body.name;
    const pseudonym = req.body.pseudonym;
    const user = await accountModel.findByUsername(req.session.user[0].MaUS);
    console.log(email);
    console.log(otp);
    console.log(DOB);
    console.log(name);
    console.log(req.session.user[0].TKUS)
    console.log(req.session.user[0].OTP)
      if(typeof(otp) !== "undefined"){
        if(otp===user[0].OTP){
          if(pseudonym==="")
          {
            await accountModel.updateProfile(email, DOB, name, req.session.user[0].MaUS);
            const tmp=await accountModel.findByUsername(req.session.user[0].MaUS);
            req.session.user=tmp;
          }
          else
          {
            await accountModel.updateProfileforWriter(pseudonym,email, DOB, name, req.session.user[0].MaUS);
            const tmp=await accountModel.findByUsername(req.session.user[0].MaUS);
            req.session.user=tmp;
          }
          return res.json('yes');
      }}
      
      return res.json('no');
  
  })
  router.post('/assignPremium',  Auth.auth ,  async function(req, res){
    var check = await accountModel.checkPremiumRequest(req.session.user[0].MaUS);
    if(check == true){
      const newRequest={
        MaUS: req.session.user[0].MaUS,
        Status: 0
      }
      await accountModel.sentPremiumRequest(newRequest);
      return res.json('success');
    }
    else{
      return res.json('fail');
    }
  
  })
  router.post('/logout', Auth.auth ,  function(req, res) {
    req.session.auth=false;
    req.session.user=null;
    const url=req.headers.referer || "/";
    res.redirect(url);
  })
  router.get('/otp', function(req, res) {
    res.render('vwAccount/otp')
  })
  router.post('/checkpassword', Auth.auth , async  function(req, res) {
    const user = await accountModel.findByUsername(req.session.user[0].MaUS);
    const ret = bcrypt.compareSync(req.body.password, user[0].MKUS);
    if (ret === false) {
      return res.json("fail");
      }
    return res.json("success");
  })
  
  module.exports = router;
