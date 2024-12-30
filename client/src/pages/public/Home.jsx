import Navbar from "../../components/Navbar";
import { publicLinks } from "../../assets/navLinks.mjs";

const Home = () => {
  return (
    <>
      <Navbar navLinks={publicLinks} />
      <div
        className="
    w-full h-screen bg-cover bg-center 
    bg-[url('/images/home_top_mob.jpg')] 
    sm:bg-[url('/images/home_top.jpg')] 
   flex items-center"
      >
        <div className="flex flex-col items-center  w-full xl:w-1/2 font-bold gap-2 absolute top-[80%] sm:top-[70%] text-white">
          <h1 className="text-2xl sm:text-5xl text-center">
            PLAN BETTER,SAVE MORE
          </h1>
          <h2 className="sm:text-3xl text-center">
            YOUR VEGETABLE PRICE COMPANION!
          </h2>
          <div className="hidden sm:block mt-6">
            {" "}
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </div>
      <div className="text-center my-6 p-5">
        <p className="text-lg md:text-xl text-gray-700">
          Welcome to{" "}
          <span className="sm:text-2xl font-bold text-green-600">
            GreenPriceNet
          </span>
          ! We help you make smarter decisions with accurate vegetable price
          predictions. Start saving today!
        </p>
      </div>
      <div className="flex flex-col w-full mb-6 px-5 gap-4 lg:gap-8">
        <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-semibold">
          Who benefits from{" "}
          <span className="text-green-600">GreenPriceNet</span>?
        </h2>
        <div className="flex flex-col lg:flex-row justify-center lg:justify-evenly  items-center gap-2">
          <div className="flex flex-col items-center mb-8 lg:mb-0">
            <img
              src="/images/home_farmer.jpg"
              alt=""
              className="w-96 h-72 object-cover rounded-lg"
            />
            <span>Farmers can value their products</span>
          </div>
          <div className="flex flex-col items-center mb-8 lg:mb-0">
            <img
              src="/images/home_merchant.jpg"
              alt=""
              className="w-96 h-72 object-cover  rounded-lg"
            />
            <span>Farmers can value their products</span>
          </div>
          <div className="flex flex-col items-center mb-8 lg:mb-0">
            <img
              src="/images/home_customer.jpg"
              alt=""
              className="w-96 h-72 object-cover  rounded-lg"
            />
            <span>Farmers can value their products</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
