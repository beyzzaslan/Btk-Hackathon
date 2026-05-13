import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ResultPage from "./pages/ResultPage"
import NotFound from "./pages/NotFound"
import HistoryPage from "./pages/HistoryPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App