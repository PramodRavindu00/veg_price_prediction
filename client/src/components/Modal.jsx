import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
const Modal = ({ isOpen, closeModal, children }) => {
  const [showModel, setShowModal] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
     setShowModal(true)
    } else {
      setTimeout(() => setShowModal(false), 300);
    }
  }, [isOpen]);

  if (!showModel) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      } px-5`}
      onClick={closeModal}
    >
      <div
        className={`modal bg-white w-full sm:w-2/3 lg:w-1/2 min-h-[75%] max-h-[90vh] overflow-x-hidden overflow-y-auto mx-auto rounded-lg shadow-lg relative p-5 md:p-8 transform transition-all duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none text-xl"
        >
          <FontAwesomeIcon icon={faClose} />
        </button>

        <div>{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal:PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
