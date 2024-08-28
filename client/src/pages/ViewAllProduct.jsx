import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faStar } from "@fortawesome/free-solid-svg-icons";
import "../styles/viewAllProduct.css";
import image from "../styles/image/spinner-white.svg";
import { NavLink } from "react-router-dom";

const ViewAllProduct = ({
  _id,
  description,
  price,
  productImage: { url },
  productName,
  rating,
  stock,
  title,
  deleteProduct,
}) => {
  const [loading, setIsLoading] = useState(false);
  const updatePath = `/dashboard/update-product/${_id}`;
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
         ⭐⭐⭐⭐
        </p>
        <div className="product-buttons">
          <NavLink to={updatePath}>
            <button className="update-button">
              {" "}
              <FontAwesomeIcon icon={faEdit} /> Update
            </button>
          </NavLink>
          <button
            onClick={() => deleteProduct(_id, setIsLoading)}
            className="remove-button"
          >
            {loading ? (
              <img className="spinner-green" src={image} alt="spinner" />
            ) : (
              <>
                <FontAwesomeIcon icon={faTrashAlt} /> Remove
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAllProduct;
