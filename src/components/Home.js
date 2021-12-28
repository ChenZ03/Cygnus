import React, {useState, useEffect} from 'react'
import '../assets/css/Home.css'
import Header from './Header'
import Nav from './Nav'
import {useNavigate} from 'react-router-dom'
import Featured from './Featured'
import Swal from 'sweetalert2'

function Home() {
    const [featured, setFeatured] = useState([])
    const [news, setNews] = useState()
    const [fetching, setFetching] = useState(false)
    const [userData, setUserData] = useState({})
    const [editFeatured, setEditFeatured] = useState(false)

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


        fetch(`http://${process.env.REACT_APP_API_URL}/data/featured`)
        .then(response => response.json())
        .then(data => {
           let feature = []
           for(let i of data.feature){
               feature.push(i)
           }
           setFeatured(feature)
          
        })
       
    }, [])

    const refreshFeature = () => {
        setEditFeatured(false)

        fetch(`http://${process.env.REACT_APP_API_URL}/data/featured`)
        .then(response => response.json())
        .then(data => {
           let feature = []
           for(let i of data.feature){
               feature.push(i)
           }
           setFeatured(feature)
          
        })
    }

    //NEWS


    if(fetching){
        var selectedNews = [news[0], news[15], news[50], news[30]];
        var showFeatured = featured.map(fea => {
            return <Featured company={fea} key={fea.code} editing={editFeatured} setE={refreshFeature}/>
        })
    }

    const search = e =>{
        e.preventDefault();
        let searchTerm = document.getElementById('search').value
        if(searchTerm.length < 1) {
            Swal.fire("Please enter at least one character")
        }else{
            navigate('/search',  {state : {term : searchTerm}})
        }
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
                                        {
                                                  userData.isAdmin &&
                                                  <button onClick={e => {
                                                        e.preventDefault();
                                                        setEditFeatured(!editFeatured)
                                                  }}>{editFeatured ? "Cancel" : "Edit"}</button>
                                              }
                                        <div className="actions">
                                          
                                          <div>
                                             
                                              <input type="text" className="search" placeholder="Search for stocks" id="search"/>
                                              <button onClick={search}>Search</button>
                                          </div>
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