import { useEffect, useState } from "react";
import { adminLinks } from "../../assets/navLinks.mjs";
import Navbar from "../../components/Navbar";
import axios from "axios";
import Loader from "../../components/Loader";
import ReactPaginate from "react-paginate";
import Modal from "../../components/Modal";

const itemsPerPage = 7;
const initialValues = {
  reply: "",
  replyDate: new Date().toISOString().slice(0, 10),
};

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [clickedQuery, setClickedQuery] = useState({});
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [charCount, setCharCount] = useState(400);

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  useEffect(() => {
    const getQueries = async () => {
      try {
        const res = await axios.get("/api/query/viewQueries");
        const allQueries = res.data.data.map((query) => ({
          ...query,
          date: new Date(query.date).toLocaleDateString("en-CA"),
          replyDate: new Date(query.replyDate).toLocaleDateString("en-CA"),
        }));
        setQueries(allQueries);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    getQueries();
  }, []);

  const filteredData = queries.filter((query) => {
    return (
      query.date.toLowerCase().includes(searchText.toLowerCase()) ||
      query.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      query.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      query.email.toLowerCase().includes(searchText.toLowerCase()) ||
      query.contactNo.includes(searchText)
    );
  });

  const currentPageItems = filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const openModal = (queryId) => {
    setModalOpen(true);
    const query = queries.find((query) => query._id === queryId);
    setClickedQuery(query);
  };
  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setClickedQuery({}), 100);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length <= 400) {
      setFormValues({ ...formValues, [name]: value });
      setCharCount(400 - value.length);
    }
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
          <div className="overflow-x-auto">
            {filteredData.length == 0 ? (
              <p className="text-center text-gray-500 py-4">
                No data available.
              </p>
            ) : (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-400">
                    <th className="td">Date</th>
                    <th className="td hidden md:table-cell">Name</th>
                    <th className="td hidden sm:table-cell">Email</th>
                    <th className="td hidden md:table-cell">Contact No</th>
                    <th className="td">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageItems.map((query, index) => {
                    return (
                      <tr
                        className="border-t hover:bg-gray-200 hover:cursor-pointer"
                        key={index}
                      >
                        <td className="td">{query.date}</td>
                        <td className="td hidden md:table-cell">{`${query.firstName} ${query.lastName}`}</td>
                        <td className="td hidden sm:table-cell">
                          {query.email}
                        </td>
                        <td className="td hidden md:table-cell">
                          {query.contactNo}
                        </td>
                        <td className="td">
                          <button
                            className="text-sm font-normal text-green-700 hover:cursor-pointer hover:font-bold"
                            onClick={() => openModal(query._id)}
                          >
                            View
                          </button>
                        </td>
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
                { label: "Date", value: clickedQuery.date },
                {
                  label: "Name",
                  value: `${clickedQuery.firstName} ${clickedQuery.lastName}`,
                },
                { label: "Contact No", value: clickedQuery.contactNo },
                { label: "Email", value: clickedQuery.email },
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
            <form className="flex flex-col gap-5">
              <div className="w-full">
                <label className="form-label">Message</label>
                <p className="text-justify text-sm">{clickedQuery.message}</p>
              </div>
              <div className="w-full">
                <label className="form-label">Reply</label>
                {clickedQuery?.reply ? (
                  <div className="flex flex-col gap-5">
                    <p className="text-justify text-sm">{clickedQuery.reply}</p>
                    <label className="form-label">Replied on : {clickedQuery?.replyDate}</label>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <textarea
                      className="form-input"
                      name="reply"
                      value={formValues.reply}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Type your Message Here...."
                    >
                      {formValues.message}
                    </textarea>
                    <div className="text-xs form-label">
                      {charCount} characters remaining
                    </div>
                    <span className="form-error">{formErrors.message}</span>
                    <div className="flex flex-col items-center my-4">
                      <button className="btn-primary">Submit Reply</button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Queries;
