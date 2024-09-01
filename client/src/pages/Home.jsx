import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../styles/homePage.css";
import { useLoaderData } from "react-router-dom";

export const fetchAllProductLoader = async () => {
  try {
    const data = await axios.get(`/api/v1/product/get-all-product`);
    return { data: data?.data?.data };
  } catch (error) {
    toast.error("Failed to fetch");
    return null;
  }
};

const Home = () => {
  const data = useLoaderData();
  const [allProduct, setAllProduct] = useState(data?.data || []);
  const [allCategory, setAllCategory] = useState([]);
  const [priceRange, setPriceRange] = useState(0);
  const [categoryValue, setCategoryValue] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductFound, setIsProductFound] = useState(false);

  const fetchAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-all-category");
      setAllCategory(data?.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchAllCategory();
  }, []);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setCategoryValue((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((category) => category !== value);
      }
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const price = [0, +priceRange];
          const credencials = {
            categoryValue,
            priceRange: price,
          };

          try {
            const data = await axios.post(
              "/api/v1/product/filter-product",
              credencials
            );
            setAllProduct(data?.data?.data);
            setIsProductFound(false);
          } catch (error) {
            setIsProductFound(true);
            toast.error("Product not found");
          }
        }}
      >
        {!isMenuOpen && (
          <p className="hamburger-menu-button" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} />
          </p>
        )}
        <div className={`hamburger-menu ${isMenuOpen ? "active" : ""}`}>
          <span onClick={toggleMenu}>
            {" "}
            <FontAwesomeIcon icon={faTimes} />
          </span>
          <div className="hamburger-menu-content">
            <div className="filter-by-category">
              <h4 style={{ marginBottom: "0.7rem" }}>Filter by category</h4>
              {allCategory.length !== 0 &&
                allCategory.map((category) => (
                  <label key={category._id} className="category-label">
                    <input
                      type="checkbox"
                      value={category._id}
                      onChange={handleCategoryChange}
                    />
                    {category.name}
                  </label>
                ))}
            </div>
            <div className="filter-by-price">
              <h4 style={{ marginBottom: "0.4rem" }}>Filter by price</h4>
              <input
                type="range"
                className="range-input"
                min="0"
                max="10000"
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(e.target.value);
                }}
              />
              <p>Price Upto: ₹{priceRange}</p>
            </div>
            <input type="submit" value={"Apply"} className="apply" />
          </div>
          <input
            onClick={() => {
              setPriceRange(0);
              setCategoryValue([]);
              setIsProductFound(false);
              setIsMenuOpen(false);
            }}
            type="submit"
            value={"Reset"}
            className="apply"
            style={{ margin: "1rem 0" }}
          />
          {isProductFound && <p style={{ color: "red" }}>Product not found</p>}
        </div>
        <div
          className="container"
          onClick={() => {
            setIsMenuOpen(false);
          }}
        >
          <div className="product-home-grid">
            {allProduct.length !== 0 &&
              allProduct.map((product) => (
                <ProductCard {...product} key={product?._id} />
              ))}
          </div>
        </div>
      </form>
    </>
  );
};

export default Home;
