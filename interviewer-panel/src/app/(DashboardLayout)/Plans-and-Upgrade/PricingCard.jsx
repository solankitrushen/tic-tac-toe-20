import { Divider } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

const PricingCard = ({ id, plan, price, features, priceSlogan, buttonText, paymentLink }) => {
  const token = Cookies.get('access');

  const loadScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
  };

  const handlePaymentSuccess = async (response) => {
    try {
      console.log(response);
      response.subscription_plan = id;
      response.payment_method = 'razorpay';

      const res = await axios.post('/subscribe/payment-callback/', response, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      window.location.reload();
    } catch (error) {
      console.log(console.error());
    }
  };

  const showRazorPay = async (id) => {
    const res = await loadScript();

    const { data } = await axios.post(
      '/subscribe/make-payment/',
      { subscription_plan: id, payment_method: 'razorpay' },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(data);

    // in data we will receive an object from the backend with the information about the payment
    //that has been made by the user

    var options = {
      key_id: process.env.RAZORPAY_PUBLIC_KEY, // in react your environment variable must start with REACT_APP_
      key_secret: process.env.RAZORPAY_SECRET_KEY,
      amount: data.amount,
      currency: 'INR',
      name: 'Org. Name',
      description: 'Test teansaction',
      image: '', // add image url
      order_id: data.order_id,
      handler: function (response) {
        // we will handle success by calling handlePaymentSuccess method and
        // will pass the response that we've got from razorpay
        handlePaymentSuccess(response);
      },
      // prefill: {
      //   name: "User's name",
      //   email: "User's email",
      //   contact: "User's phone",
      // },
      // notes: {
      //   address: 'Razorpay Corporate Office',
      // },
      theme: {
        color: '#3399cc',
      },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="relative flex mt-5 w-full flex-col justify-center overflow-hidden rounded-2xl z-10 h-[100%]">
      <div className="bg-[#1b1b1b] border border-gray-600 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between h-[100%]">
        <div>
          <h2 className="text-4xl">{plan}</h2>
          <p className="text-2xl my-3 text-[#00C8C8]">
            {price ? '$' : ''} {price} {priceSlogan}
          </p>
          <Divider />
          <ul className="mb-6">
            {features?.map((feature, index) => (
              <li key={index} className="flex items-center mb-2 mt-2">
                <svg
                  className="w-6 h-6 text-[#00C8C8] mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <button
            onClick={() => {
              showRazorPay(id);
            }}
            className="w-full py-2 text-lg bg-white hover:bg-[#13DEB9] text-black rounded-lg transition-colors duration-300"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
