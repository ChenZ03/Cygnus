import React, {useState, useEffect} from 'react'
import '../assets/css/Home.css'
import Header from './Header'
import Nav from './Nav'
import {useNavigate} from 'react-router-dom'

function Home() {
    const [featured, setFeatured] = useState([])
    const [news, setNews] = useState()

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_API_URL}/company/genNews/general`)
        .then(response => response.json())
        .then(data => setNews(data.data))
        
    }, [])

    console.log(news)
    //NEWS
    let selectedNews = [news[0], news[15], news[50], news[30]];

    let renderNews = selectedNews.map(news => {
        return(
            <div className="news-content-sm" key={news.id}>
                <p><strong>{news.source} - </strong> {news.headline}</p>
            </div>
        )
    })

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
                                           renderNews 
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