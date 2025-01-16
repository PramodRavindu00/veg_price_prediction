import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Confirm = ({ title, message, onConfirm }) => {
  return confirmAlert({
    title: title,
    message: message,
    buttons: [
      {
        label: "Yes",
        onClick: onConfirm,
      },
      {
        label: "No",
      },
    ],
  });
}

export default Confirm;
