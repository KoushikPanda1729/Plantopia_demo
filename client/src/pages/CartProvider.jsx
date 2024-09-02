import React, { createContext, useContext, useReducer } from "react";

const CartContext = createContext();
const cartReducer = (cart, action) => {
  if (action.type === "ADD_TO_CART") {
    return [...cart, action.payload];
  }
  return cart;
};

const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const addToCart = (cartData) => {
    dispatch({ type: "ADD_TO_CART", payload: cartData });
  };
  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartProvider;
