import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag,
  faCartPlus,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import image from "../styles/image/spinner-white.svg";
import "../styles/homePage.css";

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

  const getFirstTenWords = (text) => {
    const words = text.split(" ");
    return words.length > 10 ? `${words.slice(0, 10).join(" ")}...` : text;
  };

  return (
    <div className="custom-product-card">
      <img src={url} alt={productName} className="custom-product-image" />
      <div className="custom-product-details">
        <h3 className="custom-product-name">{productName}</h3>
        <p className="custom-product-title">{title}</p>
        <p className="custom-product-description">
          {getFirstTenWords(description)}
        </p>
        <p className="custom-product-price">₹ {price}</p>
        <p className="custom-product-stock">Stock: {stock}</p>
        <p className="custom-product-rating">
          {rating}{" "}
          <FontAwesomeIcon icon={faStar} className="custom-star-icon" />
        </p>
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
  );
};

export default ProductCard;
