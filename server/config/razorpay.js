import Razorpay from 'razorpay';

let instance = null;

const isPlaceholder = (value) =>
  !value ||
  /xxxxx|placeholder|your_/i.test(value) ||
  value === 'rzp_test_xxxxx';

export const isRazorpayConfigured = () =>
  !isPlaceholder(process.env.RAZORPAY_KEY_ID) && !isPlaceholder(process.env.RAZORPAY_KEY_SECRET);

export const getRazorpay = () => {
  if (!isRazorpayConfigured()) {
    throw new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
  }
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return instance;
};

export default getRazorpay;
