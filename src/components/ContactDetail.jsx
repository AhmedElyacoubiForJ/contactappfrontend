import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { getContact } from '../api/ContactService';


const ContactDetail = () => {
    const { id } = useParams();
    const [contact, setContact] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
        photoUrl: ''
    });

    const fetchContact = async (id) => {
        try {
            const {data} = await getContact(id);
            console.log(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchContact(id);
    }, [id])
  return (
    <div>
      ContactDetail
    </div>
  )
}

export default ContactDetail
