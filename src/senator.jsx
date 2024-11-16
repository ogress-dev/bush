import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import links from "./links";
import { db } from "./firebaseConfig";
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";

// List of senator candidates with county as a key
const senatorCandidates = {
  Nairobi: [
    {
      name: "Senator A Nairobi",
      partyImage: links.party1,
    },
    {
      name: "Senator B Nairobi",
      partyImage: links.party2,
    },
  ],
  Mombasa: [
    {
      name: "Senator A Mombasa",
      partyImage: links.party3,
    },
    {
      name: "Senator B Mombasa",
      partyImage: links.party4,
    },
  ],
  // Add more counties as needed
};

const SenatorVote = () => {
  const [selectedSenator, setSelectedSenator] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { governor, county } = location.state || {}; // Retrieve the selected governor and county from location state

  useEffect(() => {
    if (!governor || !county) {
      alert("No governor or county selected. Please go back and select a governor.");
      navigate("/governor"); // Redirect to the governor vote page if no governor is selected
    }
  }, [governor, county, navigate]);

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

    if (!selectedSenator) {
      alert("Please select a senator.");
      return;
    }

    try {
      // Increment the vote count for the selected senator
      await incrementVote(selectedSenator, "Senator");

      alert("Senator vote submitted successfully!");

      // Navigate to the next page (if any)
      navigate("/mp", {
        state: {
          ...location.state,
          senator: selectedSenator,
        },
      });
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("Failed to submit the vote. Please try again.");
    }
  };

  // Get the senator candidates based on the selected county
  const countySenators = selectedCounty ? senatorCandidates[selectedCounty] : [];

  return (
    <div>
      <h1>Vote for Senator</h1>
      <h3>Selected Governor: {governor?.name}</h3>
      <h3>Selected County: {county}</h3>

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
          {Object.keys(senatorCandidates).map((county, index) => (
            <option key={index} value={county}>
              {county}
            </option>
          ))}
        </select>
      </div>

      {/* Display senator candidates based on selected county */}
      {selectedCounty && (
        <form onSubmit={handleSubmit}>
          <div>
            {countySenators.map((candidate, index) => (
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
                  name="senator"
                  value={candidate.name}
                  onChange={() => setSelectedSenator(candidate)}
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            style={{ marginTop: "20px", padding: "0.5rem 1rem" }}
          >
            Submit Senator's Vote
          </button>
        </form>
      )}
    </div>
  );
};

export default SenatorVote;
