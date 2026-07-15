(function () {
  const container = document.querySelector("#paypal-deposit-button");
  const status = document.querySelector("[data-paypal-status]");
  const config = window.PAYPAL_DEPOSIT_CONFIG || {};

  if (!container) return;

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  if (!config.clientId || config.clientId === "REPLACE_WITH_PAYPAL_CLIENT_ID") {
    setStatus("PayPal deposit button is not configured yet. Add Breanne's PayPal client ID in /assets/js/paypal-config.js.");
    return;
  }

  const amount = container.dataset.amount || config.amount || "50.00";
  const currency = container.dataset.currency || config.currency || "USD";
  const itemName = container.dataset.itemName || config.itemName || "Watercolor Portrait Deposit";
  const script = document.createElement("script");
  script.src = "https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(config.clientId) + "&currency=" + encodeURIComponent(currency) + "&intent=capture&components=buttons,funding-eligibility";
  script.onload = function () {
    if (!window.paypal || !window.paypal.Buttons) {
      setStatus("PayPal could not load. Please try again later.");
      return;
    }

    setStatus("");
    window.paypal.Buttons({
      fundingSource: window.paypal.FUNDING.PAYPAL,
      style: {
        layout: "horizontal",
        color: "gold",
        shape: "rect",
        label: "paypal",
        height: 48
      },
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [{
            description: itemName,
            amount: {
              currency_code: currency,
              value: amount
            }
          }]
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function () {
          setStatus("Deposit received. Thank you!");
        });
      },
      onCancel: function () {
        setStatus("PayPal checkout was cancelled.");
      },
      onError: function () {
        setStatus("PayPal checkout could not be completed. Please contact Breanne.");
      }
    }).render(container);
  };
  script.onerror = function () {
    setStatus("PayPal could not load. Please try again later.");
  };
  document.head.appendChild(script);
})();
