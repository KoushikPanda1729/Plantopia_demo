import { Form, redirect } from "react-router-dom";
import { requireAuth } from "../utils/requireAuth";
import axios from "axios";
import "../styles/setSecurityAndAddress.css";

export const setSecurityAndAddressLoader = async ({ request }) => {
  const { pathname } = new URL(request.url);
  await requireAuth(pathname);
  return null;
};

export const setSecurityAndAddressAction = async ({ request }) => {
  try {
    const data = await request.formData();
    const credencial = {
      answer: data.get("answer"),
      address: data.get("address"),
    };
    await axios.post("/api/v1/users/update-address-security", credencial);
    return redirect("/");
  } catch (error) {
    console.log("Error at security key : ", error);
    return { data: null };
  }
};

const SetSecurityAndAddress = () => {
  return (
    <>
      <Form method="POST" action="/update-security-address" className="form">
        <h3>Add address and security key</h3>
        <br />
        <div className="form-group address">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            autoComplete="off"
            required
            className="input-field"
          />
        </div>
        <div className="form-group security-key">
          <label htmlFor="answer">Security Key</label>
          <input
            type="text"
            name="answer"
            autoComplete="off"
            required
            className="input-field"
          />
        </div>
        <input type="submit" value="Submit" className="submit-button" />
      </Form>
    </>
  );
};

export default SetSecurityAndAddress;
