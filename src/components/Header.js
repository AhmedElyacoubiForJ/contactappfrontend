import React from 'react'

const Header = ({toogleModal, nbOfContacts}) => {
  return (
    <Header className='header'>
        <div className='container'>
            <h3>Contact List ({nbOfContacts})</h3>
            <button onClick={() => toogleModal(true)} className='btn'>
                <i className='bi bi-plus-quare'></i>Add New Contact
            </button>
        </div>
    </Header>
  )
}

export default Header
