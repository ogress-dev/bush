import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import links from "./links";
import { db } from "./firebaseConfig";
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";

// List of MPs with their respective counties and subcounties
const mps = {
    Nairobi: [
        { name: 'MP A', partyImage: links.party3, subcounty: 'Westlands' },
        { name: 'MP B', partyImage: links.party4, subcounty: 'Kasarani' },
    ],
    Mombasa: [
        { name: 'MP C', partyImage: links.party5, subcounty: 'Mvita' },
        { name: 'MP D', partyImage: links.party6, subcounty: 'Changamwe' },
    ],
    // Add more MPs and their respective subcounties here...
};

// List of counties with their subcounties
const counties = {
    Nairobi: ["Westlands", "Kasarani", "Starehe"],
    Mombasa: ["Mvita", "Changamwe", "Kisauni"],
    // Add more counties and subcounties here...
};

const MPVote = () => {
    const [selectedSubcounty, setSelectedSubcounty] = useState("");
    const [selectedMp, setSelectedMp] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const { county } = location.state || {}; // Retrieve the county passed from the Governor Vote page

    // Ensure county is available before rendering
    useEffect(() => {
        if (!county) {
            alert("No county selected. Please go back and select a county.");
            navigate("/governor"); // Redirect if county is not selected
        }
    }, [county, navigate]);

    // Filter MPs based on the selected county
    const filteredMps = mps[county] || [];

    useEffect(() => {
        // Reset the selected subcounty and MP when county changes
        setSelectedSubcounty("");
        setSelectedMp(null);
    }, [county]);

    // Increment vote count for selected MP in Firestore
    const incrementVote = async (mp) => {
        if (!mp) return; // Skip if no MP is selected

        try {
            const mpDocRef = doc(db, "bush", mp.name); // Use MP's name as document ID
            const mpDoc = await getDoc(mpDocRef);

            console.log(`Attempting to update vote for MP: ${mp.name}`);

            if (mpDoc.exists()) {
                // If the MP document exists, increment the vote count
                console.log(`MP document exists. Current vote count: ${mpDoc.data().votes}`);
                await updateDoc(mpDocRef, {
                    votes: (mpDoc.data().votes || 0) + 1,
                    updatedAt: serverTimestamp(),
                });
                console.log(`Vote for ${mp.name} updated successfully.`);
            } else {
                // If the MP document doesn't exist, create it with a vote count of 1
                console.log(`MP document not found. Creating new document for ${mp.name}.`);
                await setDoc(mpDocRef, {
                    name: mp.name,
                    subcounty: mp.subcounty,
                    votes: 1,
                    createdAt: serverTimestamp(),
                });
                console.log(`New document created for ${mp.name} with initial vote count.`);
            }
        } catch (error) {
            console.error(`Error updating votes for ${mp.name}:`, error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if an MP, subcounty, and county are selected
        if (!selectedMp || !county || !selectedSubcounty) {
            alert("Please select an MP, county, and subcounty.");
            return;
        }

        // Increment vote count for the selected MP in Firestore
        incrementVote(selectedMp);

        // Navigate to the next page (MCA Vote page)
        navigate("/mca", {
            state: { ...location.state, mp: selectedMp, county, subcounty: selectedSubcounty },
        });
    };

    return (
        <div>
            <h1>Vote for MPs</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>County:</label>
                    <select
                        value={county}
                        disabled
                        style={{ padding: "0.5rem", fontSize: "1rem", marginBottom: "10px" }}
                    >
                        <option value={county}>{county}</option>
                    </select>
                </div>

                {/* Subcounty selection */}
                {county && (
                    <div>
                        <label>Subcounty:</label>
                        <select
                            value={selectedSubcounty}
                            onChange={(e) => setSelectedSubcounty(e.target.value)}
                            style={{ padding: "0.5rem", fontSize: "1rem" }}
                        >
                            <option value="">Select Subcounty</option>
                            {counties[county]?.map((subcounty, index) => (
                                <option key={index} value={subcounty}>
                                    {subcounty}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Display filtered MPs based on selected county and subcounty */}
                {county && selectedSubcounty && (
                    <div>
                        {filteredMps
                            .filter((mp) => mp.subcounty === selectedSubcounty)
                            .map((mp, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "10px",
                                    }}
                                >
                                    <img
                                        src={mp.partyImage}
                                        alt={`${mp.name} party`}
                                        style={{ marginLeft: "auto", width: "50px", height: "50px" }}
                                    />
                                    <div style={{ marginLeft: "150px", marginRight: "150px" }}>
                                        <p>{mp.name}</p>
                                    </div>
                                    <input
                                        type="radio"
                                        name="mp"
                                        value={mp.name}
                                        onChange={() => setSelectedMp(mp)}
                                    />
                                </div>
                            ))}
                    </div>
                )}

                <button type="submit" style={{ marginTop: "20px", padding: "0.5rem 1rem" }}>
                    Submit MP's Vote
                </button>
            </form>
        </div>
    );
};

export default MPVote;
