import React, { useEffect, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';

export default function BlogTree() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://dev.to/api/articles?username=pratyushnirwan')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch blogs');
                }
                return res.json();
            })
            .then((data) => {
                setBlogs(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching blogs:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <CgSpinner className="spinner" />
                <p>Loading blogs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                <p>Error loading blogs. Please try again later.</p>
                <button onClick={() => window.location.reload()} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="blog-display">
            {blogs.map((blog, i) => {
                const isLast = i === blogs.length - 1;
                const prefix = isLast ? '└─' : '├─';
                const childPrefix = isLast ? '   ' : '│  ';
                return (
                    <div key={blog.id} className="blog-block">
                        <div>
                            {prefix} <span className="blog-title project-blog-name">{blog.title}</span>
                        </div>
                        <div>
                            {childPrefix}<span className="features">├─ Date:{new Date(blog.published_at).toLocaleDateString()} </span>
                        </div>
                        <div>
                            {childPrefix}<span className="features">└─ </span><a href={blog.url} target="_blank" rel="noopener noreferrer">Read</a>
                        </div>
                        {!isLast && <div className="divider">│</div>}
                    </div>
                );
            })}
        </div>
    );
}
