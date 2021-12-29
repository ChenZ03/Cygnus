import React, {useState, useEffect} from 'react'
import '../assets/css/watchList.css'
import Header from './Header'
import Nav from './Nav'
import {useNavigate} from 'react-router-dom'
import WatchListCom from './WatchListCom'

function Watchlist() {
    
    const [watchList, setWatchList] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        if(localStorage.hasOwnProperty('token')){
            let userId = JSON.parse(localStorage.getItem('userData'))
            userId = userId.user.id
            fetch(`${process.env.REACT_APP_API_URL}/data/watchList/${userId}`)
            .then(response => response.json())
            .then(data => setWatchList(data))
        }
       
    }, [])

    const onClickHandler = company => {
        navigate('/stock', {state : {company}})
    }

    if(watchList) {
        var showWatchList = watchList.map(watch => <WatchListCom company={watch} onClick={onClickHandler} key={watch} /> )
    }
    return(
        <div>
            {localStorage.hasOwnProperty('token') ?
                <div className="Home">
                    {<Header />}
                    {<Nav />}
                    {
                        watchList &&

                        watchList.length > 0 ?
                        showWatchList
                        : 
                        <h1 className="text-center">Watchlist is Empty</h1>
                    }
                </div>
                :
                <div className="loginPlease d-flex align-items-center justify-content-center">
                    <h2 className="text-center">Please Proceed to Login Page</h2>
                </div>
            }
        </div>
    )
}
 
export default Watchlist