import Iyzipay from 'iyzipay';

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || 'sandbox-p19v0k7nO8hQIfF4rQ4yGfSihR2Kqj0T',
  secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-7m7312Z2dD1zL1G4D9aY1l2vH3wE7O8t',
  uri: 'https://sandbox-api.iyzipay.com'
});

export default iyzipay;
