import React from "react";
import { useParams } from "react-router-dom";
import MessagingForm from "./contactPage";

const MessagingFormWrapper: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();

  if (!vendorId) {
    return <p className="text-center mt-10 text-gray-700">Invalid Vendor</p>;
  }

  return <MessagingForm vendorId={vendorId} />;
};

export default MessagingFormWrapper;
