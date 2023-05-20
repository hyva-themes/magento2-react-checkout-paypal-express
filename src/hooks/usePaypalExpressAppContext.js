import { useContext } from 'react';

import AppContext from '@hyva/react-checkout/context/App/AppContext';

export default function usePaypalExpressAppContext() {
  const [{ dispatch: appDispatch }, { setErrorMessage, setPageLoader }] =
    useContext(AppContext);

  return {
    appDispatch,
    setErrorMessage,
    setPageLoader,
  };
}
