import React from 'react'
import '../assets/css/Header.css'
import L1 from '../assets/image/L1.png'

function Header() {
    const user = JSON.parse(localStorage.getItem('userData')).user
    return (
        <div className="d-flex align-items-center justify-content-between">
            <div className="Logo d-flex align-items-center">
                <img src={L1} alt="Logo" />
                <h1>CYGNUS</h1>
            </div>
            <div className="User d-flex align-items-center">
                <h1>{user.username}</h1>
            </div>
        </div>
    )
}

export default Header