import Navbar from "../../components/Navbar";
import { publicLinks } from "../../assets/navLinks.mjs";
import { useState } from "react";
import { guestContactFormValidations } from "../../assets/validations.mjs";
import axios from "axios";
import { toast, Toaster } from "sonner";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contactNo: "",
  message: "",
  date: new Date().toISOString().slice(0, 10),
};

const Contact = () => {
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [charCount, setCharCount] = useState(400);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "");
    if (name === "contactNo") {
      setFormValues({ ...formValues, [name]: numericValue.slice(0, 10) });
    } else if (name === "message") {
      if (value.length <= 400) {
        setFormValues({ ...formValues, [name]: value });
        setCharCount(400 - value.length);
      }
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = guestContactFormValidations(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log("form has validation errors");
    } else {
      setBtnDisabled(true);
      try {
        await axios.post("/api/query/submitQuery", formValues);
        toast.success("Your Message has been sent");
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setFormValues(initialValues);
        setBtnDisabled(false);
      }
    }
  };
  return (
    <>
      <Navbar navLinks={publicLinks} />
      <div
        className="relative
    w-full h-[50vh] md:h-[70vh] bg-cover bg-center 
    bg-[url('/images/contact.png')] 
   flex items-center"
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="flex flex-col w-full items-center sm:items-start font-bold px-5 gap-1  absolute bottom-[10%] sm:bottom-[30%]  text-white">
          <h1 className="text-2xl sm:text-5xl text-center">Contact Us</h1>
          <h2 className="text-center">Having a problem? Ask our experts</h2>
        </div>
      </div>
      <div className="w-full flex flex-col  items-center justify-center gap-4 p-5">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center">
          Get in Touch with Us
        </h2>
        <div className="flex flex-col bg-white p-6 w-full sm:w-3/4 lg:w-1/2 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="form-row-2">
              <div className="w-full">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  placeholder="Enter your First Name"
                  className="form-input"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleChange}
                />
                <span className="form-error">{formErrors.firstName}</span>
              </div>
              <div className="w-full">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter your Last Name"
                  className="form-input"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleChange}
                />
                <span className="form-error">{formErrors.lastName}</span>
              </div>
            </div>
            <div className="form-row-2">
              <div className="w-full">
                <label className="form-label">Email</label>
                <input
                  type="text"
                  placeholder="Enter your Email"
                  className="form-input"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                />
                <span className="form-error">{formErrors.email}</span>
              </div>
              <div className="w-full">
                <label className="form-label">Contact No</label>
                <input
                  type="text"
                  placeholder="Enter your Contact No"
                  className="form-input"
                  name="contactNo"
                  value={formValues.contactNo}
                  onChange={handleChange}
                />
                <span className="form-error">{formErrors.contactNo}</span>
              </div>
            </div>
            <div className="w-full">
              <label className="form-label">Message</label>
              <textarea
                className="form-input"
                name="message"
                value={formValues.message}
                onChange={handleChange}
                rows={5}
                placeholder="Type your Message Here...."
              >
                {formValues.message}
              </textarea>
              <span className="form-error">{formErrors.message}</span>
              <div className="text-xs text-gray-500">
                {charCount} characters remaining
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <button
                type="submit"
                className="btn-primary"
                disabled={btnDisabled}
              >
                {btnDisabled ? "Please Wait..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default Contact;
