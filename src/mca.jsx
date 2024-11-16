import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import links from "./links";
import { db } from "./firebaseConfig"; // Firestore setup
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";

// List of MCA candidates, wards for each subcounty
const mcaCandidates = {
    Nairobi: {
        Westlands: {
            wards: ['Kilimani', 'Parklands', 'Westlands'],
            candidates: {
                Kilimani: [
                    { name: 'MCA A', partyImage: links.party5 },
                    { name: 'MCA B', partyImage: links.party6 },
                ],
                Parklands: [
                    { name: 'MCA C', partyImage: links.party7 },
                    { name: 'MCA D', partyImage: links.party1 },
                ],
                Westlands: [
                    { name: 'MCA E', partyImage: links.party2 },
                    { name: 'MCA F', partyImage: links.party3 },
                ]
            }
        },
        Langata: {
            wards: ['Nairobi West', 'Karen', 'Langata'],
            candidates: {
                NairobiWest: [
                    { name: 'MCA G', partyImage: links.party4 },
                    { name: 'MCA H', partyImage: links.party5 },
                ],
                Karen: [
                    { name: 'MCA I', partyImage: links.party6 },
                    { name: 'MCA J', partyImage: links.party7 },
                ],
                Langata: [
                    { name: 'MCA K', partyImage: links.party1 },
                    { name: 'MCA L', partyImage: links.party2 },
                ]
            }
        },
    },
    Mombasa: {
        // Add subcounty data for Mombasa
    },
};

const MCAVote = () => {
    const [selectedWard, setSelectedWard] = useState('');
    const [selectedMca, setSelectedMca] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { subcounty, county } = location.state || {}; // Get the subcounty passed from MPVote page

    // Check if we have valid data
    useEffect(() => {
        if (!subcounty || !county) {
            alert("Invalid subcounty or county selected.");
            navigate("/mp"); // Redirect to MP vote page if no subcounty or county is passed
        }
        console.log("Selected County:", county); // Debugging log
        console.log("Selected Subcounty:", subcounty); // Debugging log
    }, [subcounty, county, navigate]);

    // Fetch subcounty data based on selected county and subcounty
    const subcountyData = mcaCandidates[county]?.[subcounty];

    // Debugging log for the subcounty data
    useEffect(() => {
        console.log("Subcounty Data:", subcountyData);
    }, [subcountyData]);

    // Handle ward selection
    const handleWardChange = (e) => {
        setSelectedWard(e.target.value);
        setSelectedMca(null); // Reset MCA selection when ward changes
    };

    // Increment vote count for selected MCA in Firestore (using bush collection)
    const incrementMcaVote = async (mca) => {
        if (!mca) return; // Skip if no MCA is selected

        try {
            const mcaDocRef = doc(db, "bush", mca.name); // Use MCA's name as document ID within the "mcaVotes" collection
            const mcaDoc = await getDoc(mcaDocRef);

            console.log(`Attempting to update vote for MCA: ${mca.name}`);

            if (mcaDoc.exists()) {
                // If the MCA document exists, increment the vote count
                console.log(`MCA document exists. Current vote count: ${mcaDoc.data().votes}`);
                await updateDoc(mcaDocRef, {
                    votes: (mcaDoc.data().votes || 0) + 1,
                    updatedAt: serverTimestamp(),
                });
                console.log(`Vote for ${mca.name} updated successfully.`);
            } else {
                // If the MCA document doesn't exist, create it with a vote count of 1
                console.log(`MCA document not found. Creating new document for ${mca.name}.`);
                await setDoc(mcaDocRef, {
                    name: mca.name,
                    subcounty: subcounty,
                    votes: 1,
                    createdAt: serverTimestamp(),
                });
                console.log(`New document created for ${mca.name} with initial vote count.`);
            }
        } catch (error) {
            console.error(`Error updating votes for ${mca.name}:`, error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedMca) {
            alert("Please select an MCA.");
            return;
        }

        // Increment vote count for the selected MCA in Firestore (in the "mcaVotes" collection)
        incrementMcaVote(selectedMca);

        // Navigate to the next page (Selected Vote page)
        navigate("/selected", { state: { ...location.state, mca: selectedMca } });
    };

    return (
        <div>
            <h1>Vote for MCA</h1>
            <form onSubmit={handleSubmit}>
                {/* Ward Selection */}
                <div style={{ marginBottom: "20px" }}>
                    <label>
                        Select Ward:
                        <select value={selectedWard} onChange={handleWardChange} required style={{ padding: "0.5rem", fontSize: "1rem" }}>
                            <option value="">Select a Ward</option>
                            {subcountyData?.wards?.map((ward) => (
                                <option key={ward} value={ward}>{ward}</option>
                            ))}
                        </select>
                    </label>
                </div>

                {/* Show MCA candidates after selecting a ward */}
                {selectedWard && (
                    <>
                        <h2>MCA Candidates for {selectedWard}</h2>
                        {subcountyData.candidates[selectedWard]?.map((mca, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <img
                                    src={mca.partyImage}
                                    alt={`${mca.name} party`}
                                    style={{ marginLeft: 'auto', width: '50px', height: '50px' }}
                                />
                                <div style={{ marginLeft: '150px', marginRight: '150px' }}>
                                    <p>{mca.name}</p>
                                </div>
                                <input
                                    type="radio"
                                    name="mca"
                                    value={mca.name}
                                    onChange={() => setSelectedMca(mca)}
                                />
                            </div>
                        ))}
                    </>
                )}

                <button type="submit">Submit MCA's Vote</button>
            </form>
        </div>
    );
};

export default MCAVote;
