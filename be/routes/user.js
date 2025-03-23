import express from "express";
import {login, forgetPassword, resetPassword, register, getRole, renewToken} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", login);

router.post("/forgetPassword", forgetPassword);
router.get("/resetPassword", resetPassword);

router.post("/register", register);

router.get("/getRole", getRole );

router.post("/renewToken", renewToken);

export default router;
