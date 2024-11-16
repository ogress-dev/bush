import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import links from "./links";
import { db } from "./firebaseConfig";
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";

// List of governor candidates with county as a key
const governorCandidates = {
  Nairobi: [
    {
      name: "Governor A Nairobi",
      partyImage: links.party1,
    },
    {
      name: "Governor B Nairobi",
      partyImage: links.party2,
    },
  ],
  Mombasa: [
    {
      name: "Governor A Mombasa",
      partyImage: links.party3,
    },
    {
      name: "Governor B Mombasa",
      partyImage: links.party4,
    },
  ],
  // Add more counties as needed
};

const GovernorVote = () => {
  const [selectedGovernor, setSelectedGovernor] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { president } = location.state || {}; // Retrieve the selected president from location state

  useEffect(() => {
    if (!president) {
      alert("No president selected. Please go back and select a president.");
      navigate("/president"); // Redirect to the president vote page if no president is selected
    }
  }, [president, navigate]);

  // Handle county selection change
  const handleCountyChange = (e) => {
    setSelectedCounty(e.target.value);
  };

  // Increment vote count in Firestore
  const incrementVote = async (candidate, role) => {
    if (!candidate) return; // Skip if no candidate is selected

    try {
      const candidateDocRef = doc(db, "bush", candidate.name); // Use candidate's name as document ID
      const candidateDoc = await getDoc(candidateDocRef);

      if (candidateDoc.exists()) {
        // If the candidate document exists, increment their vote count
        await updateDoc(candidateDocRef, {
          votes: (candidateDoc.data().votes || 0) + 1,
          updatedAt: serverTimestamp(),
        });
      } else {
        // If the candidate document doesn't exist, create it with a vote count of 1
        await setDoc(candidateDocRef, {
          name: candidate.name,
          role: role,
          votes: 1,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error(`Error updating votes for ${candidate.name}:`, error);
      throw error; // Optionally rethrow the error to handle it higher up
    }
  };

  // Handle submitting the vote
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedGovernor) {
      alert("Please select a governor.");
      return;
    }

    try {
      // Increment the vote count for the selected governor
      await incrementVote(selectedGovernor, "Governor");

      alert("Governor vote submitted successfully!");

      // Navigate to the Senator vote page
      navigate("/senator", {
        state: {
          ...location.state,
          governor: selectedGovernor,
          county: selectedCounty,
        },
      });
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("Failed to submit the vote. Please try again.");
    }
  };

  // Get the governor candidates based on the selected county
  const countyGovernors = selectedCounty ? governorCandidates[selectedCounty] : [];

  return (
    <div>
      <h1>Vote for Governor</h1>
      <h3>Selected President: {president?.name}</h3>

      {/* Dropdown for selecting county */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="county-select">Select County: </label>
        <select
          id="county-select"
          value={selectedCounty}
          onChange={handleCountyChange}
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        >
          <option value="">-- Select County --</option>
          {Object.keys(governorCandidates).map((county, index) => (
            <option key={index} value={county}>
              {county}
            </option>
          ))}
        </select>
      </div>

      {/* Display governor candidates based on selected county */}
      {selectedCounty && (
        <form onSubmit={handleSubmit}>
          <div>
            {countyGovernors.map((candidate, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={candidate.partyImage}
                  alt={`${candidate.name} party`}
                  style={{ width: "50px", height: "50px", marginRight: "10px" }}
                />
                <div style={{ flex: 1 }}>
                  <p>{candidate.name}</p>
                </div>
                <input
                  type="radio"
                  name="governor"
                  value={candidate.name}
                  onChange={() => setSelectedGovernor(candidate)}
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            style={{ marginTop: "20px", padding: "0.5rem 1rem" }}
          >
            Submit Governor's Vote
          </button>
        </form>
      )}
    </div>
  );
};

export default GovernorVote;
