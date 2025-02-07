import React from "react";
import AddCertificateForm from "../../Components/AddCertificateForm/AddCertificateForm";
import { ManageCertificateHeader } from "../../Components/ManageCertificateHeader/ManageCertificateHeader";

export const ManageeCertificate = () => {
  return (
    <div>
      <ManageCertificateHeader />
      <AddCertificateForm />
    </div>
  );
};
