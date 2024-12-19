import express from "express";
import UserController from "./user.controller.js";

const router = express.Router();

router.post("/signup", UserController.singUp.bind(UserController));
router.post("/login", UserController.login.bind(UserController));

export default router;
