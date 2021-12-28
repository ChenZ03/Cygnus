import React from 'react'
import '../assets/css/Header.css'
import L1 from '../assets/image/L1.png'
import {useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2'

function Header() {
    const user = JSON.parse(localStorage.getItem('userData')).user

    const navigate = useNavigate()

    const logout = e => {
        e.preventDefault()
        Swal.fire({
            title: 'Are you sure to logout?',
            text: "Logout Now !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Log Out'
          }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token')
                localStorage.removeItem('userData')
              Swal.fire(
                'Logout',
                'Logout Successfully',
                'success'
              )
              navigate('/')
            }
          })
    }

    return (
        <div className="d-flex align-items-center justify-content-between">
            <div className="Logo d-flex align-items-center">
                <img src={L1} alt="Logo" />
                <h1>CYGNUS</h1>
            </div>
            <div className="User d-flex align-items-center" onClick={logout}>
                <h1>{user.username}</h1>
            </div>
        </div>
    )
}

export default Header