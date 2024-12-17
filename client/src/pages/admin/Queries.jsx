import { adminLinks } from "../../assets/navLinks.mjs";
import Navbar from "../../components/Navbar";

const Queries = () => {
  return (
    <div>
      <Navbar publicPage={false} navLinks={adminLinks} />
    </div>
  );
};

export default Queries;
