import React, { useState, useEffect } from 'react';
import './TaskThree.css';

// Функция запроса данных с API
const fetchData = async (search, signal) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?title_like=${search}`, { signal });
    return response.json();
};

// Кастомный хук для управления состоянием поиска и запросов
const usePosts = () => {
    const [search, setSearch] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!search) {
            setPosts([]);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const debounceTimeout = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await fetchData(search, signal);
                setPosts(data);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Fetch error:', error);
                }
            } finally {
                setLoading(false);
            }
        }, 500); // Debounce 500ms

        return () => {
            clearTimeout(debounceTimeout);
            controller.abort();
        };
    }, [search]);

    return { search, setSearch, posts, loading };
};

export default function TaskThree() {
    const { search, setSearch, posts, loading } = usePosts();

    return (
        <div className="TaskThree">
            <input
                type="text"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search posts"
                value={search}
            />
            {loading && <p>Loading...</p>}
            <h1>Posts</h1>
            <ul>
                {posts.map((item) => (
                    <li key={item.id}>{item.title}</li>
                ))}
            </ul>
        </div>
    );
}
