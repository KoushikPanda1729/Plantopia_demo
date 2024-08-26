import React, { useEffect, useState } from "react";
import { Form, useLoaderData, useNavigation } from "react-router-dom";
import "../styles/createProductForm.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import image from "../styles/image/spinner-white.svg";

export const updateProductLoader = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  try {
    const { data } = await axios.get(
      `/api/v1/product/get-single-product/${id}`
    );
    return { data };
  } catch (error) {
    toast.error("Failed to fetch product");
    return { data: null };
  }
};

export const updateProductAction = async ({ request }) => {
  const formData = await request.formData();
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  try {
    await axios.patch(`/api/v1/product/update-product/${id}`, formData);
    toast.success("Product updated");
  } catch (error) {
    toast.error("Product exists");
  }

  return null;
};

const UpdateProduct = () => {
  const [formValues, setFormValues] = useState({
    productName: "",
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [allCategory, setAllCategory] = useState([]);
  const data = useLoaderData()?.data?.data;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/v1/category/get-all-category");
        setAllCategory(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (data) {
      setFormValues({
        productName: data.productName || "",
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        stock: data.stock || "",
        category: data.category || "",
      });
      setImagePreview(data.productImage?.url || null);
      setImageName(data.productImage?.name || null);
    }

    fetchCategories();
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageName(file.name);
    }
  };

  return (
    <div className="create-product-form-wrapper">
      <Form
        method="POST"
        action={`/dashboard/update-product/${data?._id}`}
        encType="multipart/form-data"
      >
        <h2 className="create-product-heading">Update Product</h2>

        <div className="create-product-form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            name="productName"
            id="productName"
            value={formValues.productName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="create-product-form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formValues.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="create-product-form-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            rows="4"
            value={formValues.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="create-product-form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            id="price"
            value={formValues.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="create-product-form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            name="stock"
            id="stock"
            value={formValues.stock}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="create-product-form-group">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            id="category"
            value={formValues.category}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            {allCategory.length !== 0 &&
              allCategory.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className="create-product-form-group create-product-image-upload">
          <label htmlFor="productImage">Product Image</label>
          <input
            type="file"
            name="productImage"
            id="productImage"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {imagePreview && (
          <div className="create-product-image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="create-product-submit-btn"
        >
          {isSubmitting ? (
            <>
              Please wait...{" "}
              <img className="spinner-green" src={image} alt="spinner" />
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faPlus} /> Update Product
            </>
          )}
        </button>
      </Form>
    </div>
  );
};

export default UpdateProduct;
