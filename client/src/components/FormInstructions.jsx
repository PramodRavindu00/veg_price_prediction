import { faCircleInfo, faPepperHot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import Modal from "./Modal";
import { useState } from "react";

const FormInstructions = ({content }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <div className="flex flex-col  w-full">
      <h2 className="hidden sm:flex text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
        How to Fill this Form
      </h2>
      <div className="flex flex-row sm:hidden  space-x-3 items-center">
        <span className="text-gray-800 text-xs">Tap to see Instructions</span>
        <FontAwesomeIcon
          icon={faCircleInfo}
          className="text-green-600"
          onClick={(e) => {
            e.preventDefault();
            openModal();
          }}
        />
      </div>
      <div className="hidden sm:flex flex-col gap-1  px-3 my-1">
        {content.map((instruction, index) => (
          <div key={index} className="flex flex-row items-start space-x-2">
            <FontAwesomeIcon icon={faPepperHot} className="mt-1 text-red-700" />
            <p key={index} className="leading-relaxed text-gray-700">
              {instruction}
            </p>
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalOpen}
        closeModal={closeModal}
        title={"Preference Edit Modal"}
      >
        <div className="flex flex-col gap-1  my-5">
          {content.map((instruction, index) => (
            <div
              key={index}
              className="flex flex-row items-start space-x-3 text-xs"
            >
              <FontAwesomeIcon
                icon={faPepperHot}
                className="mt-1 text-red-700"
              />
              <p
                key={index}
                className="leading-relaxed text-gray-700  text-justify"
              >
                {instruction}
              </p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
FormInstructions.propTypes = {
  content: PropTypes.array,
};
export default FormInstructions;
