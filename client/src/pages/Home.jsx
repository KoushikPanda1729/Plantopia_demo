import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";
import "../styles/homePage.css";

const Home = () => {
  const [allProduct, setAllProduct] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [priceRange, setPriceRange] = useState(50);
  const [categoryValue, setCategoryValue] = useState([]);

  const fetchAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-all-category");
      setAllCategory(data?.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAllProduct = async () => {
    try {
      const data = await axios.get(`/api/v1/product/get-all-product`);
      setAllProduct(data?.data?.data);
      return data;
    } catch (error) {
      toast.error("Failed to fetch");
      return null;
    }
  };

  useEffect(() => {
    fetchAllProduct();
    fetchAllCategory();
  }, []);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setCategoryValue((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((category) => {
          return category !== value;
        });
      }
    });
  };

  return (
    <>
      <form
        className="container"
        onSubmit={(e) => {
          e.preventDefault();
          console.log(categoryValue);
          console.log(priceRange);
        }}
      >
        <div className="filter">
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
            <p>Value is : {priceRange}</p>
          </div>
          <input type="submit" value={"Apply"} className="apply" />
        </div>
        <div className="product-home-grid">
          {allProduct.length !== 0 &&
            allProduct.map((product) => (
              <ProductCard {...product} key={product?._id} />
            ))}
        </div>
      </form>
    </>
  );
};

export default Home;
