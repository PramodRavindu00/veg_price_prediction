import PropTypes from "prop-types";
import Select from "react-select";

const styles = {
  control: (provided, state) => ({
    ...provided,
    width: "100%",
    paddingLeft: "0.4rem",
    paddingRight: "0.4rem",
    paddingTop: "0.11rem",
    paddingBottom: "0.11rem",
    border: state.isFocused ? "1px solid #3B82F6" : "2px solid #E5E7EB",
    borderRadius: "0.375rem",
    outline: "none",
    marginBottom: "0.25rem",
    "&:hover": {
      border: state.isFocused ? "1px solid #3B82F6" : "2px solid #E5E7EB",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9CA3AF",
  }),
  singleValue: (provided) => ({
    ...provided,
    //color: "#111827",
    //fontWeight: "600",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 200, // Ensure the dropdown is above the modal content
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 200, // Ensure menu portal also has higher z-index
  }),
};

const SelectBox = ({
  options,
  value,
  onChange,
  placeholder,
  isMulti = false,
}) => {
  return (
    <div>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        styles={styles}
        isMulti={isMulti}
        menuPortalTarget={document.body}
        menuPlacement="auto"
      />
    </div>
  );
};

SelectBox.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string,
    })
  ).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
      })
    ),
  ]),
  isMulti: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SelectBox;
