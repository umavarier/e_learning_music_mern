// import React, { useEffect, useRef, useState } from 'react'

// export default function PayPal() {

//     const paypal = useRef()
// useEffect(() => {
//     window.paypal.Buttons({
//         createOrder: (data,actions,err) => {
//             return actions.order.create({
//                 intent: "CAPTURE",
//             purchase_units: [
//                 {
//                     description: "cool table",
//                     amount: {
//                         currency_code:"INR",
//                         value: 650.00
//                     }
//                 }
//             ]
//          })
            
//         },
//         onApprove: async ( data, actions) => {
//             const order = await actions.order.capture()
//             console.log("successful order:"+order)
//         },
//         onError:(err) => {
//             console.log(err)
//         }
//     }).render(paypal.current)
// }, [])
//   return (
//     <div>
//       <div ref = {paypal}></div>
//     </div>
//   )
// }


import React, { useEffect, useRef, useState } from 'react';
import { PayPalButton } from "react-paypal-button-v2";

export default function PayPal({ amount }) {
  const onSuccess = (details, data) => {
    console.log("Payment successful", details, data);
    // Handle successful payment here (e.g., update your backend)
  };

  const onError = (err) => {
    console.error("Payment error", err);
    // Handle payment error here
  };

  const onCancel = (data) => {
    console.log("Payment canceled", data);
    // Handle payment cancellation here
  };

  return (
    <PayPalButton
      amount={amount}
      currency="CAD"
      onSuccess={onSuccess}
      onError={onError}
      onCancel={onCancel}
      style={{ shape: "rect" }} // You can customize the button style
    />
  );
}
