import React, {useState, useEffect} from 'react';
import Header from './Header'
import Nav from './Nav'
import '../assets/css/Forum.css'
import Swal from 'sweetalert2'

function Forum(){
    const [page, setPage] = useState('forum')
    const [forum, setForum] = useState(null)
    const [userData, setUserData] = useState(null)
    const [add, setAdd] = useState(false)
    
    useEffect(() => {

        if(localStorage.hasOwnProperty('token')){
            let userId = JSON.parse(localStorage.getItem('userData'))

            fetch(`${process.env.REACT_APP_API_URL}/auth/getUserData/${userId.user.id}`)
            .then(response => response.json())
            .then(data => setUserData(data.user))
    
            getPost()
        }

      

    }, [page])


    const getPost = () =>{
        setForum(null)
        if(page === 'forum'){
            fetch(`${process.env.REACT_APP_API_URL}/forum/post`)
            .then(response => response.json())
            .then(data => {
                fetch(`${process.env.REACT_APP_API_URL}/forum/comments`)
                .then(response2 => response2.json())
                .then(data2 => {
                   let arr = []
                    for(let i of data.post){
                        let comments = []
                        for(let x of data2){
                            if(x.postId === i._id){
                                comments.push(x)
                            }
                        }
                        arr.push([i, comments])
                    }
                    setForum(arr)
                })
              
            })
        }else{
            fetch(`${process.env.REACT_APP_API_URL}/forum/approve`)
            .then(response => response.json())
            .then(data => {
                let arr = []
                let comments = []
                for(let i of data.post){
                    arr.push([i, comments])
                }
                setForum(arr)
            })
        }
    }
    
    let pages = ['forum', 'approve']

    let showPage = pages.map(pagein => {
        return (
            <h1 className={page === pagein ? 'curr' : 'next'} key={pagein} onClick={e => {
                e.preventDefault()
                setAdd(false)
                setPage(pagein)
            }}>{pagein.toUpperCase()}</h1>
        )
    })

    const onApprove = id => {
        fetch(`${process.env.REACT_APP_API_URL}/forum/approve`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id})
        })
        .then(response => response.json())
        .then(data => {
            if(data.msg === "success"){
                Swal.fire({
                    icon : "success",
                    title : "Post Approved"
                })
            }else{
                Swal.fire({
                    icon : "error",
                    title : "Error"
                })
            }
            getPost()
        })
    }

    const onDelete = id => {
        fetch(`${process.env.REACT_APP_API_URL}/forum/post/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                icon : "success",
                title : "Delete Successfully"
            })
            getPost()
        })
    }

    const upvote = (id, vote) => {
        fetch(`${process.env.REACT_APP_API_URL}/forum/post`, {
            method : "PUT",
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify({id, vote})
        })
        .then(response => response.json())
        .then(data => getPost())
    }

    const addComment = (id, e) => {
        let comment = e.target.previousElementSibling.value
        if(comment.length < 1){
            Swal.fire({
                icon : "error",
                title : "Please enter at least one character for your comment"
            })
        }else{
            fetch(`${process.env.REACT_APP_API_URL}/forum/comments`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body : JSON.stringify({postId : id, comment, author : userData.username})
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                Swal.fire({
                    icon : "success",
                    title : "Comment Added Successfully"
                })
                getPost()
            })
        }
        
    }

    if(forum){
        var showForum = forum.map(f => {
            return (
                <div className="singlePost" key={f[0]._id}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="postDetails text-left">
                            <h2>{f[0].title}</h2>
                            <h6>{f[0].description}</h6>
                            <small>{f[0].author}</small>
                        </div>
                        <div className="upvote">
                            {
                                page === 'forum' ?
                                <>
                                    { 
                                        userData.isAdmin &&
                                        <button onClick={e => {
                                            e.preventDefault();
                                            onDelete(f[0]._id)
                                        }}>Delete Post</button>
                                    }
                                    <i className="fas fa-arrow-alt-circle-up" onClick={e => {
                                        e.preventDefault()
                                        upvote(f[0]._id, f[0].upvote)
                                    }}>{f[0].upvote}</i>
                                </>
                                :
                                <>
                                <button className="mx-5" onClick={e => {
                                    e.preventDefault();
                                    onApprove(f[0]._id)
                                }}>Approve</button>
                                <button onClick={e => {
                                    e.preventDefault();
                                    onDelete(f[0]._id)
                                }}>Delete</button>
                                </>
                            }
                        </div>
                    </div>
                    {
                        page === 'forum' &&
                        <>
                        <div className="comments">
                            {
                                f[1].length > 0 ?
                                f[1].map(com => {
                                    return(
                                        <div className="singleComment d-flex justify-content-between align-items-center py-2 px-5" key={com._id}>
                                            <h4>{com.comment}</h4>
                                            <small>{com.author}</small>
                                        </div>
                                    )
                                })
                                :
                                <h2 className="py-5">No Comments</h2>
                            }
                        </div>
                        <div className="d-flex w-100 align-items-center justify-content-center mt-5">
                            <input className="search" placeholder="Add a comment" id="comment"/>
                            <button className="view" onClick={e => {
                                e.preventDefault()
                                addComment(f[0]._id, e)
                            }}>Add</button>
                        </div>
                        </>
                    }
                </div>  
            )
        })
    }

    const addPost = e => {
        e.preventDefault()
        let title = document.getElementById('title').value
        let desc = document.getElementById('desc').value
        if(title.length < 1 || desc.length < 1){
            Swal.fire({
                icon : "error",
                title : "Please check your inputs"
            })
        }else{
            fetch(`${process.env.REACT_APP_API_URL}/forum/post`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({title, desc, author : userData.username})
            })
            .then(response => response.json())
            .then(data => {
                if(data.msg === 'Success'){
                    Swal.fire({
                        icon : "success",
                        title : "Post added successfully"
                    })
                    getPost()
                }
                else{
                    Swal.fire({
                        icon : "error",
                        title : "Error"
                    })
                }
            })
        }
    }

    return (
        <>
        {
            localStorage.getItem('userData') ?
            <div className="forum"> 
                {<Header />}
                {<Nav />}
                {
                    (userData && userData.isAdmin) &&
                    <div className="d-flex align-items-center justify-content-center">
                      {showPage}
                    </div>
                }
                <div className="container d-flex align-items-center justify-content-center py-5">
                    <div className="w-100 text-center">
                    
                    {
                        add ? 
                        <div className="addPost w-100 text-center">
                            <div>
                            <h1>Add Post</h1>
                            <br />
                            <input type="text" id="title" className="search apTitle" placeholder="Enter your post title"  />
                            <input type="text" id="desc" className="search apTitle" placeholder="Enter your post description"  />
                            <br />
                            <button className="view mx-5 my-2" onClick={addPost}>Add</button>
                            <button className="view mx-5 my-2" onClick={e => {
                                e.preventDefault();
                                setAdd(false)
                            }}>Cancel</button>
                            </div>
                        </div>
                        :
                        <>
                        <button className="view" onClick={e => {
                            e.preventDefault()
                            setAdd(true)
                        }}>AddPost</button>
                        {showForum}
                        </>
                    }
                    </div>
                </div>
            </div>
            :
            <div className="loginPlease d-flex align-items-center justify-content-center">
                <h2 className="text-center">Please Proceed to Login Page</h2>
            </div>
        }
        </>
    )
}

export default Forum;