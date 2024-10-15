// cookieUtils.js

// Set a cookie that expires after the session (when the browser is closed)
export const setCookie = (name, value) => {
    document.cookie = name + "=" + (value || "") + "; path=/";
};

// Get a cookie by name
export const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

// Delete a cookie by setting its expiration to a past date
export const eraseCookie = (name) => {
    document.cookie = name + "=; Max-Age=-99999999; path=/";
};
