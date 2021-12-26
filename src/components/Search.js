import {useLocation, useNavigate} from 'react-router-dom'
import React, {useState, useEffect} from 'react'
import Header from './Header'
import Nav from './Nav'
import '../assets/css/Search.css'

function Search() {
    return(
        <>
        {
            localStorage.hasOwnProperty('userData') &&
            <div className="searchPage">
                {<Header />}
                {<Nav />}
            </div>
        }
        </>
    )
}

export default Search