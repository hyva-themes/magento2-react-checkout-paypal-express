import { func, shape, string } from 'prop-types';
import React, { useEffect } from 'react';
import _get from 'lodash.get';
import RadioInput from '../../../../components/common/Form/RadioInput';
import usePaypalExpress from '../hooks/usePaypalExpress';
import useCheckoutFormContext from '../../../../hook/useCheckoutFormContext';
import usePaymentMethodCartContext from "../../../../components/paymentMethod/hooks/usePaymentMethodCartContext";
import usePaymentMethodAppContext from "../../../../components/paymentMethod/hooks/usePaymentMethodAppContext";

function PaypalExpress({ method, selected, actions }) {
  const methodCode = _get(method, 'code');
  const {
    authorizeUser,
    placePaypalExpressOrder,
    processPaymentEnable,
  } = usePaypalExpress({ paymentMethodCode: methodCode });
  const {
    setPaymentMethod,
    selectedPaymentMethod,
  } = usePaymentMethodCartContext();
  const { setPageLoader } = usePaymentMethodAppContext();
  const { registerPaymentAction } = useCheckoutFormContext();
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
    setPaymentMethod,
    methodCode,
    selectedPaymentMethod,
    setPageLoader,
  ]);

  return (
    <div className="w-full">
      <div>
        <RadioInput
          label={_get(method, 'title')}
          name="paymentMethod"
          value={_get(method, 'code')}
          onChange={actions.change}
          checked={isSelected}
        />
      </div>
    </div>
  );
}

const methodShape = shape({
  title: string.isRequired,
  code: string.isRequired,
});

PaypalExpress.propTypes = {
  method: methodShape.isRequired,
  selected: methodShape.isRequired,
  actions: shape({ change: func }),
};

export default PaypalExpress;
