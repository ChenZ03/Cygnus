import React, {useState, useEffect} from 'react'
import '../assets/css/Home.css'
import Header from './Header'
import Nav from './Nav'

function Home() {
    
    return(
        <div>
            {localStorage.hasOwnProperty('token') && 
                <div className="Home">
                    {<Header />}
                    {<Nav />}
                    <div className="homeContent">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="featured">
                                    <h1 className="title">Featured</h1>
                                </div>
                            </div>
                           
                            <div className="col-lg-6 no-padding">
                                <div className="watchList">
                                    <h1 className="title">WatchList</h1>
                                </div>
                                <div className="blank"></div>
                                <div className="news">
                                    <h1 className="title">News</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
 
export default Home