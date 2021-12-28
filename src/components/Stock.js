import React, {useState, useEffect} from 'react';
import Header from './Header'
import Nav from './Nav'
import {useLocation} from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js'
import '../assets/css/Stock.css'


function Stock() {
    const location = useLocation()
    const company = location.state.company
    const [hasData, setHasData] = useState(true)
    const [loading, setLoading] = useState(true)
    const [interval, setInterval] = useState('Daily')
    const [companyData, setCompanyData] = useState({}) // Finn
    const [companyData2, setCompanyData2] = useState({}) // Alpha
    const [companyNews, setCompanyNews] = useState([]) // Finn
    const [trends, setTrends] = useState([]) // Finn
    const [earnings, setEarnings] = useState(null) // Alpha 
    const [reddit, setReddit] = useState([]) // Finn
    const [twitter, setTwitter] = useState([]) // Finn
    const [insiderTrans, setInsiderTrans] = useState() // Finn
    const [quote, setQuote] = useState({}) // Finn

    //Chart data
    const [stockChart, setStockChart] = useState(null) // Alpha
    const [stockChartData, setStockChartData] = useState(null)
    const [chartLoading, setChartLoading] = useState(true)
    const [redditChart, setRedditChart] = useState(null)
    const [twitterChart, setTwitterChart] = useState(null)
    const [trendsChart, setTrendsChart] = useState(null)

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_API_URL}/company/companyData/${company}`)
        .then(response => response.json())
        .then(async (data) => {
            if(data.data.hasOwnProperty('name')){
                setCompanyData(data.data)
                await fetch(`http://${process.env.REACT_APP_API_URL}/company/companyNews/${company}`)
                .then(response => response.json())
                .then(data => setCompanyNews(data.data))

                await fetch(`http://${process.env.REACT_APP_API_URL}/company/trends/${company}`)
                .then(response => response.json())
                .then(data => {
                    let arr = []
                    data.data.map(e => {
                        let date = new Date(e.period).getYear()
                        if(date === 121){
                            arr.push(e)
                        }
                        return e
                    })
                    setTrends(arr)
                })

                await fetch(`http://${process.env.REACT_APP_API_URL}/company/social/${company}`)
                .then(response => response.json())
                .then(data => {
                    setReddit(data.data.reddit)
                    setTwitter(data.data.twitter)
                   
                })

                await fetch(`http://${process.env.REACT_APP_API_URL}/company/insider/${company}`)
                .then(response => response.json())
                .then(data => {
                    setInsiderTrans(data.data.data)
                })

                await fetch(`http://${process.env.REACT_APP_API_URL}/company/companyData2/${company}`)
                .then(response => response.json())
                .then(data => setCompanyData2(data.data))

                await fetch(`http://${process.env.REACT_APP_API_URL}/company/quote/${company}`)
                .then(response => response.json())
                .then(data => setQuote(data.data))

                await fetch(`http://${process.env.REACT_APP_API_URL}/company/earnings/${company}`)
                .then(response => response.json())
                .then(data => {
                    setEarnings(data.data.annualEarnings)
                })
               

               setLoading(false)
            }else{
                setHasData(false)
            }
        })


    }, [company])

    useEffect(() => {
        if(reddit && twitter){
            let redditLabels = reddit.map(r => r.atTime.split(' ')[0])
            let redditData = reddit.map(r => r.mention)
            setRedditChart({
                labels : redditLabels ,
                datasets: [{
                    label: 'mentions',
                    data: redditData,
                    borderWidth: 2,
                    backgroundColor : "rgba(244,0,7,0.2)",
                    borderColor : "rgba(244,0,7,0.5)"
                }]
            })

            let twitterLabels = twitter.map(r => r.atTime.split(' ')[0])
            let twitterData = twitter.map(r => r.mention)
            setTwitterChart({
                labels : twitterLabels ,
                datasets: [{
                    label: 'mentions',
                    data: twitterData,
                    borderWidth: 2,
                    backgroundColor: "rgba(54,162,235,0.3)",
                    borderColor: "rgb(54,162,235)"
                }]
            })
        }

    }, [reddit, twitter])

    useEffect(() => {
        if(trends){
            let trendsLabel = []
            let trendsBuy = []
            let trendsHold = []
            let trendsSell = []
            let trendStrongBuy = []
            let trendStrongSell = []

            trends.map(t => {
                trendsLabel.push(t.period)
                trendsBuy.push(t.buy)
                trendsHold.push(t.hold)
                trendsSell.push(t.sell)
                trendStrongBuy.push(t.strongBuy)
                trendStrongSell.push(t.strongSell)
                return t
            })

            const arbitraryStackKey = "stack1";

            setTrendsChart({
                labels : trendsLabel,
                datasets : [
                    {
                        stack: arbitraryStackKey,
                        label : "Hold",
                        data : trendsHold,
                        backgroundColor :"rgb(189,183,107)",
                        borderWidth : 1
                    },
                    {
                        stack: arbitraryStackKey,
                       label : "Buy",
                       data : trendsBuy,
                       backgroundColor : "rgb(60,179,113)",
                       borderWidth : 1
                    },
                    {
                        stack: arbitraryStackKey,
                        label : "StrongBuy",
                        data : trendStrongBuy,
                        backgroundColor : 'rgb(0,128,0)',
                        borderWidth : 1
                     },
                   
                    {
                        stack: arbitraryStackKey,
                        label : "Sell",
                        data : trendsSell,
                        backgroundColor : 'rgb(220,20,60)',
                        borderWidth : 1
                     },
                    
                     {
                        stack: arbitraryStackKey,
                        label : "StrongSell",
                        data : trendStrongSell,
                        backgroundColor : 'rgb(255,0,0)',
                        borderWidth : 1
                     },
                ]
            })

           
        }
    }, [trends])

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_API_URL}/chart/${interval}/${company}`)
        .then(response => response.json())
        .then(data => {
           let keys = Object.keys(data.data)
           setStockChartData(data.data[keys[1]])
        })
    }, [interval, company])

    useEffect(() => {
        let labels = []
        let data = []
        if(stockChartData){
            for(let keys in stockChartData){
                labels.push(keys)
                let inner = Object.keys(stockChartData[keys])
                data.push(stockChartData[keys][inner[3]])
            }
            let half = Math.ceil(labels.length / 4)
            
            labels = labels.splice(0, half).reverse()
            data = data.splice(0, half).reverse()
            if(labels.length > 20 && data.length > 20){
                labels.splice(0,20)
                data.splice(0,20)
            }

            setStockChart({
                labels : labels,
                datasets : [
                    {
                        label : 'Close',
                        data : data,
                        fill : false,
                        backgroundColor : 'rgba(231,134,125,1)',
                        borderColor : "rgb(231,134,125,0.8)",
                        color : "rgba(255,255,255,0.8)"
                    }
                ]
            })

            setChartLoading(false)


        }
    }, [stockChartData])

    if(!loading) {

        var generalData = Object.keys(companyData2).map((ele, index) => {
            if(index > 14){
                return(
                    <tr key={ele}>
                        <td>{ele}</td>
                        <td>{companyData2[ele]}</td>
                    </tr>
                )
            }
            return(
                <></>
            )
        })

        var news = []

        if(companyNews.length > 3){
            for(let i = 0; i < 3 ; i ++){
                news.push(companyNews[i])
            }
    
            var showNews = news.map(e => {
                return(
                    <div className="row" key={e.id}>
                        <div className="col-4">
                            <img src={e.image} alt={e} className="img-fluid news-img"/>
                        </div>
                        <div className="col-8">
                            <h2 className="news-headline">{e.headline}</h2>
                            <p className="news-summary">{e.summary}</p>
                            <a className="news-link" href={e.url} target="_blank" rel="noreferrer">Read Details</a>
                        </div>
                    </div>
                )
            })
        }

        if(insiderTrans.length > 0){
            var showInsiders = insiderTrans.map(trans => {
                return(
                    <div className="insiderElement d-flex justify-content-between px-4 py-2" key={Math.random().toString(16).slice(2)}>
                        <h3>{trans.name}</h3>
                        <ul className="insidersul">
                            <li><h4>Share : {trans.share}</h4></li>
                            <li><h4>Change : {trans.change}</h4></li>
                            <li><h4>Price : {trans.transactionPrice} USD</h4></li>
                        </ul>
                    </div>
                )
            })
        }
        if(earnings){
            if(earnings.length > 0) {
                var showEarnings = earnings.map(ear => {
                    return(
                        <div className="insiderElement d-flex justify-content-between px-4 py-2" key={Math.random().toString(16).slice(2)}>
                            <h3>{ear.fiscalDateEnding}</h3>
                            <h3 className={ear.reportedEPS< 0 ? "lose" : "win"}>{ear.reportedEPS}</h3>
                        </div>
                    )
                })
            }
    
        }
       
        let time = ['Hour', 'Daily', 'Weekly', 'Monthly']

        var showTime = time.map(t => {
            var hour = t
            var int = t
            if(t === 'Hour'){
                hour = "oneHour"
                int = "oneHour"
            }
            return (
                <p className={interval === hour ? "curr" : "next"} key={t} onClick={e => {
                    e.preventDefault();
                    setInterval(int)
                }}>{t}</p>
            )
        })


    }


    return(
        <>
        {
            localStorage.hasOwnProperty('userData') &&
            <div className="stock">
                {<Header />}
                {<Nav />}
                {
                    (!loading && hasData) &&
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-center py-5">
                            <a className="companyLink" rel="noreferrer" target="_blank" href={companyData.weburl}><h1>{companyData.name} - {companyData.ticker}</h1></a>
                            <button className="view">Add to watchList</button>
                        </div>
                        <div className="description d-flex">
                            <div className="row py-3">
                                <div className="col-xl-6 py-4">
                                    <p className="text-left">{companyData2.Description}</p>
                                </div>
                                <div className="col-xl-6 px-5 py-4">
                                    <ul>
                                        <li><h5>CURRENCY - {companyData2.Currency}</h5></li>
                                        <li><h5>COUNTRY - {companyData2.Country}</h5></li>
                                        <li><h5>ADDRESS - {companyData2.Address}</h5></li>
                                        <li><h5>SECTOR - {companyData2.Sector}</h5></li>
                                        <li><h5>INDUSTRY - {companyData2.Industry}</h5></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="latest">
                            <div className="row py-5">
                                <div className="col-xl-4 d-flex align-items-center justify-content-center">
                                    <h1>Latest Quote :</h1>
                                </div>
                                <div className="col-xl-8 d-flex align-items-center justify-content-center">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>OPEN</th>
                                                <th>HIGH</th>
                                                <th>LOW</th>
                                                <th>CURRENT</th>
                                                <th>PREVIOUS CLOSE</th>
                                                <th>CHANGE</th>
                                                <th>PERCENT CHANGE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{quote.o}</td>
                                                <td>{quote.h}</td>
                                                <td>{quote.l}</td>
                                                <td>{quote.c}</td>
                                                <td>{quote.pc}</td>
                                                <td>{quote.d}</td>
                                                <td className={quote.d < 0 ? "lose" : "win"}>{quote.dp}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="generalData py-5">
                            <div className="row">
                                <div className="col-12 d-flex align-items-center justify-content-center py-3">
                                    <h1>General Data :</h1>
                                </div>
                                <div className="col-12 d-flex align-items-center justify-content-center">
                                     <table>
                                        <tbody>
                                            {generalData}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <br />
                        <h1 className="text-center"> Analytics : </h1>
                        {
                            (!chartLoading && stockChart) &&
                            <div className="chart py-5">
                                <div className="d-flex justify-content-center align-items-center">
                                    {showTime}
                                </div>
                                <Line data = {stockChart} 
                                options ={{
                                    scales: {
                                        xAxes: [{
                                            ticks: {
                                                autoSkip: false,
                                                maxRotation: 90,
                                                minRotation: 90,
                                            }
                                        }]
                                    },
                                    elements: {
                                        line: {
                                                fill: false
                                        }
                                    }
                                }}
                                />
                            </div>
                        }
                        <div className="trends py-5">
                            {
                                trendsChart &&
                                <div className="trends py-5 mb-5">
                                    <div className="row earnings-logo">
                                        <div className="col-12 d-flex align-items-center justify-content-left">
                                            <i className="fas fa-poll"></i>
                                            <h1>Recommended Trends</h1>
                                        </div>
                                    </div>
                                    <Bar 
                                    data = {trendsChart}
                                    />
                                </div>
                            }
                        </div>
                        <div className="insiders py-5">
                            <div className="row insiders-logo">
                                <div className="col-12 d-flex align-items-center justify-content-left">
                                    <i className="fas fa-mask"></i>
                                    <h1>INSIDERS TRADES</h1>
                                </div>
                            </div>
                            <div className="insidersBox py-5">
                                {
                                    insiderTrans.length > 0 ?
                                    showInsiders
                                    :
                                    <h1>NO INSIDERS TRANSACTIONS</h1>
                                }
                            </div>
                        </div>
                        <div className="earnings py-5 mt-5 mb-5">
                            <div className="row earnings-logo">
                                <div className="col-12 d-flex align-items-center justify-content-left">
                                    <i className="fas fa-coins"></i>
                                    <h1>EARNINGS</h1>
                                </div>
                            </div>
                            <div className="earningsBox py-5">
                                {
                                   earnings && earnings.length > 0 ?
                                    showEarnings
                                    :
                                    <h1>NO EARNING DATA</h1>
                                }
                            </div>
                            
                        </div>
                        <div className="social py-5">
                            {
                                redditChart &&
                                <div className="reddit py-5 mb-5">
                                    <div className="row earnings-logo">
                                        <div className="col-12 d-flex align-items-center justify-content-left">
                                            <i className="fab fa-reddit"></i>
                                            <h1>Reddit Mentions</h1>
                                        </div>
                                    </div>
                                    <Bar 
                                    data = {redditChart}
                                    />
                                </div>
                            }

                            {
                                twitterChart &&
                                <div className="reddit py-5 mb-5">
                                    <div className="row earnings-logo">
                                        <div className="col-12 d-flex align-items-center justify-content-left">
                                            <i className="fab fa-twitter"></i>
                                            <h1>Twitter Mentions</h1>
                                        </div>
                                    </div>
                                    <Bar 
                                    data ={twitterChart}
                                    />
                                </div>
                            }

                            
                        </div>
                        {
                            companyNews.length > 3 &&
                            <div className="comNews">
                                <h1 className="text-center py-4">NEWS :</h1>
                                {showNews}
                            </div>
                        }
                    </div>
                }

                {
                    !hasData &&
                    
                    <h1 className="text-center py-5">NO DATA AVAILABLE FOR THIS STOCK</h1>
 
                }
            </div>  
        }
        </>
    )
}

export default Stock