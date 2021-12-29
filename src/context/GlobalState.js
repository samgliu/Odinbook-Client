import React, { createContext, useState } from 'react';

const initialState = [];

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function doesHttpOnlyCookieExist(cookiename) {
        var d = new Date();
        d.setTime(d.getTime() + 1000);
        var expires = 'expires=' + d.toUTCString();

        document.cookie = cookiename + '=new_value;path=/;' + expires;
        return document.cookie.indexOf(cookiename + '=') === -1;
    }

    function timeSince(timeStamp) {
        var now = new Date(),
            secondsPast =
                (now.getTime() - new Date(timeStamp).getTime()) / 1000;
        if (secondsPast < 60) {
            return Math.round(secondsPast) + ' seconds';
        }
        if (secondsPast < 3600) {
            const res = parseInt(secondsPast / 60);
            return res === 1 ? res + ' minute' : res + ' minutes';
        }
        if (secondsPast <= 86400) {
            const res = parseInt(secondsPast / 3600);
            return res === 1 ? res + ' hour' : res + ' hours';
        }
        if (secondsPast <= 2628000) {
            const res = parseInt(secondsPast / 86400);
            return res === 1 ? res + ' day' : res + ' days';
        }
        if (secondsPast <= 31536000) {
            const res = parseInt(secondsPast / 2628000);
            return res === 1 ? res + ' month ' : res + ' months';
        }
        if (secondsPast > 31536000) {
            const res = parseInt(secondsPast / 31536000);
            return res === 1 ? res + ' year' : res + ' years';
        }
    }

    return (
        <GlobalContext.Provider
            value={{
                user,
                setUser,
                isLoggedIn,
                setIsLoggedIn,
                accessToken,
                setAccessToken,
                doesHttpOnlyCookieExist,
                timeSince,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
