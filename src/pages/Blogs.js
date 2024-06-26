import React, { useState, useEffect } from "react";
import { AiFillEye } from "react-icons/ai";

const Blogs = () => {

    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("https://dev.to/api/articles?username=pratyushnirwan");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setBlogs(data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };
        fetchBlogs();
    }, []);

    function href(url) {
        window.open(url, "_blank");
    }

    function shortenString(str) {
        if (str.length > 50) {
            return str.substring(0, 50) + "...";
        } else {
            return str;
        }
    }


    const [mostRecentBlog, ...otherBlogs] = blogs;
    return (
        <>
            <div className="page-title-div">
                <h1 className="title page-title">Blogs</h1>
                <hr />
            </div>
            <div className="page-info">
                <div className="info-text">
                    <div id="blogs-grid">
                        {blogs.map(blog => (
                            <div className="blog" key={blog.id} onClick={() => href(blog.url)}>
                                <div className="overflow">
                                    <AiFillEye className='eye' size={50} />
                                    <img className="blog-img" src={blog.cover_image}></img>
                                </div>
                                <div className="blog-text">
                                    <div className="blog-tag-list">
                                        {blog.tag_list.map(tag => (
                                            <p className="text blog-tag" key={tag}>{"#" + tag}</p>
                                        ))}
                                    </div>
                                    <h2 className="title blog-title">{blog.title}</h2>
                                    <p className="blog-desc text">{shortenString(blog.description)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Blogs;