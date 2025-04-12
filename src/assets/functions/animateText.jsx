function animateText(id, newText) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with id "${id}" not found.`);
        return;
    }

    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let randomizedText = '';
    let index = 0;
    const maxLength = Math.max(element.innerText.length, newText.length); // Handle old text longer than new text
    const randomizeSpeed = 50; // Randomization speed remains constant
    const largeTextThreshold = 50; // Threshold for large text

    // Store intervals and timeouts globally to prevent overlapping animations
    if (!window.activeIntervals) {
        window.activeIntervals = {};
    }
    if (!window.activeTimeouts) {
        window.activeTimeouts = {};
    }

    // Clear any existing interval or timeout for this element
    if (window.activeIntervals[id]) {
        clearInterval(window.activeIntervals[id]);
        delete window.activeIntervals[id];
    }
    if (window.activeTimeouts[id]) {
        clearTimeout(window.activeTimeouts[id]);
        delete window.activeTimeouts[id];
    }

    function formatTextWithNewLines(text) {
        return text.replace(/\n/g, '<br>'); // Replace \n with <br> for HTML rendering
    }

    function randomizeAndAddLetters() {
        randomizedText = '';
        for (let i = 0; i < maxLength; i++) {
            if (i < index && i < newText.length) {
                randomizedText += newText.charAt(i) === '\n' ? '<br>' : newText.charAt(i);
            } else if (i >= newText.length) {
                randomizedText += ' '; // Preserve spaces
            } else if (newText.charAt(i) === ' ') {
                randomizedText += ' ';
            } else if (newText.charAt(i) === '\n') {
                randomizedText += '<br>';
            } else {
                randomizedText += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
            }
        }
        element.innerHTML = randomizedText;

        if (index < newText.length) {
            index++;
        } else {
            clearInterval(window.activeIntervals[id]);
            delete window.activeIntervals[id];

            if (newText.length > largeTextThreshold) {
                // Replace all characters at once for large text
                element.innerHTML = formatTextWithNewLines(newText);
            } else {
                // Replace characters progressively for small text
                window.activeIntervals[id] = setInterval(replaceRandomizedWithFinalText, 40);
            }
        }
    }

    function replaceRandomizedWithFinalText() {
        randomizedText = '';
        let completed = true;

        for (let i = 0; i < maxLength; i++) {
            const currentChar = element.innerHTML.replace(/<br>/g, '\n').charAt(i);
            if (i >= newText.length) {
                randomizedText += ' ';
            } else if (currentChar !== newText.charAt(i)) {
                if (newText.charAt(i) === ' ') {
                    randomizedText += ' ';
                } else if (newText.charAt(i) === '\n') {
                    randomizedText += '<br>';
                } else {
                    randomizedText += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
                }
                completed = false;
            } else {
                randomizedText += newText.charAt(i) === '\n' ? '<br>' : newText.charAt(i);
            }
        }

        element.innerHTML = randomizedText;

        if (completed) {
            clearInterval(window.activeIntervals[id]);
            delete window.activeIntervals[id];
            element.innerHTML = formatTextWithNewLines(newText);
        }
    }

    // Add a 500ms delay before starting the animation
    window.activeTimeouts[id] = setTimeout(() => {
        delete window.activeTimeouts[id]; // Remove the timeout reference after it executes

        if (newText.length > largeTextThreshold) {
            let flickerCount = 0;
            const flickerLimit = 15; // ~500ms at 50ms interval

            window.activeIntervals[id] = setInterval(() => {
                let tempText = '';
                for (let i = 0; i < newText.length; i++) {
                    const char = newText.charAt(i);
                    if (char === '\n') {
                        tempText += '<br>';
                    } else if (char === ' ') {
                        tempText += ' ';
                    } else {
                        tempText += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
                    }
                }
                element.innerHTML = tempText;
                flickerCount++;

                if (flickerCount >= flickerLimit) {
                    clearInterval(window.activeIntervals[id]);
                    delete window.activeIntervals[id];
                    element.innerHTML = formatTextWithNewLines(newText);
                }
            }, randomizeSpeed);
        } else {
            window.activeIntervals[id] = setInterval(randomizeAndAddLetters, randomizeSpeed);
        }
    }, 200); // 500ms delay
}

export default animateText;