import { Route, Routes } from "react-router";
import { Navbar } from "./Components/NavBar/Navbar";
import { CertificatePage } from "./Pages/Certificate/CertificatePage";
import { Home } from "./Pages/Home/Home";
import { ManageeCertificate } from "./Pages/ManageCertificatePage/ManageeCertificate";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
          </>
        }
      />
      <Route
        path="/home"
        element={
          <>
            <Navbar />
            <Home />
          </>
        }
      />
      <Route
        path="/manageCertificate"
        element={
          <>
            <Navbar />
            <ManageeCertificate />
          </>
        }
      />
      <Route
        path="/certificate/:id"
        element={
          <>
            <Navbar />
            <CertificatePage />
          </>
        }
      />
    </Routes>
  );
}

export default App;
