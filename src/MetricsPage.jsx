import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { db } from "./firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const MetricsPage = ({ role }) => {
  const [candidates, setCandidates] = useState([]); // State to store candidates
  const [loading, setLoading] = useState(true); // State to handle loading status
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const bushCollection = collection(db, "bush");
        const roleQuery = query(bushCollection, where("role", "==", role)); // Filter by role
        const candidateSnapshot = await getDocs(roleQuery);

        const candidateList = candidateSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCandidates(candidateList);
      } catch (error) {
        console.error(`Error fetching ${role} data:`, error);
        alert(`Failed to fetch ${role} data. Please try again.`);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [role]);

  if (loading) {
    return <p>Loading {role} metrics...</p>;
  }

  return (
    <div>
      <h1>{role} Voting Metrics</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #ccc",
              padding: "10px",
              margin: "5px 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <p>{candidate.name}</p>
            </div>
            <p>Votes: {candidate.votes || 0}</p>
          </div>
        ))}
      </div>
      <button
                onClick={()=>{navigate("/home-metrix")}}
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

export default MetricsPage;
