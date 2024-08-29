import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag,
  faCartPlus,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import image from "../styles/image/spinner-white.svg";
import "../styles/homePage.css";
import { NavLink } from "react-router-dom";

const ProductCard = ({
  _id,
  description,
  price,
  productImage: { url },
  productName,
  rating,
  stock,
  title,
}) => {
  const [loading, setIsLoading] = useState(false);

  const productDetailsHomePath = `/${_id}`;
  return (
    <div className="single-card-view">
      <div className="custom-product-card">
        <NavLink to={productDetailsHomePath}>
          <img src={url} alt={productName} className="custom-product-image" />
        </NavLink>
        <div className="custom-product-details">
          <NavLink to={productDetailsHomePath}>
            <h3 className="custom-product-name">{productName}</h3>
            <p className="custom-product-title">{title}</p>
            <p className="custom-product-description">
              {description.substring(0, 30)}...
            </p>
            <p className="custom-product-price">₹ {price}</p>
            <p className="custom-product-stock">Stock: {stock}</p>
            <p className="custom-product-rating">⭐⭐⭐⭐</p>
          </NavLink>
          <div className="custom-product-buttons">
            <button className="custom-update-button">
              {loading ? (
                <img className="spinner-green" src={image} alt="spinner" />
              ) : (
                <>
                  <FontAwesomeIcon icon={faCartPlus} /> Add to cart
                </>
              )}
            </button>
            <button className="custom-remove-button">
              {loading ? (
                <img className="spinner-green" src={image} alt="spinner" />
              ) : (
                <>
                  <FontAwesomeIcon icon={faShoppingBag} /> Buy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
