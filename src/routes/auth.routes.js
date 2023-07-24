import { Router } from "express";
import {
  renderSignUpForm,
  signup,
  renderSigninForm,
  signin,
  logout,
  logeo,
  renderlogeo,
  renderchangepassword,
  changepassword,
  renderOtpForm,
  otp,
} from "../controllers/auth.controllers.js";

const router = Router();

// Routes
router.get("/auth/signup", renderSignUpForm);

router.post("/auth/signup", signup);

router.get("/auth/signin", renderSigninForm);

router.post("/auth/signin", signin);

router.get("/auth/otp", renderOtpForm);

router.post("/auth/otp", otp);

//router.post("/auth/signin", renderchangepassword);

router.get("/auth/changepassword", renderchangepassword);

router.post("/auth/changepassword", changepassword);

router.get("/auth/logeo", renderlogeo);

router.post("/auth/logeo", logeo);

router.get("/auth/logout", logout);

export default router;
