import { useEffect, useState } from "react";
import { adminLinks } from "../../assets/navLinks.mjs";
import Navbar from "../../components/Navbar";
import axios from "axios";
import Loader from "../../components/Loader";
import ReactPaginate from "react-paginate";
const itemsPerPage = 7;

const Users = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

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
      user.nearestMarket.toLowerCase().includes(searchText.toLowerCase()) ||
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
          <div className="hidden lg:block overflow-x-auto">
            {filteredData.length == 0 ? (
              <p className="text-center text-gray-500 py-4">
                No data available.
              </p>
            ) : (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-400">
                    <th className="td">Name</th>
                    <th className="td">Market Area</th>
                    <th className="td">Email</th>
                    <th className="td">Contact No</th>
                    <th className="td">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageItems.map((user, index) => {
                    return (
                      <tr
                        className="border-t hover:bg-gray-200 hover:cursor-pointer"
                        key={index}
                      >
                        <td className="td">{`${user.firstName} ${user.lastName}`}</td>
                        <td className="td">{user.nearestMarket}</td>
                        <td className="td">{user.email}</td>
                        <td className="td">{user.contactNo}</td>
                        <td className="td">{user.address}</td>
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
    </>
  );
};

export default Users;
