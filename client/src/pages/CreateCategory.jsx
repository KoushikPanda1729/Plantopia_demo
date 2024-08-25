import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import AllCategory from "./AllCategory";
import "../styles/createCategory.css";
import image from "../styles/image/spinner-white.svg";

export const createCategoryAction = async ({ request }) => {
  const data = await request.formData();
  const credentials = {
    name: data.get("category-name"),
  };

  try {
    const response = await axios.post(
      `/api/v1/category/create-category`,
      credentials
    );
    return { data: response.data };
  } catch (error) {
    console.log("Error occurred at create category :: ", error);
    return { data: error };
  }
};

const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [loading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.post(`/api/v1/category/create-category`, {
        name: categoryName,
      });

      if (response?.data?.data) {
        setAllCategory((prevCategories) => [
          ...prevCategories,
          response.data.data,
        ]);
        setCategoryName("");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id, setIsLoading) => {
    try {
      setIsLoading(true);
      const { data } = await axios.delete(
        `/api/v1/category/delete-category/${id}`
      );
      setAllCategory((prevCategories) =>
        prevCategories.filter((category) => category._id !== id)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (id, name) => {
    const credenctials = {
      name,
    };
    const { data } = await axios.patch(
      `/api/v1/category/update-category/${id}`,
      credenctials
    );

    setAllCategory((prev) => {
      return prev.map((category) => {
        if (category?._id === id) {
          return { ...category, name, slug: name };
        } else {
          return category;
        }
      });
    });
  };

  return (
    <div className="create-category-container">
      <Form onSubmit={handleSubmit} className="category-form">
        <input
          type="text"
          name="category-name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
          autoComplete="off"
          className="category-input"
          placeholder="Enter Category Name"
        />
        <button disabled={loading} type="submit" className="submit-btn">
          {!loading ? (
            "Add"
          ) : (
            <img className="spinner-green" src={image} alt="spinner" />
          )}
        </button>
      </Form>

      <div className="category-list">
        {allCategory.length !== 0 &&
          allCategory.map((category) => (
            <AllCategory
              {...category}
              key={category._id}
              deleteCategory={deleteCategory}
              updateCategory={updateCategory}
            />
          ))}
      </div>
    </div>
  );
};

export default CreateCategory;
