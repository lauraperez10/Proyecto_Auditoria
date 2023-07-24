import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Twilio from "twilio";

import User from "../models/User.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      // Match Email's User
      const user = await User.findOne({ email: email });

      if (!user) {
        return done(null, false, { message: "Not User found." });
      }

      // Match Password's User
      const isMatch = await user.matchPassword(password);
      if (!isMatch){
        return done(null, false, { message: "Incorrect Password." });
      }
        await assingOTP(user);
        
      return done(null, user);
    }
  )
);

var strategy = new LocalStrategy(
  {
    usernameField: "otp",
  },
  async (otp, done) => {

    const user = await User.findOne({ otp: otp });

    const isMatch = await user.matchOtp(otp);
    if (!isMatch) {
      return done(null, false, { message: "Incorrect Code." });
    }

    return done(null, user);
  }
)

passport.use( "otpAuth", strategy)

async function assingOTP(user) {
  const otp = String(generateOTP());
  await User.findOneAndUpdate({ email: user.email }, { otp: otp });

  sendOtp(otp, user);
}

async function sendOtp(otp, user) {
  const accountSid = "ACcc54a215e4e19a933f58fe6eaa2f3038";
  const authToken = "69002bbc98cfec6047cb7dabbaaad74c";
  const client = Twilio(accountSid, authToken);
  
  client.messages
    .create({
      body: `Tu código OTP es: ${otp}`,
      from: "+12703722973",
      to: `+57${user.phone}`,
    })
    .then(message => console.log(message.sid)).finally();
}

function generateOTP() {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
