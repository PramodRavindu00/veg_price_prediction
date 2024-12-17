import { userLinks } from "../../assets/navLinks.mjs";
import Navbar from "../../components/Navbar";

const PredictMain = () => {
  return (
    <div>
      <Navbar publicPage={false} navLinks={userLinks} />
    </div>
  );
};

export default PredictMain;
