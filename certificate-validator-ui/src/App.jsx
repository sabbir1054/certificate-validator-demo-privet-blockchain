import { Route, Routes } from "react-router";
import { Navbar } from "./Components/NavBar/Navbar";
import { Home } from "./Pages/Home/Home";

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
    </Routes>
  );
}

export default App;
