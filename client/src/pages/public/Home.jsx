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
          <h1 className="text-3xl sm:text-5xl">PLAN BETTER,SAVE MORE</h1>
          <h2 className="text-lg sm:text-3xl">
            YOUR VEGETABLE PRICE COMPANION!
          </h2>
          <div className="hidden sm:block mt-6">
            {" "}
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </div>
      <div className="text-center mt-6 p-5">
        <p className="text-lg md:text-xl text-gray-700">Welcome to <span className="sm:text-2xl font-bold text-green-600">GreenPriceNet</span>! We help you make smarter decisions with accurate vegetable price predictions. Start saving today!</p>
      </div>
      
    </>
  );
};

export default Home;
