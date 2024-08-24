import React, { useEffect, useRef, useState } from "react";
import "../styles/allcategory.css";

const AllCategory = ({ _id, name, slug, deleteCategory, updateCategory }) => {
  const [categoryName, setCategoryName] = useState(name);
  const [isUpdate, setIsUpdate] = useState(false);

  const focusRef = useRef(null);

  useEffect(() => {
    if (focusRef.current && isUpdate) {
      focusRef.current.focus();
    }
  }, [isUpdate]);

  const handleUpdateClick = () => {
    if (categoryName.trim() !== "") {
      setIsUpdate(!isUpdate);
      if (categoryName.trim() !== name) {
        updateCategory(_id, categoryName);
      }
    }
  };

  return (
    <div className="category-item">
      <div className="category-details">
        <p className="category-name">
          <input
            ref={focusRef}
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            disabled={!isUpdate}
          />
        </p>
        <p className="category-slug">{slug}</p>
      </div>
      <div className="category-actions">
        <button className="update-btn" onClick={handleUpdateClick}>
          {isUpdate ? "Save" : "Update"}
        </button>
        <button className="delete-btn" onClick={() => deleteCategory(_id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default AllCategory;
