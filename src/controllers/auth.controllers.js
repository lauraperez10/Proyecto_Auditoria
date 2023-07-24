import User from "../models/User.js";
import passport from "passport";

export const renderSignUpForm = (req, res) => res.render("auth/signup");

export const signup = async (req, res) => {
  let errors = [];
  const { name, phone, email, password, confirm_password } = req.body;

  function validarPassword(password){
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{8,}$/;
    return regex.test(password);
  }

  if (password !== confirm_password) {
    errors.push({ text: "Passwords don't match" });
  }

  if (password.length < 8) {
    errors.push({ text: "The password must have a minimum of 8 characters" });
  }

  if (validarPassword(password)){
    
      errors.push({ text: "The password is valid"});
    

  }else{
    errors.push({ text: "The password doesn't meet the requirementss"});
  }

  if (errors.length > 0) {
    return res.render("auth/signup", {
      errors,
      name,
      phone,
      email,
      password,
      confirm_password,
    });
  }

  // Look for email coincidence
  const userFound = await User.findOne({ email: email });
  if (userFound) {
    req.flash("error_msg", "The mail is currently in use");
    return res.redirect("/auth/signup");
  }

  // Saving a New User
  const newUser = new User({ name, phone, email, password });
  newUser.password = await newUser.encryptPassword(password);
  await newUser.save();
  req.flash("success_msg", "you are registered");
  res.redirect("/auth/signin");
};


function generarContrasena(longitud) {
  var caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=";
  var contrasena = "";
  for (var i = 0; i < longitud; i++) {
    var caracterAleatorio = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    contrasena += caracterAleatorio;
  }
  return contrasena;
}

export const renderlogeo = (req, res) => res.render("auth/logeo");


export const logeo = async (req, res) => {
  let errors = [];
  const { name, email, phone } = req.body;
  
  // Ejemplo de uso:
  var password = generarContrasena(9);
  var passwordSinEn=password
  console.log(password); // Resultado: "fE4!#tG2@9%p"
  
  if (errors.length > 0) {
    return res.render("auth/logeo", {
      errors,
      name,
      email,
      phone,
      password
    });
  }

  // Look for email coincidence
  const userFound = await User.findOne({ email: email });
  if (userFound) {
    req.flash("error_msg", "The mail is currently in use");
    return res.redirect("/auth/logeo");
  }

  // Saving a New User
  var mensaje = "You are registered your password is: "+passwordSinEn;
  const newUser = new User({ name, email, password, phone });
  newUser.password = await newUser.encryptPassword(password);
  await newUser.save();
  req.flash("success_msg", mensaje);
  res.redirect("/");
};

export const renderSigninForm = (req, res) => res.render("auth/signin");

export const renderchangepassword = (req, res) => res.render("auth/changepassword");

export const signin = passport.authenticate("local", {
  successRedirect: "/auth/otp",
  failureRedirect: "/auth/signin",
  failureFlash: true,
});

export const changepassword = async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  console.log(password)
  console.log(req.user.email)
  let errors = [];
  function validarPassword(password){
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{8,}$/;
    return regex.test(password);
  }

  if (password !== confirm_password) {
    errors.push({ text: "Passwords don't match" });
  }

  if (password.length < 8) {
    errors.push({ text: "The password must have a minimum of 8 characters" });
  }

  if (validarPassword(password)){
    
    const newUser =   await User.findByIdAndUpdate(req.user.id, { password });
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();
    req.flash("success_msg", "User Updated Successfully");
    res.redirect("/docs");
    

  }else{
    errors.push({ text: "Password does not meet requirements"});
  }
};

export const renderOtpForm = (req, res) => res.render("auth/otp");

export const otp = passport.authenticate("otpAuth", {
  successRedirect: "/docs",
  failureRedirect: "/docs",
  failureFlash: true,
});

export const logout = async (req, res, next) => {
  await req.logout((err) => {
    if (err) return next(err);
    req.flash("success_msg", "You have successfully logged out");
    res.redirect("/auth/signin");
  });
};

