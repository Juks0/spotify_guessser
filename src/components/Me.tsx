import React, { useEffect, useState } from 'react';
import {backendApiUrl} from "@/lib/urls/backendApiUrl.js";

const backendApi = backendApiUrl

interface UserData {
    display_name: string;
    product: string;
    images: { url: string }[];
    country: string;
}
function getFlagEmoji(countryCode: string) {
    if (!countryCode) return '';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

const Me = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    useEffect(() => {
        console.log('Fetching user data from backend...');
        fetch(backendApi + '/me', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUserData(data))
            .catch(console.error);
    }, []);

    return (
        <div>
            {userData ? (
                <>
                    <p>{userData.display_name}</p>
                    <p>{userData.product}</p>
                    {userData.images && userData.images.length > 0 && (
                        <img src={userData.images[0].url} alt="User Avatar" width="200" />
                    )}
                    <p>{getFlagEmoji(userData.country)}</p>

                </>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default Me;
