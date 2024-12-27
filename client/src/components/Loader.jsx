import PropTypes from "prop-types";
import BounceLoader from "./../../node_modules/react-spinners/esm/BounceLoader";
const Loader = ({ loading }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <BounceLoader loading={loading} color="green" size={60} />
    </div>
  );
};

Loader.propTypes = {
  loading: PropTypes.bool,
};

export default Loader;
