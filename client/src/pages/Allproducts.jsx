import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ViewAllProduct from "./ViewAllProduct";
import "../styles/viewAllProduct.css";

const Allproducts = () => {
  const [allProduct, setAllProduct] = useState([]);

  useEffect(() => {
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
    fetchAllProduct();
  }, []);

  const deleteProduct = async (id, setIsLoading) => {
    try {
      setIsLoading(true);
      const { data } = await axios.delete(
        `/api/v1/product/delete-product/${id}`
      );
      setAllProduct((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
      toast.success("Removed");
    } catch (error) {
      toast.error("Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-grid">
      {allProduct.length === 0 && <h3>No Product Found</h3>}
      {allProduct.length !== 0 &&
        allProduct.map((product) => (
          <ViewAllProduct
            {...product}
            key={product?._id}
            deleteProduct={deleteProduct}
          />
        ))}
    </div>
  );
};

export default Allproducts;
