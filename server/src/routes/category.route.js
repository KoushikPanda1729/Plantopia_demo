import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import {
  createCategory,
  deleteCategory,
  deleteRelatedCategoryProduct,
  getAllCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter
  .route("/create-category")
  .post(verifyJWT, isAdmin, createCategory);
categoryRouter
  .route("/update-category/:id")
  .patch(verifyJWT, isAdmin, updateCategory);
categoryRouter
  .route("/delete-category/:id")
  .delete(verifyJWT, isAdmin, deleteCategory);
categoryRouter
  .route("/get-all-category")
  .get(verifyJWT, isAdmin, getAllCategory);
categoryRouter
  .route("/delete-all-category-product/:id")
  .delete(verifyJWT, isAdmin, deleteRelatedCategoryProduct);

export default categoryRouter;
