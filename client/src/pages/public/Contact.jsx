import Navbar from "../../components/Navbar";
import { publicLinks } from "../../assets/navLinks.mjs";
const Contact = () => {
  return (
    <>
      <Navbar navLinks={publicLinks} />
      <div
        className="relative
    w-full h-[50vh] md:h-[70vh] bg-cover bg-center 
    bg-[url('/images/contact.png')] 
   flex items-center "
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="flex flex-col w-full items-center sm:items-start font-bold px-5 gap-1  absolute bottom-[10%] sm:bottom-[30%]  text-white">
          <h1 className="text-2xl sm:text-5xl text-center">Contact Us</h1>
          <h2 className="text-center">Having a problem? Ask our experts</h2>
        </div>
      </div>
    </>
  );
};

export default Contact;
