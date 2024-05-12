import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { getContacts } from "./api/ContactService";
import Header from "./components/Header";
import ContactList from "./components/ContactList";
import Contact from "./components/Contact";

function App() {
  const modalRef = useRef();
  const fileRef = useRef();
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState(undefined);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    status: "",
  });

  const getAllContacts = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    console.log(formValues);
  };

  const handleNewContact = async (event) => {
    event.preventDefault();
  };

  const toggleModal = (show) =>
    show ? modalRef.current.showModal() : modalRef.current.close();

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <>
      <Router>
        <Header toggleModal={toggleModal} nbOfContacts={data.totalElements} />
        <main className="main">
          <div className="container">
            <Routes>
              <Route path="/" element={<Navigate to={"/contacts"} />} />
              <Route
                path="/contacts"
                element={
                  <ContactList
                    data={data}
                    currentPage={currentPage}
                    getAllContacts={getAllContacts}
                  />
                }
              />
            </Routes>
          </div>
        </main>
        {/* Modal */}
        <dialog ref={modalRef} className="modal" id="modal">
          <div className="modal__header">
            <h3>New Contact</h3>
            <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
          </div>
          <div className="divider"></div>
          <div className="modal__body">
            <form onSubmit={handleNewContact}>
              <div className="user-details">
                <div className="input-box">
                  <span className="details">Name</span>
                  <input
                    type="text"
                    value={formValues.name}
                    onChange={onChange}
                    name="name"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Email</span>
                  <input
                    type="text"
                    value={formValues.email}
                    onChange={onChange}
                    name="email"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Title</span>
                  <input
                    type="text"
                    value={formValues.title}
                    onChange={onChange}
                    name="title"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Phone Nummer</span>
                  <input
                    type="text"
                    value={formValues.phone}
                    onChange={onChange}
                    name="phone"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Address</span>
                  <input
                    type="text"
                    value={formValues.address}
                    onChange={onChange}
                    name="address"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Account Status</span>
                  <input
                    type="text"
                    value={formValues.status}
                    onChange={onChange}
                    name="status"
                    required
                  />
                </div>
                <div className="file-input">
                  <span className="details">Profile Photo</span>
                  <input
                    type="file"
                    value={formValues.photo}
                    onChange={(e) => setFile(e.target.files[0])}
                    ref={fileRef}
                    name="photo"
                    required
                  />
                </div>
              </div>
              <div className="form_footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => toggleModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </Router>
    </>
  );
}

export default App;
