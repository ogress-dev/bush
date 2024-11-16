import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Login from "./login";
import Signup from "./signup";
import GovernorVote from './governor';
import Home from './home';
import MCAVote from './mca';
import MPVote from './mp';
import PresidentVote from './president';
import Selected from "./selected";
import SenatorVote from "./senator";
import Homemetrix from "./homemetrix";
import PresidentMetricsPage from "./presidentmetrix";
import GovernorMetricsPage from "./GovernorMetricsPage";
import MPetricsPage from "./MPetricsPage";
import MCAMetricsPage from "./MCAMetricsPage";
import SenatorMetricsPage from "./SenatorMetricsPage";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/governor" element={<GovernorVote />} />
                <Route path="/president" element={<PresidentVote />} />
                <Route path="/mp" element={<MPVote />} />
                <Route path="/mca" element={<MCAVote />} />
                <Route path="/senator" element={<SenatorVote />} />
                <Route path="/selected" element={<Selected />} />
                <Route path="/home-metrix" element={<Homemetrix />} />
                <Route path="/president-metrix" element={<PresidentMetricsPage />} />
                <Route path="/governor-metrix" element={<GovernorMetricsPage />} />
                <Route path="/mp-metrix" element={<MPetricsPage />} />
                <Route path="/mca-metrix" element={<MCAMetricsPage/>} />
                <Route path="/senator-metrix" element={<SenatorMetricsPage />} />





            </Routes>
        </BrowserRouter>
    );
};

export default App;
