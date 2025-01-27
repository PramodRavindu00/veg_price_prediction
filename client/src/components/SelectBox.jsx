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
    border: state.isFocused ? "1px solid #3B82F6" : "2px solid #D1D5DB",
    borderRadius: "0.375rem",
    outline: "none",
    marginBottom: "0.25rem",
    "&:hover": {
      border: state.isFocused ? "1px solid #3B82F6" : "2px solid #D1D5DB",
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
      />
    </div>
  );
};

SelectBox.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
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
