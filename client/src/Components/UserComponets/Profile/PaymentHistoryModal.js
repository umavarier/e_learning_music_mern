import React from "react";
import Modal from "react-modal";
import './PaymentHistoryModal.css';

const PaymentHistoryModal = ({ isOpen, onRequestClose, paymentHistory }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Payment History Modal"
    >
      <h2>Payment History</h2>
      <table className="table">
        <thead>
          <tr>
          <th>Course Name</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Date</th>

          </tr>
        </thead>
        <tbody>
          {paymentHistory.map((payment, index) => (
            <tr key={index}>
                <td>
                <ul>
                  {payment.courseNames.map((course, courseIndex) => (
                    <li key={courseIndex}>{course.name}</li>
                  ))}
                </ul>
              </td>
              <td>{payment.payment.amount}</td>
              <td>{payment.payment.paymentMethod}</td>
              <td>{new Date(payment.payment.timestamp).toLocaleDateString()}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onRequestClose}>Close Modal</button>
    </Modal>
  );
};

export default PaymentHistoryModal;
