import Navbar from "../../components/Navbar";
import { publicLinks } from "../../assets/navLinks.mjs";

const Home = () => {
  return (
    <>
      <Navbar navLinks={publicLinks} />
    </>
  );
};

export default Home;
