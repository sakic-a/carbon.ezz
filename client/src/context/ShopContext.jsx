import { createContext, useContext, useState, useEffect } from "react";
const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [productsList, setProductsList] = useState([]);
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProductsList(data))
      .catch((err) => console.error("Failed to load products", err));
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  const addToCart = (product) => {
    if (product.is_in_stock === false) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };
  const clearCart = () => setCart([]);
  const addProduct = async (product) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error("Failed to add product");
      const newProduct = await response.json();
      setProductsList((prev) => [...prev, newProduct]);
    } catch (err) {
      console.error(err);
    }
  };
  const updateProduct = async (id, productData) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error("Failed to update product");
      const updatedProduct = await response.json();
      setProductsList((prev) => prev.map((p) => p.id === id ? updatedProduct : p));
    } catch (err) {
      console.error(err);
    }
  };
  const deleteProduct = async (id) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setProductsList((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };
  const placeOrder = async (user, shippingDetails) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userEmail: user.email,
          shipping: shippingDetails,
          items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
        }),
      });
      if (!response.ok) throw new Error("Order failed");
      clearCart();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  const sendMessage = async (contactData) => {
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  const submitInquiry = async (inquiryData) => {
    try {
      const response = await fetch("/api/configurator-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData),
      });
      return response.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
        products: productsList,
        addProduct,
        updateProduct,
        deleteProduct,
        sendMessage,
        submitInquiry,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useShop() {
  return useContext(ShopContext);
}
