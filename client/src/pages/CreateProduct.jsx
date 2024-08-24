import React from "react";
import { Form } from "react-router-dom";

export const createProductAction = async ({ request }) => {
  const data = await request.formData();
  console.log(data.get("create-product"));

  return null;
};

const CreateProduct = () => {
  return (
    <div>
      <Form method="POST" action="/dashboard/create-product">
        <input type="text" name="create-product" required autoComplete="off" />
        <button>Add</button>
      </Form>
    </div>
  );
};

export default CreateProduct;
