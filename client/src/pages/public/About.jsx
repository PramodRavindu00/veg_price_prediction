import Navbar from "../../components/Navbar";
import { publicLinks } from "../../assets/navLinks.mjs";
const About = () => {
  return (
    <>
      <Navbar navLinks={publicLinks} />
      <div
        className="
    relative w-full h-[50vh] md:h-[70vh] bg-cover bg-center bg-[url('/images/about_top.jpg')] 
   flex items-center mb-2"
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="flex flex-col w-full items-center absolute bottom-[5%] sm:top-[20%] text-white">
          <h1 className="text-2xl sm:text-6xl text-center">
            About GreenPriceNet
          </h1>
        </div>
      </div>
      <div className="w-full flex flex-col p-5 gap-10">
        <p className="lg:text-2xl text-gray-900 text-justify sm:text-center">
          GreenPriceNet is a web-based platform that predicts vegetable prices
          for the coming weeks, helping users make informed purchasing decisions
          and manage their budgets effectively.
        </p>
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full flex flex-col items-center gap-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center mb-4">
              Our Vision & Mission
            </h2>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full">
              <div className="flex flex-col items-center text-center gap-4 flex-1 p-6 bg-amber-50 rounded-lg shadow-lg">
                <div className="w-20 h-20 rounded-full bg-green-700 flex items-center justify-center">
                  <img
                    src="/images/vision.png"
                    alt="Vision Icon"
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="text-lg sm:text-2xl text-green-700 font-semibold">
                  Vision
                </h3>
                <p className="text-gray-700 sm:text-lg">
                  To provide accurate and accessible vegetable price predictions
                  to empower consumers and support sustainable decision-making.
                </p>
              </div>

              <div className="flex flex-col items-center text-center gap-4 flex-1 p-6 bg-amber-50  rounded-lg shadow-lg">
                <div className="w-20 h-20 rounded-full bg-green-700 flex items-center justify-center">
                  <img
                    src="/images/mission.png"
                    alt="Mission Icon"
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="text-lg sm:text-2xl text-green-700 font-semibold">
                  Mission
                </h3>
                <p className="text-gray-700 sm:text-lg">
                  To be the most reliable source of price insights for
                  vegetables of the country.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-5">
          <div className="w-full flex flex-col items-center gap-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center my-4">
              Solving Price Uncertainty with Data-Driven Insights
            </h2>
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 w-full">
              <div className="flex flex-col items-center  text-justify gap-4 flex-1">
                <img
                  src="/images/challenge.jpg"
                  alt="Vision Icon"
                  className="w-96 h-52 sm:h-72 object-cover rounded-lg shadow-lg"
                />
                <p className="text-gray-700 lg:text-lg lg:w-96">
                  Fluctuating vegetable prices often lead to uncertainty for
                  consumers and sellers. GreenPriceNet addresses this by
                  providing reliable price predictions based on historical data
                  and other crucial factors.
                </p>
              </div>

              <div className="flex flex-col items-center text-justify gap-4 flex-1">
                <img
                  src="/images/ml.png"
                  alt="analyzing icon"
                  className="w-96 h-52 sm:h-72 object-cover rounded-lg shadow-lg"
                />
                <p className="text-gray-700 lg:text-lg lg:w-96">
                  Our system analyzes past vegetable price data,festival
                  seasonality, fuel cost, and environmental conditions like
                  rainfall to predict future prices using machine learning
                  algorithms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
