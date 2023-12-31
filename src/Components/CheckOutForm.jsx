/* eslint-disable react/prop-types */
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAuth from "../Hooks/useAuth";
import useAxios from "../Hooks/useAxios";
import toast from "react-hot-toast";

const CheckOutForm = ({ rowData, refetch, closeModal }) => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    axiosSecure
      .post(`/create-payment-intent?email=${user?.email}`, {
        price: rowData?.fees,
      })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      });
  }, [axiosSecure, rowData?.fees, user?.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card === null) {
      return;
    }
    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      console.log("payment error", error);
      setError(error.message);
    } else {
      setError("");
    }

    // confirm card payment
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || "anonymous",
            name: user?.displayName || "anonymous",
          },
        },
      });
    if (confirmError) {
      setError(confirmError.message);
    } else {
      if (paymentIntent.status === "succeeded") {
        const payload = {
          hostEmail: rowData?.hostEmail,
          userEmail: user?.email,
          userName: user?.displayName,
          campName: rowData?.campName,
          txId: paymentIntent.id,
          amount: rowData?.fees,
        }
        toast.success(
          `Payment Successful. Transaction ID: ${paymentIntent.id}`
        );
        axiosSecure
          .put(`/registeredCamp/${rowData?.id}?email=${user?.email}`, {
            payment: "Paid",
            txId: paymentIntent.id,
          })
          .then((res) => {
            if (res.status === 200) {
              refetch();
              closeModal();
            }
          })
          .catch((error) => {
            console.log(error);
          });
          // send email to host and user
          axiosSecure
          .post(`/send-email?email=${user?.email}`, payload)
      }
    }
    setLoading(false);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        ></CardElement>
        {/* <button
          className="btn bg-rose mt-4"
          type="submit"
          disabled={!stripe}
          onClick={handleSubmit}
        >
          Pay
        </button> */}
        <p className="text-red-600 text-center mt-4">{error}</p>

        <div className="text-center my-8">
          <button
            className="btn text-white bg-rose"
            type="submit"
            disabled={!stripe || !clientSecret}
          >
            {loading ? "Processing..." : `PAY $${rowData?.fees}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckOutForm;
