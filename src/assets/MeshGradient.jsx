import React, { useEffect } from "react";
import { Gradient } from "../assets/Gradient";

const initializedGradients = new Set();

function MeshGradient({ id, seed }) {
    useEffect(() => {
        const attemptInit = () => {
            const canvas = document.getElementById(id);

            // Retry if canvas is not ready or has 0 width/height
            if (!canvas || canvas.offsetWidth === 0 || canvas.offsetHeight === 0) {
                console.warn(`⏳ Waiting for canvas #${id} to be ready...`);
                setTimeout(attemptInit, 100); // Retry in 100ms
                return;
            }

            // Skip if already initialized
            if (initializedGradients.has(id)) {
                console.log(`🟡 MeshGradient: Already initialized for #${id}`);
                return;
            }

            const gradient = new Gradient();
            gradient.initGradient(`#${id}`);

            const min = 0.0001;
            const max = 0.0005;
            const freqX = parseFloat((Math.random() * (max - min) + min).toFixed(4));
            const freqY = parseFloat((Math.random() * (max - min) + min).toFixed(4));

            gradient.seed = seed;
            gradient.freqX = freqX;
            gradient.freqY = freqY;
            gradient.play();

            initializedGradients.add(id);
            console.log(`✅ MeshGradient initialized for #${id}`);
        };

        attemptInit();

        // Cleanup is optional if you want to stop animation
        return () => {
            console.log(`🛑 MeshGradient cleanup for #${id}`);

        };
    }, [id, seed]);

    return (
        <div style={{ position: "relative", height: "100vh" }}>
            <canvas
                id={id}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    "--gradient-color-1": "#dca8d8",
                    "--gradient-color-2": "#a3d3f9",
                    "--gradient-color-3": "#fcd6d6"

                }}
            />
        </div>
    );
}

export default MeshGradient;
