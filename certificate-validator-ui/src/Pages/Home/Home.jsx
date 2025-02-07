import React from "react";
import FileUploader from "../../Components/FileUpload/FileUploader";
import { Header } from "../../Components/Header/Header";

export const Home = () => {
  return (
    <div>
      <Header></Header>
      <FileUploader />
    </div>
  );
};
