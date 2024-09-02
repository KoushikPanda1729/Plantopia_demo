import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  addToCart,
  decreaseQYT,
  deleteFromCart,
  increaseQYT,
} from "../controllers/cart.controller.js";

const cartRouter = Router();
cartRouter.route("/add-to-cart").post(verifyJWT, addToCart);
cartRouter.route("/delete-form-cart").delete(verifyJWT, deleteFromCart);
cartRouter.route("/increase").post(verifyJWT, increaseQYT);
cartRouter.route("/decrease").post(verifyJWT, decreaseQYT);

export default cartRouter;
