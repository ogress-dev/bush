import { Link } from "react-router-dom";
import "./home.css";
const Home = () => {
  return (
    <div>
      <h1>vote kenya</h1>
      <div className="button-grid">
        <Link to="/president"><button>vote for president</button></Link>
        <Link to="/governor"><button>vote for governor</button></Link>
        <Link to="/senator"><button>vote for senator</button></Link>
        <Link to="/mp"><button>vote for mp</button></Link>
        <Link to="/mca"><button>vote for mca</button></Link>
      </div>
    </div>
  );
};

export default Home;