import { useEffect, useState, useRef } from "react";
import { FaCompactDisc } from "react-icons/fa6";

const SpotifyRp = () => {
    const API_KEY = process.env.REACT_APP_SPOTIFY_API_KEY;
    const username = 'pratyush_nirwan';

    const [track, setTrack] = useState('');
    const [truncatedTrack, setTruncatedTrack] = useState('');

    async function getCurrentlyPlaying() {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${API_KEY}&format=json&limit=2`);
        const data = await response.json();

        if (data && data.recenttracks && data.recenttracks.track.length > 0) {
            const track = data.recenttracks.track[0];
            const nowPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';

            if (nowPlaying) {
                setTrack(track.name.toUpperCase());
            } else {
                const recentTrack = data.recenttracks.track[1]; // Get the most recently played track
                setTrack(recentTrack.name.toUpperCase());
            }
        }
    }

    useEffect(() => {
        getCurrentlyPlaying();
        const intervalId = setInterval(() => {
            getCurrentlyPlaying();
        }, 10 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    const containerRef = useRef(null);
    const textRef = useRef(null);

    const truncateText = (text, maxWidth) => {
        const container = containerRef.current;
        const textElement = textRef.current;
        if (!container || !textElement) return text;

        let truncated = text;
        textElement.textContent = text;
        if (textElement.scrollWidth > maxWidth) {
            while (textElement.scrollWidth > maxWidth && truncated.length > 0) {
                truncated = truncated.slice(0, -1);
                textElement.textContent = `${truncated}...`;
            }
        }
        return `${truncated}...`;
    };

    useEffect(() => {
        const maxWidth = containerRef.current ? containerRef.current.clientWidth : 0;
        setTruncatedTrack(truncateText(track, maxWidth));
    }, [track]);

    return (
        <div id="music-div">
            <FaCompactDisc size={20} id='music-disc' />
            <div id="overflow-catch" ref={containerRef}>
                <h4 className="text" id="music-text" ref={textRef}>{truncatedTrack}</h4>
            </div>
        </div>
    )
}


const Spotify = () => {
    return (
        <SpotifyRp />
    )
}

export default Spotify;
