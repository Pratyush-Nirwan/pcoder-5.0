function toggleOpacity(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const currentOpacity = window.getComputedStyle(element).opacity;
        element.style.opacity = currentOpacity === "1" ? "0" : "1";
    } else {
        console.error(`Element with ID "${elementId}" not found.`);
    }
}