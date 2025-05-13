import React, { useEffect, useState } from 'react';

export default function BlogTree() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://dev.to/api/articles?username=pratyushnirwan')
            .then((res) => res.json())
            .then((data) => {
                setBlogs(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching blogs:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading blogs...</p>;

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
