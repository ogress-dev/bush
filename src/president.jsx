import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import links from "./links";
import { db } from "./firebaseConfig"; // Firestore setup
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";

const presidents = [
    {
        name: 'President A',
        deputy: 'Deputy A',
        partyImage: links.party7,
    },
    {
        name: 'President B',
        deputy: 'Deputy B',
        partyImage: links.party1,
    },
];

const PresidentVote = () => {
    const [selectedPresident, setSelectedPresident] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Increment vote count for selected President in Firestore (using presidentVotes collection)
    const incrementPresidentVote = async (president) => {
        if (!president) return; // Skip if no president is selected

        try {
            const presidentDocRef = doc(db, "bush", president.name); // Use President's name as document ID within the "presidentVotes" collection
            const presidentDoc = await getDoc(presidentDocRef);

            console.log(`Attempting to update vote for President: ${president.name}`);

            if (presidentDoc.exists()) {
                // If the President document exists, increment the vote count
                console.log(`President document exists. Current vote count: ${presidentDoc.data().votes}`);
                await updateDoc(presidentDocRef, {
                    votes: (presidentDoc.data().votes || 0) + 1,
                    updatedAt: serverTimestamp(),
                });
                console.log(`Vote for ${president.name} updated successfully.`);
            } else {
                // If the President document doesn't exist, create it with a vote count of 1
                console.log(`President document not found. Creating new document for ${president.name}.`);
                await setDoc(presidentDocRef, {
                    name: president.name,
                    deputy: president.deputy,
                    partyImage: president.partyImage, // Save the party image to Firestore
                    votes: 1,
                    createdAt: serverTimestamp(),
                });
                console.log(`New document created for ${president.name} with initial vote count.`);
            }
        } catch (error) {
            console.error(`Error updating votes for ${president.name}:`, error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedPresident) {
            alert("Please select a candidate.");
            return;
        }

        // Increment vote count for the selected President in Firestore (in the "presidentVotes" collection)
        incrementPresidentVote(selectedPresident);

        // Navigate to the next page (Governor Vote page)
        navigate("/governor", { state: { ...location.state, president: selectedPresident } });
    };

    return (
        <div>
            <h1>Vote for President</h1>
            <form onSubmit={handleSubmit}>
                {presidents.map((candidate, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <img
                            src={candidate.partyImage}
                            alt={`${candidate.name} party`}
                            style={{ width: '50px', height: '50px', marginRight: '10px' }}
                        />
                        <div style={{ flex: 1 }}>
                            <p>{candidate.name}</p>
                            <p>{candidate.deputy}</p>
                        </div>
                        <input
                            type="radio"
                            name="president"
                            value={candidate.name}
                            onChange={() => setSelectedPresident(candidate)}
                        />
                    </div>
                ))}
                <button type="submit" style={{ marginTop: '20px', padding: '0.5rem 1rem' }}>
                    Submit Presidential Vote
                </button>
            </form>
        </div>
    );
};

export default PresidentVote;
