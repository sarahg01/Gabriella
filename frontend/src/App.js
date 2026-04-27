import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TiraPage from "./pages/TiraPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TiraPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
