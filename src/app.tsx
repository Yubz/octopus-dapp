import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./ui/layout/layout";
import Monitor from "./pages/monitor/monitor";
import Explore from "./pages/explore/explore";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Navigate to="/monitor" />} />
          <Route path="monitor" element={<Monitor />} />
          <Route path="explore" element={<Explore />} />
          <Route path="*" element={<Navigate to="/monitor" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
