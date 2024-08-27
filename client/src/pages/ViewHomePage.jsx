import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag,
  faCartPlus,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/viewAllProduct.css";
import image from "../styles/image/spinner-white.svg";

const ViewHomePage = ({
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
    <div className="product-card">
      <img src={url} alt={productName} className="product-image" />
      <div className="product-details">
        <h3 className="product-name">{productName}</h3>
        <p className="product-title">{title}</p>
        <p className="product-description">{getFirstTenWords(description)}</p>
        <p className="product-price">₹ {price}</p>
        <p className="product-stock">Stock: {stock}</p>
        <p className="product-rating">
          Rating: {rating}{" "}
          <FontAwesomeIcon icon={faStar} className="star-icon" />
        </p>
        <div className="product-buttons">
          <button className="update-button">
            {loading ? (
              <img className="spinner-green" src={image} alt="spinner" />
            ) : (
              <>
                <FontAwesomeIcon icon={faCartPlus} /> Add to cart
              </>
            )}
          </button>

          <button className="remove-button">
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

export default ViewHomePage;
