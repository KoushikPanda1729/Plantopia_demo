import { Product } from "../models/product.model.js";
import ApiError from "../utils/ApiErrors.util.js";
import ApiResponces from "../utils/ApiResponces.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import {
  deleteOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.util.js";
import slugify from "slugify";

const createProduct = asyncHandler(async (req, res) => {
  const { productName, title, description, price, stock } = req.body;
  const { categoryId } = req.params;
  const userId = req?.user?._id;

  if (
    [productName, title, description, price, stock].some(
      (field) => field.trim().length === 0
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!(userId && categoryId)) {
    throw new ApiError(400, "Userid and category id are required");
  }

  const existsProduct = await Product.findOne({
    $and: [{ productName }, { title }, { description }],
  });

  if (existsProduct) {
    throw new ApiError(400, "Product is already exists");
  }

  const productImageLocalPath = req?.file?.path;
  if (!productImageLocalPath) {
    throw new ApiError(400, "Product image local path is missing");
  }

  const productImageURL = await uploadOnCloudinary(productImageLocalPath);

  if (!productImageURL?.url) {
    throw new ApiError(400, "Product image cloudinary path is missing");
  }

  const createProduct = await Product.create({
    productName,
    title,
    slug: slugify(productName),
    description,
    price,
    stock,
    owner: userId,
    productImage: {
      url: productImageURL.url || "",
      public_id: productImageURL?.public_id,
    },
    category: categoryId,
  });

  res
    .status(200)
    .json(new ApiResponces(200, createProduct, "Product created successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productName, title, description, price, stock } = req.body;
  const { productId } = req.params;

  if (
    [productName, title, description, price, stock].some(
      (field) => field.trim().length === 0
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existsProduct = await Product.findOne({
    $and: [{ productName }, { title }, { description }],
  });

  if (existsProduct) {
    throw new ApiError(400, "Product is already exists");
  }
  const productImageLocalPath = req?.file?.path;

  if (!productImageLocalPath) {
    throw new ApiError(400, "Product image local path is missing");
  }

  const productImageURL = await uploadOnCloudinary(productImageLocalPath);

  if (!productImageURL?.url) {
    throw new ApiError(400, "Product image cloudinary path is missing");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        productName,
        title,
        slug: slugify(productName),
        description,
        price,
        stock,
        productImage: {
          public_id: productImageURL.public_id,
          url: productImageURL.url,
        },
      },
    },
    {
      new: true,
    }
  );
  if (product?.productImage?.public_id) {
    await deleteOnCloudinary(product?.productImage?.public_id);
  }

  res
    .status(200)
    .json(new ApiResponces(200, updatedProduct, "User updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    return res.status(404).json(new ApiResponces(404, {}, "Product not found"));
  }

  if (product.productImage?.public_id) {
    await deleteOnCloudinary(product.productImage.public_id);
  }
  res
    .status(200)
    .json(new ApiResponces(200, {}, "Product delete successfully"));
});

const getAllProduct = asyncHandler(async (_, res) => {
  const allProduct = await Product.find({});
  res
    .status(200)
    .json(new ApiResponces(200, allProduct, "All product fetch successfully"));
});

const getSingleProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const singleProduct = await Product.findById(productId);
  res
    .status(200)
    .json(
      new ApiResponces(200, singleProduct, "Single product fetch successfully")
    );
});

export {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
};
