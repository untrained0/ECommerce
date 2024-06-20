import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  addToCart,
  clearCart,
  decreaseCart,
  getTotals,
  removeFromCart,
} from "../redux/cartSlice";
import axios from "axios";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [responseId, setResponseId] = useState("");
  const [responseState, setResponseState] = useState([]);

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleDecreaseCart = (product) => {
    dispatch(decreaseCart(product));
  };

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const __DEV__ = document.domain === "stealdeal-backend.onrender.com";

  const createRazorpayOrder = async (amount) => {
    try {
      const response = await axios.post("http://localhost:5000/cart", {
        amount: amount * 100,
        currency: "INR",
      });
      handleRazorpayScreen(response.data.amount);
    } catch (error) {
      console.log("Error creating order:", error);
    }
  };

  const handleRazorpayScreen = async (amount) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_1dRKNhvcJnqWY7",
      currency: "INR",
      amount: amount,
      name: "DealSteal",
      description: "Thank you!",
      handler: (response) => {
        setResponseId(response.razorpay_payment_id);
      },
      prefill: {
        name: "DealSteal",
        email: "sohamkelaskar@gmail.com",
      },
      theme: {
        color: "#F4C430",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const paymentFetch = (e) => {
    e.preventDefault();
    const paymentId = e.target.paymentId.value;

    axios
      .get(`http://localhost:5000/payment/${paymentId}`)
      .then((response) => {
        setResponseState(response.data);
      })
      .catch((error) => {
        console.log("Error fetching payment:", error);
      });
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "image",
      render: (text, record) => (
        <img
          src={record?.images?.length > 0 ? record.images[0] : ""}
          alt=""
          className="w-20 h-20 object-cover rounded-md"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Action",
      render: (text, record) => (
        <button onClick={() => handleRemoveFromCart(record)}>Remove</button>
      ),
    },
  ];

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cart.cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is currently empty</p>
          <div className="start-shopping">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <Table columns={columns} dataSource={cart.cartItems} rowKey={(record) => record._id} />
          <div className="cart-summary">
            <button className="clear-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
            <div className="cart-checkout">
              <div className="subtotal">
                <span>Subtotal</span>
                <span className="amount">₹{cart.cartTotalAmount}</span>
              </div>
              <p>Taxes and shipping calculated at checkout</p>
              <Button className="text-primary" onClick={() => createRazorpayOrder(10)}>
                Pay Now
              </Button>
              {responseId && <p>{responseId}</p>}
              <form onSubmit={paymentFetch}>
                <input type="text" name="paymentId" />
                <button type="submit">Fetch Payment</button>
                {responseState.length !== 0 && (
                  <ul>
                    <li>Amount: {responseState.amount / 100} Rs.</li>
                    <li>Currency: {responseState.currency}</li>
                    <li>Status: {responseState.status}</li>
                    <li>Method: {responseState.method}</li>
                  </ul>
                )}
              </form>
              <div className="continue-shopping">
                <Link to="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-arrow-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                    />
                  </svg>
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
