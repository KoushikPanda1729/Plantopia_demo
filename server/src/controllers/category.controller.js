import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import ApiError from "../utils/ApiErrors.util.js";
import ApiResponces from "../utils/ApiResponces.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import slugify from "slugify";
import { deleteMultipleImagesOnCloudinary } from "../utils/cloudinary.util.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (name.trim().length === "") {
    throw new ApiError(400, "Name is required");
  }

  const isExistsCategory = await Category.findOne({ name });
  if (isExistsCategory) {
    throw new ApiError(400, "Category already exists");
  }

  const createCategory = await Category.create({
    name,
    slug: slugify(name),
  });

  if (!createCategory) {
    throw new ApiError(400, "Category not created");
  }

  res
    .status(200)
    .json(
      new ApiResponces(200, createCategory, "Category created successfully")
    );
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  const findUpdatedCategory = await Category.findByIdAndUpdate(
    id,
    {
      $set: { name, slug: slugify(name) },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(
      new ApiResponces(200, findUpdatedCategory, "Update category successfully")
    );
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const productsToDelete = await Product.find({ category: id });

    const productImagePublicId = productsToDelete.map(
      (product) => product?.productImage?.public_id
    );

    await deleteMultipleImagesOnCloudinary(productImagePublicId);

    const deleteResult = await Product.deleteMany({ category: id });


    const deleteCategory = await Category.findByIdAndDelete(
      id,
      {
        $unset: { name: null },
      },
      {
        new: true,
      }
    );

    if (!deleteCategory) {
      throw new ApiError(400, "Category does not exists");
    }

    res
      .status(200)
      .json(new ApiResponces(200, {}, "Category deleted successfully"));
  } catch (error) {
    res.status(200).json(new ApiError(200, "Category deletion error"));
  }
});

const getAllCategory = asyncHandler(async (req, res) => {
  const allCategory = await Category.find({});
  res
    .status(200)
    .json(new ApiResponces(200, allCategory, "Get all category successfully"));
});

export { createCategory, updateCategory, deleteCategory, getAllCategory };
