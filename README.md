# Hyvä Themes - React Checkout Paypal Express

# [![Hyvä Themes](https://github.com/hyva-themes/magento2-react-checkout/blob/documentation/docs/images/logo-hyva.svg)](https://hyva.io/)

## hyva-themes/magento2-react-checkout-paypal-express

Paypal Express payment method for Hyvä React Checkout

## Prerequisites

1. **[Hyvä Checkout](https://github.com/hyva-themes/magento2-hyva-checkout)** is installed and setup.
2. Paypal express is configured in the Magento 2 store backend under `Stores > Configuration > Sales > Payment Methods > Paypal Express Checkout`.

## How to use it with Hyvä Checkout?
Add below code in your `package.json`.

File: `src/reactapp/package.json`

```
"config": {
    "paymentMethodsRepo": {
      "paypalExpress": "git@github.com:hyva-themes/magento2-react-checkout-paypal-express.git"
    }
},
```
With this code in `package.json` and running `npm install`, then you are all set. This repo will be copied into the Hyvä Checkout and configured correctly.

Finally, we need to build the app again. For this, you need to run `npm run build` from the root directory of Hyvä Checkout react app (`src/reactapp`). After this, if you navigate to the checkout page from your site, then you will see the paypal express payment option you have configured in the above step.

## Documentation

- If you need information on the build process of the React Checkout, then you can **[read more about it here](https://hyva-themes.github.io/magento2-hyva-checkout/build/)**.
- If you want to know more about how Hyvä Checkout helps you to integrate any payment methods, then **[read more about it here](https://hyva-themes.github.io/magento2-hyva-checkout/payment-integration/)**.
- The official documentation of **[Hyvä React Checkout](https://hyva-themes.github.io/magento2-hyva-checkout)**
- The Magento documentation of **[Paypal Express](https://docs.magento.com/user-guide/payment/paypal-express-checkout.html)**

## Credits

Special thanks to Webvisum for building the initial release of this Paypal integration for the Hyvä React Checkout!

# [![webvisum GmbH](https://webvisum.de/media/logo/websites/1/logo.png)](https://webvisum.de)

- [Andreas Mautz][link-author]
- [Irene Iaccio][link-author2]
- [WebVisum][link-company1]
- [All Contributors][link-contributors]

## License

BSD 3-Clause License. Please see [License File](LICENSE.txt) for more information.

[link-author]: https://github.com/mautz-et-tong
[link-author2]: https://github.com/nuovecode
[link-company1]: https://webvisum.de
[link-contributors]: ../../contributors


