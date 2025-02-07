import React from "react";

const SingleCertificate = ({ data }) => {
  return (
    <div className="certificate-container">
      <div className="certificate">
        <h1>Certificate of Completion</h1>
        <h2>{data?.university}</h2>
        <p>This is to certify that</p>
        <h2>{data?.studentName}</h2>
        <p>has successfully completed the course</p>
        <h2>{data?.course}</h2>
        <p>in the Department of {data?.department}</p>
        <p>
          with a CGPA of <strong>{data?.cgpa}</strong>
        </p>
        <p className="info">
          Certificate ID: <strong>{data?.certificateID}</strong>
        </p>
        <p className="info">
          Issued on: <strong>{data?.issueDate}</strong>
        </p>
        <div className="signature">
          <div>
            <hr />
            <p>Registrar</p>
          </div>
          <div>
            <hr />
            <p>Dean, {data?.department}</p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .certificate-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f4f4f4;
        }
        .certificate {
          width: 800px;
          padding: 40px;
          border: 10px solid gold;
          background: white;
          text-align: center;
          box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
        }
        .certificate h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }
        .certificate h2 {
          font-size: 22px;
          margin-bottom: 5px;
        }
        .certificate p {
          font-size: 18px;
          margin: 5px 0;
        }
        .certificate .info {
          margin-top: 20px;
          font-weight: bold;
        }
        .certificate .signature {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
        }
        .certificate .signature div {
          text-align: center;
          width: 45%;
        }
        .certificate .signature hr {
          width: 80%;
          margin: 10px auto;
          border: 1px solid black;
        }
      `}</style>
    </div>
  );
};

export default SingleCertificate;
