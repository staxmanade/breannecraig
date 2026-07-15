# Breanne Craig Static Site

This is the single-page commission and intake site for watercolor artist Breanne Craig. It uses local artwork images and runs on GitHub Pages with no build step.

## Site Structure

- `index.html` contains the complete landing page and intake flow.
- `assets/css/styles.css` contains the site styles.
- `assets/js/main.js` builds the inquiry email.
- `assets/js/paypal-config.js` contains the PayPal deposit configuration.
- `assets/js/paypal-deposit.js` renders and handles the PayPal checkout.
- `assets/img/` contains only the artwork used by the landing page.
- `CNAME` configures the `breannecraig.com` custom domain for GitHub Pages.

## Preview Locally

From this folder:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Publish on GitHub Pages

1. Push this repository to GitHub.
2. In GitHub, go to `Settings > Pages`.
3. Set the source to `Deploy from a branch`.
4. Choose the `main` branch and `/root` folder.
5. Add the custom domain `breannecraig.com`.
6. Update DNS at the domain registrar:
   - Apex `A` records to GitHub Pages IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - `www` as a `CNAME` to the GitHub username pages domain, usually `YOUR-GITHUB-USERNAME.github.io`.
7. After GitHub verifies the domain, enable `Enforce HTTPS`.

## Lead Capture

The landing-page form builds a pre-filled email to `artistbreannecraig@gmail.com`. The customer sends that email and attaches their reference photographs before continuing to the deposit step. No form-processing service is required.

## Configure the $50 PayPal Deposit

The landing page renders a PayPal wallet button in Step 2. Keep the integration in sandbox until the complete checkout has been tested successfully.

### What is needed from PayPal

1. Sign in to the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/).
2. Under **Apps & Credentials**, select **Sandbox**.
3. Create or open a REST application owned by the PayPal Business account that will receive portrait deposits.
4. Copy the app's **Client ID**.
5. Use a PayPal sandbox **personal/buyer account** to test the checkout.

The browser may use the Client ID. Never add the **Client Secret** to this repository, `paypal-config.js`, HTML, or browser JavaScript. A Client Secret is only for a secure server-side environment.

### Project files

```text
assets/js/paypal-config.js
assets/js/paypal-deposit.js
index.html
```

`paypal-config.js` contains the editable deposit settings:

```js
window.PAYPAL_DEPOSIT_CONFIG = {
  clientId: "REPLACE_WITH_PAYPAL_CLIENT_ID",
  currency: "USD",
  amount: "50.00",
  itemName: "Watercolor Portrait Deposit",
  environment: "sandbox"
};
```

Replace only `REPLACE_WITH_PAYPAL_CLIENT_ID` with the sandbox Client ID. Keep the amount as a quoted string with two decimal places.

`index.html` already contains the PayPal render target and loads both configuration scripts. `paypal-deposit.js` loads PayPal's JavaScript SDK directly from PayPal, renders one minimal PayPal wallet button, creates a `$50.00 USD` order, captures it after approval, and displays success, cancellation, or error status text. The checkout intentionally specifies `paypal.FUNDING.PAYPAL`; remove that option only if the full eligible-method button stack is desired later.

### Test in sandbox

1. Preview the site locally.
2. Confirm the PayPal button appears in Step 2 without configuration warnings.
3. Click the button and sign in with a sandbox buyer account from the Developer Dashboard. Do not use a real PayPal account for sandbox testing.
4. Confirm the checkout description is `Watercolor Portrait Deposit` and the total is `$50.00 USD`.
5. Approve the payment and confirm the page displays `Deposit received. Thank you!`.
6. In the Developer Dashboard, confirm the sandbox business account received the transaction.
7. Test canceling the checkout and a failed checkout before going live.

### Go live

1. In **Apps & Credentials**, switch from **Sandbox** to **Live**.
2. Open the corresponding live REST app and copy its live Client ID.
3. Replace the sandbox Client ID in `assets/js/paypal-config.js` with the live Client ID.
4. Change `environment` to `live` for clarity.
5. Publish the site and make one real `$50.00` test payment.
6. Confirm the payment appears in the correct PayPal Business account, then refund the test payment if appropriate.

### Production security recommendation

The included scaffold creates and captures the order in browser JavaScript. It is suitable for previewing the buyer experience, but PayPal's current Standard Checkout guidance uses secure server endpoints to create and capture orders. A production backend can independently enforce the `$50.00` amount, keep the Client Secret private, record the PayPal order/capture IDs, and verify payment before marking a commission as reserved.

For that production version, store `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` as server environment variables and add endpoints such as:

```text
POST /api/paypal/orders
POST /api/paypal/orders/:orderID/capture
```

Official references:

- [PayPal Standard Checkout integration](https://developer.paypal.com/platforms/checkout/standard/integrate)
- [PayPal JavaScript SDK reference](https://developer.paypal.com/sdk/js/reference/)

## Notes

- The site intentionally has no additional routes; all visible links stay on the homepage or open email.
- Artwork images are local, so the site does not depend on Wix image URLs.
- Inquiry emails are addressed to `artistbreannecraig@gmail.com`.
