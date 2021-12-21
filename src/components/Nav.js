import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import '../assets/css/Nav.css'

function Nav() {
    const [page, setPage] = useState()

    useEffect(() => {
        setPage(window.location.pathname)
    }, [])

    return (
        <div className="nav d-flex align-items-center justify-content-center">
            <div className="nav-item">
                <Link to="/home" className={page === '/home' ? 'active' : 'link'}>HOME</Link>
                <Link to="/watchList" className={page === '/watchList' ? 'active' : 'link'}>WATCHLIST</Link>
                <Link to="/news" className={page === '/news' ? 'active' : 'link'}>NEWS</Link>
                <Link to="/forum" className={page === '/forum' ? 'active' : 'link'}>FORUM</Link>
            </div>
        </div>
    )
}

export default Nav