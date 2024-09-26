import React, { useState, useEffect } from "react";
import { AiFillEye } from "react-icons/ai";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const API_KEY = "XM7ppCDYNosDjPupHKjbHjVw"; // Store your API key in an environment variable

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("https://dev.to/api/articles?username=pratyushnirwan", {
                    headers: {
                        "api-key": API_KEY, // Use the API key in the request headers
                    },
                });
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
    }, [API_KEY]);

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
                                    {/* Use fallback image if cover_image is not available */}
                                    <img className="blog-img" src={blog.cover_image || 'fallback_image_url.jpg'} alt="Blog cover" />
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
    );
};

export default Blogs;
