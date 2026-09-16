import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import CreateJob from "./pages/CreateJob/CreateJob";
import AllJobs from "./pages/AllJobs/AllJobs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create-job" element={<CreateJob />} />
      <Route path="/all-jobs" element={<AllJobs />} />
    </Routes>
  );
}

export default App;
