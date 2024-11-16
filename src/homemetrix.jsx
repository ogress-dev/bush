import { Link } from "react-router-dom";
import "./home.css";
const Homemetrix = () => {
  return (
    <div>
      <h1>Votes Tallies</h1>
      <div className="button-grid">
        <Link to="/president-metrix"><button>votes for president</button></Link>
        <Link to="/governor-metrix"><button>votes for governor</button></Link>
        <Link to="/senator-metrix"><button>votes for senator</button></Link>
        <Link to="/mp-metrix"><button>votes for mp</button></Link>
        <Link to="/mca-metrix"><button>votes for mca</button></Link>
      </div>
    </div>
  );
};

export default Homemetrix;