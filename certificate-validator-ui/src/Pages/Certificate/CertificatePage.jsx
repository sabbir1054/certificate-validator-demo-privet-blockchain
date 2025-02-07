import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import SingleCertificate from "../../Components/SingleCertificate/SingleCertificate";
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_LINK; // Get API link from env

export const CertificatePage = () => {
  const [data, setData] = useState({});
  const params = useParams();
  useEffect(() => {
    fetch(`${API_BASE_URL}/certificate/single/${params?.id}`)
      .then((res) => res.json())
      .then((data) => setData(data?.data));
  }, []);
  return (
    <div>
      <SingleCertificate data={data} />
    </div>
  );
};
