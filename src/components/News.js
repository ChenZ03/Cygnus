import React, {useState, useEffect} from 'react';
import Header from './Header'
import Nav from './Nav'
import '../assets/css/News.css'

function News() {
    const [page, setPage] = useState(1)
    const [category, setCategory] = useState('general')
    const [news, setNews] = useState([])
    const [curr, setCurr] = useState([0,1,2])
    const [fetching, setFetching] = useState(false)

    let pages = [1,2,3,4,5,6,7,8,9,10]

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_API_URL}/company/genNews/${category}`)
        .then(response => response.json())
        .then(data => {
            setNews(data.data)
            console.log(data)
            setFetching(true)
            
        })

       
    }, [category])


    useEffect(() => {
        let num = (page - 1) * 6
        setCurr([num, num + 1, num + 2])
    }, [page])

    console.log(curr)

    let showPageNum = pages.map(pagein => {
        return (
            <p className={page === pagein ? 'curr' : 'next'} key={pagein} onClick={e => {
                e.preventDefault()
                setPage(pagein)
            }}>{pagein}</p>
        )
    })


    
    console.log(page)

    return(
        <div>
            {
                localStorage.hasOwnProperty('userData') &&
                <div className="News">
                    {<Header />}
                    {<Nav />}
                    <div className="news-content">
                        <div className="d-flex align-items-center justify-content-center">
                            {showPageNum}
                        </div>
                        {
                            fetching &&
                                curr.map(n => {
                                    return (
                                        <div className="row d-flex justify-content-center news-row" key={n}>
                                            <div className="col-lg-5 col-md-12 news-col">
                                                <div className="row news-content-row">
                                                    <div className="col-4 news-content-col">
                                                        <img src={news[n].image} alt="news" className="img-fluid news-img"/>
                                                    </div>
                                                    <div className="col-8 news-content-col">
                                                        <h6 className="news-headline">{news[n].headline}</h6>
                                                        <p className="news-summary">{news[n].summary}</p>
                                                        <a className="news-link" href={news[n].url} target="_blank" rel="noreferrer">Read Details</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-1"></div>
                                            <div className="col-lg-5 col-md-12 news-col">
                                                <div className="row news-content-row">
                                                    <div className="col-4 news-content-col">
                                                        <img src={news[n+3].image} alt="news" className="img-fluid news-img"/>
                                                    </div>
                                                    <div className="col-8 news-content-col">
                                                        <h6 className="news-headline">{news[n+3].headline}</h6>
                                                        <p className="news-summary">{news[n+3].summary}</p>
                                                        <a className="news-link" href={news[n+3].url} target="_blank" rel="noreferrer">Read Details</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> 
                                    )
                            })
                        }
                        <div className="category d-flex justify-content-center align-items-center">
                            <p className={category === 'general' ? 'active-link' : 'catLink'} onClick={e => {
                                e.preventDefault();
                                setCategory('general')
                            }}>GENERAL</p>
                            <p className={category === 'crypto' ? 'active-link' : 'catLink'} onClick={e => {
                                e.preventDefault();
                                setCategory('crypto')
                            }}>CRYPTO</p>
                            <p className={category === 'forex' ? 'active-link' : 'catLink'} onClick={e => {
                                e.preventDefault();
                                setCategory('forex')
                            }}>FOREX</p>
                            <p className={category === 'merger' ? 'active-link' : 'catLink'} onClick={e => {
                                e.preventDefault();
                                setCategory('merger')
                            }}>MERGER</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default News