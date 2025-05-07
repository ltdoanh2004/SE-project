import express from "express";
import {login, forgetPassword, resetPassword, register, getRole, renewToken, changePassword} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", login);

router.post("/forget-password", forgetPassword);
router.get("/reset-password", resetPassword);

router.post("/register", register);

router.post("/change-password", changePassword);

router.get("/role", getRole );

router.post("/refresh-token", renewToken);

export default router;
