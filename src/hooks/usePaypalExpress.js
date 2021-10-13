import { useCallback, useEffect, useState } from 'react';
import _get from 'lodash.get';
import { __ } from '../../../../i18n';
import usePaypalExpressAppContext from './usePaypalExpressAppContext';
import usePaypalExpressCartContext from './usePaypalExpressCartContext';
import createCustomerToken from '../api/createCustomerToken';
import setPaymentMethodPaypalExpress from '../api/setPaymentMethod';
import { placeOrderRequest } from '../../../../api';
import { performRedirect } from '../../../payone/src/utility';
import LocalStorage from "../../../../utils/localStorage";

/*
 Utility to get the token and the payer id from the URL
 */
const getTokenPayerId = query => {
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
  const { setErrorMessage, setPageLoader } = usePaypalExpressAppContext();
  const query = window.location.search;
  const selectedShippingMethodCode = _get(selectedShippingMethod, 'methodCode');
  const selectedPaymentMethodCode = _get(selectedPaymentMethod, 'code');

  LocalStorage.saveIsExternalShippingAddress(true);
  LocalStorage.saveIsExternalBillingAddress(true);

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
    paymentMethodCode,
    query,
    setProcessPaymentEnable,
    selectedShippingMethodCode,
    selectedPaymentMethodCode,
  ]);

  const placePaypalExpressOrder = useCallback(async () => {
    // setProcessPaymentEnable(false);
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
      await setPaymentMethodPaypalExpress({
        payerId,
        token,
        paymentCode: paymentMethodCode,
      });
      const response = await placeOrderRequest();

      if (response && response.order_number) {
        performRedirect(response);
      } else {
        setPageLoader(false);
        if (response.errors[0]?.message) {
          setErrorMessage(__(response.errors[0]?.message));
        } else {
          setErrorMessage(
            __(
              'Something went wrong while adding the payment method to the quote.'
            )
          );
        }
      }
    } catch (error) {
      setPageLoader(false);
      setErrorMessage(
        __('Something went wrong while adding the payment method to the quote.')
      );
    }
  }, [
    paymentMethodCode,
    cartId,
    query,
    selectedShippingMethod,
    setErrorMessage,
    setPageLoader,
    hasCartBillingAddress,
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
    const response = await createCustomerToken({
      returnUrl: `checkout/index/index`,
      cancelUrl: `checkout/index/index`,
      paymentCode: paymentMethodCode,
    });

    if (response) {
      const paypalExpressUrl = _get(
        response,
        'createPaypalExpressToken.paypal_urls.start'
      );
      if (!paypalExpressUrl) {
        setErrorMessage(__('Paypal Error'));
        return;
      }

      window.location.href = paypalExpressUrl;
    }
  }, [
    paymentMethodCode,
    selectedShippingMethodCode,
    setErrorMessage,
    setPageLoader,
    hasCartBillingAddress,
  ]);

  return {
    authorizeUser,
    placePaypalExpressOrder,
    processPaymentEnable,
  };
}
