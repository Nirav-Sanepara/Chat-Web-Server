import express from "express";
import UserController from "./user.controller";

const router = express.Router();

router.post("/signup", UserController.singUp.bind(UserController));

export default router;
