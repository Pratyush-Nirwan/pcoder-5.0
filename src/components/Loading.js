import React, { useState, useEffect } from 'react';

const Loading = () => {
    const helloList = ["नमस्ते", "Hola", "Bonjour", "Hallo", "Здравствуйте", "你好", "こんにちは", "Ciao"];
    const [currentGreeting, setCurrentGreeting] = useState('');
    useEffect(() => {
        setCurrentGreeting('Hello')
        setTimeout(() => {
            let index = 0;
            const interval = setInterval(() => {
                setCurrentGreeting(helloList[index]);
                if (index === helloList.length - 1) {
                    clearInterval(interval);
                }
                index = (index + 1) % helloList.length;
            }, 150);
        }, 3000);
    }, [])
    return (
        <div id="loading-div" className="">
            <h1 className="text" id='greeting'>{currentGreeting}</h1>
        </div>
    );
}

export default Loading;