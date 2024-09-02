import asyncHandler from "../utils/asyncHandler.util.js";

const addToCart = asyncHandler(async (req, res) => {
  return res.send("success");
});
const deleteFromCart = asyncHandler(async (req, res) => {
  return res.send("delete");
});
const increaseQYT = asyncHandler(async (req, res) => {
  return res.send("increase");
});
const decreaseQYT = asyncHandler(async (req, res) => {
  return res.send("decrease");
});

export { addToCart, deleteFromCart, increaseQYT, decreaseQYT };
