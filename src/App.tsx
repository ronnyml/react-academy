import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Suspense } from "react";
import { routes } from "./routes";
import LoadingSpinner from "./components/LoadingSpinner";

const App = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>{routes}</Routes>
      </Suspense>
    </Router>
  );
};

export default App;