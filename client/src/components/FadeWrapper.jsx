import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const FadeWrapper = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMounted(false);
    const timeout = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timeout);
  }, [location]);

  return <div className={isMounted ? "fade-in" : ""}>{children}</div>;
};

FadeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FadeWrapper;
