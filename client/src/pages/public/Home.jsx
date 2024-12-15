import Navbar from "../../components/Navbar";
import { publicLinks } from "../../assets/navLinks";

const Home = () => {
  return (
    <div>
      <Navbar navLinks={publicLinks} />
    </div>
  );
};

export default Home;
