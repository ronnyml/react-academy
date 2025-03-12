import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { routes } from "./routes";
import LoadingSpinner from "./components/LoadingSpinner";
import { queryClient } from "./config/queryConfig";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>{routes}</Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
  );
};

export default App;