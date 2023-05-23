import React, { useEffect } from 'react';
import { func, shape, string } from 'prop-types';

import RadioInput from '@hyva/react-checkout/components/common/Form/RadioInput';
import useCheckoutFormContext from '@hyva/react-checkout/hook/useCheckoutFormContext';
import usePaymentMethodAppContext from '@hyva/react-checkout/components/paymentMethod/hooks/usePaymentMethodAppContext';
import usePaymentMethodCartContext from '@hyva/react-checkout/components/paymentMethod/hooks/usePaymentMethodCartContext';

import usePaypalExpress from '../hooks/usePaypalExpress';

function PaypalExpress({ method, selected, actions }) {
  const methodCode = method?.code;
  const { setPageLoader } = usePaymentMethodAppContext();
  const { registerPaymentAction } = useCheckoutFormContext();
  const { setPaymentMethod, selectedPaymentMethod } =
    usePaymentMethodCartContext();
  const { authorizeUser, placePaypalExpressOrder, processPaymentEnable } =
    usePaypalExpress({ paymentMethodCode: methodCode });
  const isSelected = methodCode === selected.code;

  useEffect(() => {
    registerPaymentAction(methodCode, authorizeUser);
  }, [authorizeUser, registerPaymentAction, methodCode]);

  useEffect(() => {
    if (processPaymentEnable) {
      placePaypalExpressOrder();
    }
  }, [placePaypalExpressOrder, processPaymentEnable]);

  useEffect(() => {
    if (isSelected && selectedPaymentMethod.code !== methodCode) {
      (async () => {
        setPageLoader(true);
        await setPaymentMethod(methodCode);
        setPageLoader(false);
      })();
    }
  }, [
    isSelected,
    methodCode,
    setPageLoader,
    setPaymentMethod,
    selectedPaymentMethod,
  ]);

  return (
    <div className="w-full">
      <div>
        <RadioInput
          value={methodCode}
          name="paymentMethod"
          checked={isSelected}
          label={method?.title}
          onChange={actions.change}
        />
      </div>
    </div>
  );
}

const methodShape = shape({
  code: string.isRequired,
  title: string.isRequired,
});

PaypalExpress.propTypes = {
  method: methodShape.isRequired,
  selected: methodShape.isRequired,
  actions: shape({ change: func }),
};

PaypalExpress.defaultProps = {
  actions: null,
};

export default PaypalExpress;
