import Navbar from "../../components/Navbar";
import { publicLinks } from "../../assets/navLinks.mjs";
import { scroller } from "react-scroll";

const Services = () => {
  const scroll = () => {
    scroller.scrollTo("service_section", {
      duration: 1000,
      delay: 0,
      smooth: "linear",
      offset: -110,
    });
  };
  return (
    <>
      <Navbar navLinks={publicLinks} />
      <div
        className="relative
    w-full h-[50vh] md:h-[85vh] bg-cover bg-center 
    bg-[url('/images/services.jpg')] 
   flex items-center "
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="flex flex-col items-center  w-full  font-bold  absolute bottom-[5%] sm:top-[10%] text-white">
          <h1 className="text-2xl sm:text-5xl text-center">What We Offer?</h1>
          <h2 className="sm:hidden">Explore Our Services</h2>
          <button
            className="btn-secondary hidden sm:block mt-4"
            onClick={scroll}
          >
            Explore Our Services
          </button>
        </div>
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-8 my-8 max-w-screen-xl mx-auto"
        id="service_section"
      >
        <div className="bg-white p-4 shadow-lg  text-center">
          <h3 className="text-xl font-semibold text-green-700 mb-2">
            Next Week Prediction Tool
          </h3>
          <img
            src="/images/price.jpg"
            alt=""
            className="w-full h-40 md:h-52 object-cover  mx-auto"
          />
          <p className="text-gray-600 mt-2 text-justify">
            Accurately predict the next week&apos;s price of a selected
            vegetable in a selected market from different market areas in Sri
            Lanka.
          </p>
        </div>
        <div className="bg-white p-4 shadow-lg  text-center">
          <h3 className="text-xl font-semibold text-green-700 mb-2">
            4 Weeks Prediction
          </h3>
          <img
            src="/images/4_week.jpeg"
            alt=""
            className="w-full h-40 md:h-52 object-cover  mx-auto"
          />
          <p className="text-gray-600 mt-2 text-justify">
            An extended price prediction for next 4 weeks of a selected
            vegetable in a selected market.
          </p>
        </div>
        <div className="bg-white p-4 shadow-lg  text-center">
          <h3 className="text-xl font-semibold text-green-700 mb-2">
            Advanced Prediction Tool
          </h3>
          <img
            src="/images/multi_pred.jpg"
            alt=""
            className="w-full h-40 md:h-52 object-cover  mx-auto"
          />
          <p className="text-gray-600 mt-2 text-justify">
            Prediction Tool advanced into select multiple vegetables in a
            selected market area.This tool provides multiple predictions of
            different vegetables.
          </p>
        </div>
        <div className="bg-white p-4 shadow-lg  text-center">
          <h3 className="text-xl font-semibold text-green-700 mb-2">
            Weekly Budget Calculator
          </h3>
          <img
            src="/images/cost.png"
            alt=""
            className="w-full h-40 md:h-52 object-cover mx-auto"
          />
          <p className="text-gray-600 mt-2 text-justify">
            Provides users to enter their weekly consuming amount upto 5
            preferred vegetables and predict the required budget for next weeks
            vegetable consumption.
          </p>
        </div>
      </div>
    </>
  );
};

export default Services;
