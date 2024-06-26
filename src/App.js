import { useState, useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  getContacts,
  saveContact,
  udpateContact,
  udpatePhoto,
} from "./api/ContactService";
import Header from "./components/Header";
import ContactList from "./components/ContactList";
import ContactDetail from "./components/ContactDetail";
import { toastError } from "./api/ToastService";
import { ToastContainer } from "react-toastify";

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
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const onChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleNewContact = async (event) => {
    event.preventDefault();
    try {
      const { data } = await saveContact(formValues);
      const formData = new FormData();
      formData.append("file", file, data.name);
      formData.append("id", data.id);
      const { data: photoUrl } = await udpatePhoto(formData);
      toggleModal(false);
      setFile(undefined);
      fileRef.current.value = null;
      setFormValues({
        name: "",
        email: "",
        phone: "",
        address: "",
        title: "",
        status: "",
      });
      getAllContacts();
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const updateContact = async (contact) => {
    try {
      const { data } = await saveContact(contact);
      console.log(data);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const updateImage = async (formData) => {
    try {
      const { data: photoUrl } = await udpatePhoto(formData);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
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
              <Route
                path="/contacts/:id"
                element={
                  <ContactDetail
                    updateContact={updateContact}
                    updateImage={updateImage}
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
        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
