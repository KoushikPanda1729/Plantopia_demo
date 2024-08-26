import React, { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import "../styles/createProductForm.css";
import axios from "axios";
import toast from "react-hot-toast";

export const createProductAction = async ({ request }) => {
  const formData = await request.formData();
  const categoryId = Object.fromEntries(formData).category;
  try {
    const data = await axios.post(
      `/api/v1/product/create-product/${categoryId}`,
      formData
    );
    toast.success("Product created");
  } catch (error) {
    toast.error("Failed");
  }

  return null;
};

const CreateProduct = () => {
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
  const [loading, setIsLoading] = useState(false);

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

  const handleSubmit = (e) => {
    setFormValues({
      productName: "",
      title: "",
      description: "",
      price: "",
      stock: "",
      category: "",
    });
    setImagePreview(null);
    setImageName(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/v1/category/get-all-category");
        setAllCategory(data?.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="create-product-form-wrapper">
      <Form
        method="POST"
        action="/dashboard/create-product"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2 className="create-product-heading">Create Product</h2>

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
                <option key={category?._id} value={category?._id}>
                  {category?.name}
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
            required
          />
        </div>

        {imagePreview && (
          <div className="create-product-image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}

        <button type="submit" className="create-product-submit-btn">
          Add Product
        </button>
      </Form>
    </div>
  );
};

export default CreateProduct;
