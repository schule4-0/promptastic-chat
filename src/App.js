import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router";
import Next from "./pages/Next";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="next" element={<Next />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
