import express from "express";
import {login, forgetPassword, resetPassword, register, registerAdmin, getRole, renewToken} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", login);

router.post("/forgetPassword", forgetPassword);
router.get("/resetPassword", resetPassword);

router.post("/register", register);
router.post("/registerAdmin", registerAdmin);

router.get("/getRole", getRole );

router.post("/renewToken", renewToken);

export default router;
