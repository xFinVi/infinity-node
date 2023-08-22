const User = require("../models/users");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
    isAuthenticated: false,
    oldInput: {
      email: "",
      name: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "INVALID EMAIL or PASSWORD");
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          console.log("Password comparison result:", doMatch);

          if (doMatch) {
            console.log("Login successful:", user.name);
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              if (err) {
                console.log("Session save error:", err);
              }
              res.redirect("/");
            });
          } else {
            console.log("Password does not match for user:", user.name);
            res.redirect("/login"); // Redirect with a message indicating wrong credentials
          }
        })
        .catch((err) => {
          console.log("Password comparison error:", err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log("User lookup error:", err);
      res.redirect("/login");
    });
};

exports.getRegister = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/register", {
    pageTitle: "Register",
    path: "/register",
    errorMessage: message,
    oldInput: {
      email: "",
      name: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: message,
    validationErrors: [],
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "auth/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });

    })
    .catch((err) => console.log(err));
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
          errorMessage: errors.array()[0].msg,
          isAuthenticated: req.session.isLoggedIn,
          oldInput: {
            email: email,
            name: name,
            password: password,
          },
          validationErrors: errors.array(),
        });
      }

      return bcrypt
        .hash(password, 14)
        .then((hashedPassword) => {
          const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
          });
          console.log("USER CREATED", user);
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          const msg = {
            to: email,
            from: "philterzidis@hotmail.com",
            subject: "Website Contact Page",
            html: "<h1> HI THANKS FOR </h1>",
          };
          sgMail.send(msg).then(() => {
            console.log("Email sent");
          });
        })

        .catch((error) => {
          console.error(error);
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No Account matching this email");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        const msg = {
          to: req.body.email,
          from: "philterzidis@hotmail.com",
          subject: "RESET PASSWORD",
          html: `<h1> RESET YOUR PASSWORD </h1>
        <p>  Click on this  <a href="http://localhost:3000/reset/${token}">link</a> to reset your password</p>
        <p>The link will expire in 15minutes</p>
        `,
        };
        sgMail.send(msg).then(() => {
          console.log("Email sent");
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    _id: userId
  })
    .then(user => {
      console.log(user)
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
         return resetUser.save();
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

