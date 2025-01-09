import { useEffect, useState } from "react";
import { adminLinks } from "../../assets/navLinks.mjs";
import Navbar from "../../components/Navbar";
import axios from "axios";
import Loader from "../../components/Loader";
import ReactPaginate from "react-paginate";
import Modal from "../../components/Modal";
const itemsPerPage = 7;

const Users = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [clickedUser, setClickedUser] = useState({});

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.get("/api/user/getAllUsers");
        setUserDetails(res.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    getUserData();
  }, []);

  const filteredData = userDetails.filter((user) => {
    return (
      user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.nearestMarket.market.market
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.contactNo.includes(searchText) ||
      user.address.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const currentPageItems = filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const openModal = (userId) => {
    setModalOpen(true);
    const user = userDetails.find((user) => user._id === userId);
    setClickedUser(user);
  };
  const closeModal = () => {
    setModalOpen(false);
    setTimeout(()=> setClickedUser({}),100)
  };

  return (
    <>
      <Navbar publicPage={false} navLinks={adminLinks} />
      <div className="flex flex-col p-5 gap-5">
        <div className="flex justify-end ">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <input
              type="text"
              placeholder="Search Users...."
              className="form-input"
              name="query"
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(0);
              }}
            />
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto  rounded-md">
            {filteredData.length == 0 ? (
              <p className="text-center text-gray-500 py-4">
                No data available.
              </p>
            ) : (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-400">
                    <th className="td">Name</th>

                    <th className="td hidden lg:table-cell">Market Area</th>
                    <th className="td hidden md:table-cell">Email</th>
                    <th className="td hidden sm:table-cell">Contact No</th>
                    <th className="td hidden xl:table-cell">Address</th>
                    <th className="td">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageItems.map((user, index) => {
                    return (
                      <tr
                        className="border-t hover:bg-blue-200 hover:cursor-pointer"
                        key={index}
                      >
                        <td className="td">{`${user.firstName} ${user.lastName}`}</td>

                        <td className="td hidden lg:table-cell">
                          {user.nearestMarket.market.market}
                        </td>
                        <td className="td hidden md:table-cell">
                          {user.email}
                        </td>
                        <td className="td hidden sm:table-cell">
                          {user.contactNo}
                        </td>
                        <td className="td hidden xl:table-cell">
                          {user.address}
                        </td>
                        <th className="td">
                          <button
                            className="text-sm font-normal text-green-700 hover:cursor-pointer hover:font-bold"
                            onClick={() => openModal(user._id)}
                          >
                            View
                          </button>
                        </th>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(filteredData.length / itemsPerPage)}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          pageRangeDisplayed={1}
          marginPagesDisplayed={1}
        />
      </div>
      <Modal isOpen={modalOpen} closeModal={closeModal}>
        <div className="flex flex-col w-full  mx-auto gap-2 bg">
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-4">
            User Details
          </h2>
          <div className="space-y-3">
            <div className="min-w-full border border-gray-300 bg-white shadow-md">
              {[
                {
                  label: "Name",
                  value: `${clickedUser.firstName} ${clickedUser.lastName}`,
                },
                {
                  label: "Market Area",
                  value:
                    clickedUser?.nearestMarket?.market?.market || "Unknown",
                },
                { label: "Contact No", value: clickedUser.contactNo },
                { label: "Email", value: clickedUser.email },
                { label: "Address", value: clickedUser.address },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col border-b border-gray-300 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer"
                >
                  <div className="flex gap-2 w-full">
                    <span className="font-medium text-gray-900 w-1/3">
                      {item.label}
                    </span>
                    <span className="text-gray-700 break-words w-2/3 text-left overflow-x-hidden">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {clickedUser.preferredVeggies?.length === 0 && (
              <h1 className="px-6 py-4 text-center bg-orange-300 font-semibold rounded-md">
                No personalized vegetable list added yet
              </h1>
            )}
            {clickedUser.preferredVeggies?.length > 0 && (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="px-2 py-1 text-gray-700 font-semibold text-center border">
                      Vegetable
                    </th>
                    <th className="px-2 py-1 text-gray-700 font-semibold text-center border">
                      Qty/week
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clickedUser.preferredVeggies?.map((veg, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-200 hover:cursor-pointer"
                    >
                      <td className="px-2 py-1 text-gray-800 font-medium border">
                        {veg?.vegetable?.vegetableName || "Unknown"}
                      </td>
                      <td className="px-2 py-1 text-gray-600 font-medium border">
                        {veg.amount !== 1000
                          ? `${veg.amount} g`
                          : `${veg.amount / 1000} KG`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Users;
