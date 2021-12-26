import React, {useState, useEffect} from 'react'
import '../assets/css/Home.css'
import Header from './Header'
import Nav from './Nav'
import {useNavigate} from 'react-router-dom'
import Featured from './Featured'

function Home() {
    const [featured, setFeatured] = useState([])
    const [news, setNews] = useState()
    const [fetching, setFetching] = useState(false)
    const [userData, setUserData] = useState({})

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_API_URL}/company/genNews/general`)
        .then(response => response.json())
        .then(data =>{
            setNews(data.data)
            setFetching(true)
        })

        let userId = JSON.parse(localStorage.getItem('userData'))

        fetch(`http://${process.env.REACT_APP_API_URL}/auth/getUserData/${userId.user.id}`)
        .then(response => response.json())
        .then(data => setUserData(data.user))

        setFeatured(['AAPL', 'TSLA', 'LILM'])
       
    }, [])

    console.log(news)
    console.log(userData)
    //NEWS


    if(fetching){
        var selectedNews = [news[0], news[15], news[50], news[30]];
        var showFeatured = featured.map(fea => <Featured company={fea} key={fea}/>)
    }
    
    let navigate = useNavigate()
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
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h1 className="title">Featured</h1>
                                        <div className="actions">
                                            <button className="view" onClick={e => {
                                                e.preventDefault();
                                                navigate("/featured")
                                            }}>View More</button>
                                        </div>
                                    </div>
                                    <div className="featured-items">
                                        {
                                            fetching &&
                                            showFeatured
                                        }
                                    </div>
                                </div>
                            </div>
                           
                            <div className="col-lg-6 no-padding">
                                <div className="watchList">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h1 className="title">WatchList</h1>
                                        <div className="actions">
                                            <button className="view" onClick={e => {
                                                e.preventDefault();
                                                navigate("/watchList")
                                            }}>View</button>
                                        </div>
                                        
                                    </div>
                                    <div className="watching">
                                        {
                                            fetching && userData.watchList.length > 0 ?
                                            null
                                            :
                                            <div className="d-flex align-items-center justify-content-center">
                                                <h1>NOTHING IN WATCHLIST</h1>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="blank"></div>
                                <div className="news">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h1 className="title">News</h1>
                                        <div className="actions">
                                            <button className="view" onClick={e => {
                                                e.preventDefault();
                                                navigate("/news")
                                            }}>Read More</button>
                                        </div>
                                    </div>
                                    <div className="newsContent-sm">
                                        {
                                            fetching &&
                                            selectedNews.map(news => {
                                                return(
                                                    <div className="news-content-sm" key={news.id}>
                                                        <p><strong>{news.source} - </strong> {news.headline}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
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