const User = require("../models/users");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if( message.length > 0 ) {
        message = message[0]
    } else {
        message = null;
    }  
         res.render("auth/login", {
            pageTitle: "Login",
            path: "/login",
            errorsMessage: message,
            isAuthenticated: false,
            oldInput: {
              email: '',
              name: '',
              password:''
            },
            validationErrors: []
          })
          
};

exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true;
    res.redirect("/login");
};
exports.getRegister = (req, res, next) => {
    let message = req.flash('error');
    if( message.length > 0 ) {
        message = message[0]
    } else {
        message = null;
    }    
         res.render("auth/register", {
            pageTitle: "Register",
            path: "/register",
            errorsMessage: message,
            isAuthenticated: false,
            oldInput: {
              email: '',
              name: '',
              password:''
            },
            validationErrors: []
          })
      
};
exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
  });
};
exports.getNewPassword = (req, res, next) => {
  res.render("auth/new-password", {
    pageTitle: "New Password",
    path: "/new-password",
  });
};

/*--------------- POST REQUESTS------------- */

exports.postRegister = (req, res, next) => {

  const { name, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {

    if (user) {
      req.flash("error", "Email is already registered, choose another email");
      return res.redirect("/register");
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("auth/register", {
            pageTitle: "Register",
            path: "/register",
            errorsMessage: errors.array()[0].msg,
            isAuthenticated: false,
            oldInput: {
                email: email,
                name: name,
                password: password
            },
            validationErrors: errors.array()
        });
    }
    
    return bcrypt.hash(password, 14)
    .then(hashedPassword => {
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
           
        });
        console.log("USER CREATED", user);
        return user.save();
    })
    .then(result => {
        res.redirect('/login');
    })
      /*     const msg = {
        to: email,
        from: "philterzidis@hotmail.com",
        subject: "Website Contact Page",
        html: "<h1> HI THANKS FOR </h1>",
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent");
        }) 
        .catch((error) => {
          console.error(error);
        });
        */
  })
  .catch(err => console.log(err));
};


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      res.redirect('/');
    });
};