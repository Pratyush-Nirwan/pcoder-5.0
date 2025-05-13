import { useState, useEffect } from 'react';
import { FaCompactDisc } from 'react-icons/fa';
import { IoPinSharp } from 'react-icons/io5';
import MeshGradient from '../assets/MeshGradient'; // Assuming you have this component imported

const SpotifyRp = ({ selectedPage }) => {


    const [track, setTrack] = useState('');
    const [artist, setArtist] = useState('');

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...'; // Truncate and add ellipsis
        }
        return text;
    };

    async function getCurrentlyPlaying() {
        const API_KEY = 'f6d9f010ca24dc38f275af06eb7a719f';
        const username = 'pratyush_nirwan';
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${API_KEY}&format=json&limit=2`);
        const data = await response.json();

        if (data && data.recenttracks && data.recenttracks.track.length > 0) {
            const track = data.recenttracks.track[0];
            const nowPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';

            if (nowPlaying) {
                setArtist(track.artist['#text'].toUpperCase());
                setTrack(truncateText(track.name.toUpperCase(), 15)); // Truncate track name
            } else {
                const recentTrack = data.recenttracks.track[1]; // Get the most recently played track
                setArtist(recentTrack.artist['#text'].toUpperCase());
                setTrack(truncateText(recentTrack.name.toUpperCase(), 15)); // Truncate track name
            }
        }
    }

    useEffect(() => {
        getCurrentlyPlaying();
        const interval = setInterval(() => {
            getCurrentlyPlaying();
        }, 10 * 1000); // Fetch new track every 10 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    return (
        <div className={"music-player " + selectedPage}>
            <div id="circle">
                <MeshGradient id="gradient-circle" seed={2} frequency={[0.0001, 0.000]} />
                <FaCompactDisc id="disc" size={100} />
                <IoPinSharp id="pin" size={70} />
            </div>

            <svg className="curved-text" width="250" height="250" viewBox="0 0 250 250">
                <defs>
                    <path
                        id="textPathOutside"
                        d="M125,125 m-115,0 a115,115 0 1,1 230,0 a115,115 0 1,1 -230,0"
                    />
                </defs>
                <text fontSize="20" textAnchor="middle" dy="5">
                    <textPath href="#textPathOutside" startOffset="50%">
                        {track} - {artist}
                    </textPath>
                </text>
            </svg>
        </div>
    );
};

export default SpotifyRp;
