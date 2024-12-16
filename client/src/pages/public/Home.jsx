import Navbar from "../../components/Navbar";
import { publicLinks } from "../../assets/navLinks";

const Home = () => {
  return (
    <div className="bg-[#4CBB17] w-full min-h-[100vh]">
      <Navbar navLinks={publicLinks} />
    </div>
  );
};

export default Home;
