import { useCallback, useEffect, useState } from 'react';

import { __ } from '@hyva/react-checkout/i18n';
import { config } from '@hyva/react-checkout/config';
import { placeOrderRequest } from '@hyva/react-checkout/api';
import LocalStorage from '@hyva/react-checkout/utils/localStorage';

import createCustomerToken from '../api/createCustomerToken';
import setPaymentMethodPaypalExpress from '../api/setPaymentMethod';
import usePaypalExpressAppContext from './usePaypalExpressAppContext';
import usePaypalExpressCartContext from './usePaypalExpressCartContext';
/*
 Utility to get the token and the payer id from the URL
 */
const getTokenPayerId = (query) => {
  const params = new URLSearchParams(query);
  return { token: params.get('token'), payerId: params.get('PayerID') };
};

export default function usePaypalExpress({ paymentMethodCode }) {
  const [processPaymentEnable, setProcessPaymentEnable] = useState(false);
  const {
    cartId,
    hasCartBillingAddress,
    selectedShippingMethod,
    selectedPaymentMethod,
  } = usePaypalExpressCartContext();
  const { appDispatch, setErrorMessage, setPageLoader } =
    usePaypalExpressAppContext();
  const query = window.location.search;
  const selectedPaymentMethodCode = selectedPaymentMethod?.code;
  const selectedShippingMethodCode = selectedShippingMethod?.methodCode;

  /*
   Check if is possible to proceed on placing the order.
   */
  useEffect(() => {
    if (
      query &&
      selectedShippingMethodCode &&
      ['', paymentMethodCode].includes(selectedPaymentMethodCode)
    )
      setProcessPaymentEnable(true);
  }, [
    query,
    paymentMethodCode,
    setProcessPaymentEnable,
    selectedPaymentMethodCode,
    selectedShippingMethodCode,
  ]);

  const placePaypalExpressOrder = useCallback(async () => {
    /*
     Get paypal express required data from response query
     */
    const { token, payerId } = getTokenPayerId(query);

    if (
      !token ||
      !payerId ||
      !cartId ||
      !selectedShippingMethod ||
      !hasCartBillingAddress
    ) {
      return;
    }

    /*
     Set payment method on cart and place the order
     */
    try {
      setPageLoader(true);
      await setPaymentMethodPaypalExpress(appDispatch, {
        payerId,
        token,
        paymentCode: paymentMethodCode,
      });
      const response = await placeOrderRequest();

      if (response && response.order_number) {
        window.location.replace(`${config.baseUrl}/checkout/onepage/success/`);
        LocalStorage.clearCheckoutStorage();
      } else if (response.errors[0]?.message) {
        setErrorMessage(__(response.errors[0]?.message));
      } else {
        setErrorMessage(
          __(
            'Something went wrong while adding the payment method to the quote.'
          )
        );
      }
    } catch (error) {
      setErrorMessage(
        __('Something went wrong while adding the payment method to the quote.')
      );
    } finally {
      setPageLoader(false);
    }
  }, [
    query,
    cartId,
    appDispatch,
    setPageLoader,
    setErrorMessage,
    paymentMethodCode,
    hasCartBillingAddress,
    selectedShippingMethod,
  ]);

  /*
   Get the customer token from the BE and redirect to paypal.
   */
  const authorizeUser = useCallback(async () => {
    if (!selectedShippingMethodCode || !hasCartBillingAddress) {
      setErrorMessage(__('Please complete all the required data.'));
      return;
    }

    setPageLoader(true);
    const response = await createCustomerToken(appDispatch, {
      returnUrl: `checkout/index/index`,
      cancelUrl: `checkout/index/index`,
      paymentCode: paymentMethodCode,
    });

    if (response) {
      const paypalExpressUrl =
        response?.createPaypalExpressToken?.paypal_urls?.start;

      if (!paypalExpressUrl) {
        setErrorMessage(__('Paypal Error'));
        return;
      }

      window.location.href = paypalExpressUrl;
    }
  }, [
    appDispatch,
    setPageLoader,
    setErrorMessage,
    paymentMethodCode,
    hasCartBillingAddress,
    selectedShippingMethodCode,
  ]);

  return {
    authorizeUser,
    processPaymentEnable,
    placePaypalExpressOrder,
  };
}
