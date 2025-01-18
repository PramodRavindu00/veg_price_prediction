import { useEffect, useState } from "react";
import { adminLinks } from "../../assets/navLinks.mjs";
import Navbar from "../../components/Navbar";
import axios from "axios";
import Loader from "../../components/Loader";
import ReactPaginate from "react-paginate";
import Modal from "../../components/Modal";
import { toast, Toaster } from "sonner";

const itemsPerPage = 7;
const initialValues = {
  reply: "",
  emailToSend: "",
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
  const [formError, setFormError] = useState("");
  const [charCount, setCharCount] = useState(400);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

 
    const getQueries = async () => {
      try {
        const res = await axios.get("/api/query/viewQueries");
        const allQueries = res.data.data.map((query) => ({
          ...query,
          date: new Date(query?.date).toLocaleDateString("en-CA"),
          replyDate: new Date(query?.replyDate).toLocaleDateString("en-CA"),
        }));
        setQueries(allQueries);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
  };
   useEffect(() => {
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
    setFormValues((prev) => ({ ...prev, emailToSend: query.email }));
  };
  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setClickedQuery({}), 100);
    setFormValues(initialValues);
    setFormError("");
    setCharCount(400);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length <= 400) {
      setFormValues({ ...formValues, [name]: value });
      setCharCount(400 - value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.reply) {
      setFormError("Reply is required!");
      console.log("Form has validation errors");
    } else {
      setBtnDisabled(true);
      try {
        const { data } = await axios.patch(
          `/api/query/replyToQuery/${clickedQuery._id}`,
          formValues
        );
        
        closeModal();
        setBtnDisabled(false);

        if (data.success) toast.success("Reply Submitted Successfully");
        getQueries()
      } catch (error) {
        toast.error("Internal Server Error");
      }
    }
  };

  return (
    <>
      <Navbar publicPage={false} navLinks={adminLinks} />

      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col p-5 gap-5">
          <div className="flex justify-end ">
            <div className="w-4/5 md:w-1/2 lg:w-1/4">
              <input
                type="text"
                placeholder="Search Queries...."
                className="form-input"
                name="query"
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(0);
                }}
              />
            </div>
          </div>
          <div className="overflow-x-auto rounded-md">
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
                        className={`border-t ${
                          query?.reply ? "bg-green-200" : "bg-red-200"
                        } hover:cursor-pointer hover:bg-blue-200`}
                        key={index}
                        onClick={() => openModal(query._id)}
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
      )}

      <Modal isOpen={modalOpen} closeModal={closeModal}>
        <div className="w-full">
          <div className="flex flex-col gap-1 border-b pb-4 mb-4">
            <p className="text-sm text-gray-600">
              <strong>From:</strong>{" "}
              {`${clickedQuery.firstName} ${clickedQuery.lastName}`}
            </p>
            <p className="text-sm text-blue-600 break-words whitespace-normal">
              {clickedQuery.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Contact No:</strong> {clickedQuery.contactNo}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Date:</strong> {clickedQuery.date}
            </p>
          </div>
          <div className="mb-4 pb-4 border-b">
            <h3 className="text-sm font-bold text-gray-600">Message</h3>
            <p className="mt-1 text-black text-sm">{clickedQuery.message}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-600">Reply</h3>
            {clickedQuery?.reply ? (
              <>
                <p className="text-black text-sm mt-1">{clickedQuery.reply}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Replied on:</strong> {clickedQuery.replyDate}
                </p>
              </>
            ) : (
              <form
                className="flex flex-col gap-4 mt-1"
                onSubmit={handleSubmit}
              >
                <div className="w-full">
                  <textarea
                    className="form-input"
                    name="reply"
                    value={formValues.reply}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Write your reply here..."
                  />
                  <span className="form-error">{formError}</span>
                  <div className="text-xs text-gray-500">
                    {charCount} characters remaining
                  </div>
                </div>
                <button
                  type="submit"
                  className="self-end bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
                  disabled={btnDisabled}
                >
                  {btnDisabled ? "Please Wait..." : "Send Reply"}
                </button>
              </form>
            )}
          </div>
        </div>
      </Modal>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default Queries;
