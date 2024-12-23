import { adminLinks } from "../../assets/navLinks.mjs";
import Navbar from "../../components/Navbar";

const Queries = () => {
  return (
    <>
      <Navbar publicPage={false} navLinks={adminLinks} />
    </>
  );
};

export default Queries;
