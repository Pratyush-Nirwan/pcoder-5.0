import React, { useEffect } from "react";
import { Gradient } from "../assets/Gradient";

function MeshGradient({ id, seed }) {
    useEffect(() => {
        const gradient = new Gradient();
        gradient.initGradient(`#${id}`);

        function generateRandomFrequency() {
            const min = 0.0001;
            const max = 0.0005;
            const randomValue = Math.random() * (max - min) + min;
            return parseFloat(randomValue.toFixed(4)); // Round to 4 decimal places
        }
        const frequency = [generateRandomFrequency(), generateRandomFrequency()];


        gradient.seed = seed;
        gradient.freqX = frequency[0];
        gradient.freqY = frequency[1];
        gradient.play();
        console.log(`Gradient id: ${id} initialized`);

        return () => gradient.pause(); // Cleanup on unmount
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
                    "--gradient-color-3": "#fcd6d6",
                }}
            />
        </div>
    );
}

export default MeshGradient;