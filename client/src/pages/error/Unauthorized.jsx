import { useNavigate } from "react-router";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-5 text-gray-800 min-h-[85vh]">
      <h1 className="text-6xl font-bold">403</h1>
      <p className="text-xl mt-4">Access Denied</p>
      <p className="mt-2 text-lg">
        You do not have permission to view this page.
      </p>
      <div className="flex flex-row items-center justify-center space-x-5 mt-6">
        <button
          className="px-6 py-2 text-white bg-gray-600 rounded-lg shadow-lg hover:bg-gray-700 transition"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
        <a
          href="/"
          className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
