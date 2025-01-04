import Navbar from "../../components/Navbar";
import { publicLinks } from "../../assets/navLinks.mjs";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar navLinks={publicLinks} />
      <div
        className="relative
    w-full h-[50vh] md:h-[70vh] bg-cover bg-center 
    bg-[url('/images/home_top_mob.jpg')] 
    sm:bg-[url('/images/home_top.jpg')] 
   flex items-center "
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="flex flex-col items-center  w-full xl:w-1/2 font-bold gap-2 absolute bottom-[10%] sm:bottom-[20%] text-white">
          <h1 className="text-2xl sm:text-5xl text-center">
            PLAN BETTER,SAVE MORE
          </h1>
          <h2 className="sm:text-3xl text-center">
            YOUR VEGETABLE PRICE COMPANION!
          </h2>
          <div className="hidden lg:block mt-6">
            {" "}
            <button
              className="btn-secondary"
              onClick={() => navigate("/about")}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
      <div className="text-center my-4 p-5">
        <p className="text-lg md:text-xl text-gray-700">
          Welcome to{" "}
          <span className="sm:text-2xl font-bold text-green-600">
            GreenPriceNet
          </span>
          ! We help you make smarter decisions with accurate vegetable price
          predictions. Start saving today!
        </p>
      </div>
      <div className="flex flex-col w-full lg:mb-10 px-5 gap-6">
        <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-semibold">
          Who benefits from{" "}
          <span className="text-green-600">GreenPriceNet</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-0">
          <div className="flex flex-col items-center mb-6 lg:mb-0">
            <img
              src="/images/home_farmer.jpg"
              alt=""
              className="w-96 h-52 sm:h-72 object-cover"
            />
            <p className="text-center text-gray-700 max-w-96 mt-1">
              Farmers can forecast trends and set competitive prices
            </p>
          </div>
          <div className="flex flex-col items-center mb-6 lg:mb-0">
            <img
              src="/images/home_merchant.jpg"
              alt=""
              className="w-96 h-52 sm:h-72 object-cover"
            />
            <p className="text-center text-gray-700 max-w-96 mt-1">
              Merchants can optimize inventory and reduce waste
            </p>
          </div>
          <div className="flex flex-col items-center mb-6 lg:mb-0">
            <img
              src="/images/home_customer.jpg"
              alt=""
              className="w-96 h-52 sm:h-72 object-cover"
            />
            <p className="text-center text-gray-700 max-w-96 mt-1">
              Consumers can plan purchases and save money
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
