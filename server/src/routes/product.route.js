import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  createProduct,
  deleteProduct,
  filterProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller.js";

const porductRouter = Router();

porductRouter
  .route("/create-product/:categoryId")
  .post(verifyJWT, isAdmin, upload.single("productImage"), createProduct);
porductRouter
  .route("/update-product/:productId")
  .patch(verifyJWT, isAdmin, upload.single("productImage"), updateProduct);
porductRouter
  .route("/delete-product/:productId")
  .delete(verifyJWT, isAdmin, deleteProduct);
porductRouter.route("/get-all-product").get(getAllProduct);
porductRouter.route("/get-single-product/:productId").get(getSingleProduct);
porductRouter.route("/filter-product").post(filterProduct);

export default porductRouter;
