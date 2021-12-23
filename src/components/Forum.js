import React from 'react';
import Header from './Header'
import Nav from './Nav'
import '../assets/css/Forum.css'

function Forum(){
    return (
        <>
        {
            localStorage.getItem('userData') && 
            <div className="forum">
                {<Header />}
                {<Nav />}
            </div>
        }
        </>
    )
}

export default Forum;