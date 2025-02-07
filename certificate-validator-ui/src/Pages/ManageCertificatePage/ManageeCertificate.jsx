import React from "react";
import AddCertificateForm from "../../Components/AddCertificateForm/AddCertificateForm";
import CertificateTable from "../../Components/CertificateTable/CertificateTable";
import { ManageCertificateHeader } from "../../Components/ManageCertificateHeader/ManageCertificateHeader";

export const ManageeCertificate = () => {
  return (
    <div>
      <ManageCertificateHeader />
      <AddCertificateForm />
      <CertificateTable />
    </div>
  );
};
