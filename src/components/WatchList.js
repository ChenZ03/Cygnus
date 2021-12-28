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
        let userId = JSON.parse(localStorage.getItem('userData'))
        userId = userId.user.id
        fetch(`http://${process.env.REACT_APP_API_URL}/data/watchList/${userId}`)
        .then(response => response.json())
        .then(data => setWatchList(data))
    }, [])

    const onClickHandler = company => {
        navigate('/stock', {state : {company}})
    }

    if(watchList) {
        var showWatchList = watchList.map(watch => <WatchListCom company={watch} onClick={onClickHandler} key={watch} /> )
    }
    return(
        <div>
            {localStorage.hasOwnProperty('token') && 
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
            }
        </div>
    )
}
 
export default Watchlist