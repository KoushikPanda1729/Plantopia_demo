import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useLoaderData } from "react-router-dom";
import "../styles/SingleProductPage.css";
import { FaShoppingCart, FaCreditCard } from "react-icons/fa";

export const singleProductPageLoader = async ({ request }) => {
  const url = new URL(request.url);
  const productId = url.pathname.split("/").pop();
  try {
    const product = await axios.get(
      `/api/v1/product/get-single-product/${productId}`
    );
    return { product: product?.data?.data };
  } catch (error) {
    toast.error("Failed to fetch");
    return null;
  }
};

const SingleProductPage = () => {
  const { product } = useLoaderData();

  const {
    description,
    price,
    productImage: { url },
    productName,
    stock,
    title,
  } = product;

  return (
    <div className="flipkart-product-container">
      <div className="flipkart-product-image-container">
        <img src={url} alt={productName} className="flipkart-product-image" />
      </div>
      <div className="flipkart-product-details">
        <h2 className="flipkart-product-name">{productName}</h2>
        <p className="flipkart-product-title">{title}</p>
        <p className="flipkart-product-description">{description}</p>
        <p className="flipkart-product-price">₹ {price}</p>
        <p className="flipkart-product-stock">⭐⭐⭐⭐</p>
        <div className="flipkart-product-buttons">
          <button className="flipkart-add-to-cart-button">
            <FaShoppingCart /> Add to Cart
          </button>
          <button className="flipkart-buy-button">
            <FaCreditCard /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
