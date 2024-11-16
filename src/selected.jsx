import {  useLocation, useNavigate } from "react-router-dom";

const SelectedPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { president, governor, senator, mp, mca,} = location.state || {};

    return (
        <div>
            <h1>Selected Candidates</h1>
            <div>
                <p><strong>President:</strong> {president?.name || "No selection"}</p>
                <p><strong>Governor:</strong> {governor?.name || "No selection"}</p>
                <p><strong>Senator:</strong> {senator?.name || "No selection"}</p>
                <p><strong>MP:</strong> {mp?.name || "No selection"}</p>
                <p><strong>MCA:</strong> {mca?.name || "No selection"}</p>
            </div>
            <button
                onClick={navigate("/home-metrix")}
                style={{
                    marginTop: "20px",
                    padding: "0.5rem 1rem",
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Submit Votes
            </button>
        </div>
    );
};

export default SelectedPage;
