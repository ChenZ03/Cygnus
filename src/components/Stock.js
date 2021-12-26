import React from 'react';
import Header from './Header'
import Nav from './Nav'
import {useLocation} from 'react-router-dom'
import '../assets/css/Stock.css'

function Stock() {
    const location = useLocation()
    console.log(location.state.company)
    return(
        <>
        {
            localStorage.hasOwnProperty('userData') &&
            <div className="stock">
                {<Header />}
                {<Nav />}
            </div>  
        }
        </>
    )
}

export default Stock