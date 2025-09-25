import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';


const backendApiUrl = import.meta.env.VITE_BACKEND_URL;


interface Friend {
    id: string;
    username: string;
    image?: string;
    last_login?: Date;
}

// POPRAWIONY interface - uczynić pola wymaganymi z domyślnymi wartościami
interface UserProfile {
    id: string;
    username: string;
    image?: string;
    last_login?: Date;
    topArtists: {
        '1month': string[];
        '6months': string[];
        '1year': string[];
    };
    topTracks: {
        '1month': { track_name: string; artist_name: string; }[];
        '6months': { track_name: string; artist_name: string; }[];
        '1year': { track_name: string; artist_name: string; }[];
    };
    musicStats?: {
        totalArtists: number;
        totalTracks: number;
        mostPlayedArtist?: string;
    };
}

const Friends = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendUsername, setFriendUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [selectedTimeRange, setSelectedTimeRange] = useState<'1month' | '6months' | '1year'>('1month');

    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadFriends();
        
        if (userId) {
            loadUserProfile(userId);
        }
    }, [userId]);

    const loadFriends = async () => {
        try {
            const response = await fetch(backendApiUrl + '/friends', { 
                credentials: 'include' 
            });
            if (response.ok) {
                const friendsData = await response.json();
                setFriends(friendsData);
            }
        } catch (error) {
            console.error('Error loading friends:', error);
        }
    };

    // POPRAWIONA funkcja - z domyślnymi wartościami
    const loadUserProfile = async (targetUserId: string) => {
        setLoadingProfile(true);
        try {
            const response = await fetch(backendApiUrl + `/users/${targetUserId}/full-profile`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('User not found');
            }
            
            const data = await response.json();
            
            // Zapewnij domyślne wartości dla wymaganych pól
            const profile: UserProfile = {
                id: data.id,
                username: data.username,
                image: data.image,
                last_login: data.last_login,
                topArtists: {
                    '1month': data.topArtists?.['1month'] || [],
                    '6months': data.topArtists?.['6months'] || [],
                    '1year': data.topArtists?.['1year'] || []
                },
                topTracks: {
                    '1month': data.topTracks?.['1month'] || [],
                    '6months': data.topTracks?.['6months'] || [],
                    '1year': data.topTracks?.['1year'] || []
                },
                musicStats: data.musicStats
            };
            
            setSelectedUser(profile);
            
        } catch (error) {
            console.error('Error loading user profile:', error);
            setMessage('Failed to load user profile');
        } finally {
            setLoadingProfile(false);
        }
    };

    // POPRAWIONA funkcja z domyślnymi wartościami
    const loadUserProfileFast = async (targetUserId: string, timeRange: '1month' | '6months' | '1year' = '1month') => {
        setLoadingProfile(true);
        try {
            const response = await fetch(backendApiUrl + `/users/${targetUserId}/music-summary?timeRange=${timeRange}`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('User not found');
            }
            
            const data = await response.json();
            
            // Utwórz profile z domyślnymi wartościami
            const profile: UserProfile = {
                id: data.user.id,
                username: data.user.username,
                image: data.user.image,
                last_login: data.user.last_login,
                topArtists: {
                    '1month': timeRange === '1month' ? (data.topArtists || []) : [],
                    '6months': timeRange === '6months' ? (data.topArtists || []) : [],
                    '1year': timeRange === '1year' ? (data.topArtists || []) : []
                },
                topTracks: {
                    '1month': timeRange === '1month' ? (data.topTracks || []) : [],
                    '6months': timeRange === '6months' ? (data.topTracks || []) : [],
                    '1year': timeRange === '1year' ? (data.topTracks || []) : []
                }
            };
            
            setSelectedUser(profile);
            
        } catch (error) {
            console.error('Error loading user profile:', error);
            setMessage('Failed to load user profile');
        } finally {
            setLoadingProfile(false);
        }
    };

    const addFriend = async () => {
        if (!friendUsername.trim()) {
            setMessage('Please enter a username');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(backendApiUrl + '/friends', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username: friendUsername.trim() })
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('Friend added successfully!');
                setFriendUsername('');
                loadFriends();
            } else {
                setMessage(result.error || 'Failed to add friend');
            }
        } catch (error) {
            setMessage('Error adding friend');
            console.error('Error adding friend:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFriend = async (friendId: string, friendUsername: string) => {
        if (!confirm(`Are you sure you want to remove ${friendUsername} from your friends?`)) {
            return;
        }

        try {
            const response = await fetch(backendApiUrl + `/friends/${friendId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setMessage('Friend removed successfully');
                loadFriends();
                // If we're viewing this friend's profile, close it
                if (selectedUser?.id === friendId) {
                    closeUserProfile();
                }
            } else {
                setMessage('Failed to remove friend');
            }
        } catch (error) {
            setMessage('Error removing friend');
            console.error('Error removing friend:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            addFriend();
        }
    };

    const openUserProfile = (friendId: string) => {
        navigate(`/friends/${friendId}`);
    };

    const closeUserProfile = () => {
        setSelectedUser(null);
        navigate('/friends');
    };

    // POPRAWIONA funkcja handleTimeRangeChange - z prawidłowymi typami
    const handleTimeRangeChange = async (newTimeRange: '1month' | '6months' | '1year') => {
        setSelectedTimeRange(newTimeRange);
        
        // Sprawdź czy dane dla tego okresu nie są załadowane
        if (selectedUser && selectedUser.topArtists[newTimeRange].length === 0) {
            try {
                const response = await fetch(
                    backendApiUrl + `/users/${selectedUser.id}/music-summary?timeRange=${newTimeRange}`, 
                    { credentials: 'include' }
                );
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // POPRAWIONE setState - zachowaj wszystkie właściwości
                    setSelectedUser(prev => {
                        if (!prev) return null;
                        
                        return {
                            ...prev,
                            topArtists: {
                                ...prev.topArtists,
                                [newTimeRange]: data.topArtists || []
                            },
                            topTracks: {
                                ...prev.topTracks,
                                [newTimeRange]: data.topTracks || []
                            }
                        };
                    });
                }
            } catch (error) {
                console.error('Error loading time range data:', error);
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Navigation */}
            <div style={{ marginBottom: '20px' }}>
                <Link 
                    to="/me" 
                    style={{
                        textDecoration: 'none',
                        color: '#007bff',
                        fontSize: '16px'
                    }}
                >
                    ← Back to Profile
                </Link>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Friends List Panel */}
                <div style={{ 
                    flex: selectedUser ? '0 0 350px' : '1',
                    padding: '20px', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    height: 'fit-content'
                }}>
                    <h1 style={{ color: '#28a745', marginBottom: '20px' }}>
                        Friends ({friends.length})
                    </h1>
                    
                    {/* Add friend form */}
                    <div style={{ 
                        marginBottom: '25px', 
                        padding: '20px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px' 
                    }}>
                        <h3 style={{ marginTop: 0 }}>Add New Friend</h3>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input
                                type="text"
                                placeholder="Enter username"
                                value={friendUsername}
                                onChange={(e) => setFriendUsername(e.target.value)}
                                onKeyPress={handleKeyPress}
                                style={{ 
                                    flex: 1,
                                    padding: '10px', 
                                    border: '1px solid #ccc', 
                                    borderRadius: '6px',
                                    fontSize: '16px'
                                }}
                                disabled={loading}
                            />
                            <button
                                onClick={addFriend}
                                disabled={loading}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                {loading ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                        {message && (
                            <div style={{ 
                                padding: '10px',
                                borderRadius: '4px',
                                backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
                                color: message.includes('successfully') ? '#155724' : '#721c24',
                                fontSize: '14px'
                            }}>
                                {message}
                            </div>
                        )}
                    </div>

                    {/* Friends list */}
                    {friends.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {friends.map((friend) => (
                                <div
                                    key={friend.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '15px',
                                        border: selectedUser?.id === friend.id ? '2px solid #007bff' : '1px solid #eee',
                                        borderRadius: '8px',
                                        backgroundColor: selectedUser?.id === friend.id ? '#e3f2fd' : '#fafafa',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div 
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '12px',
                                            cursor: 'pointer',
                                            flex: 1
                                        }}
                                        onClick={() => openUserProfile(friend.id)}
                                    >
                                        {friend.image ? (
                                            <img
                                                src={friend.image}
                                                alt={friend.username}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#007bff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '18px'
                                                }}
                                            >
                                                {friend.username[0].toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p style={{ 
                                                margin: '0', 
                                                fontWeight: 'bold', 
                                                fontSize: '16px',
                                                color: '#007bff' 
                                            }}>
                                                {friend.username}
                                            </p>
                                            {friend.last_login && (
                                                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#666' }}>
                                                    Last seen: {new Date(friend.last_login).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFriend(friend.id, friend.username)}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '40px',
                            color: '#666',
                            fontSize: '16px',
                            fontStyle: 'italic'
                        }}>
                            No friends added yet.<br/>
                            Add some friends to get started!
                        </div>
                    )}
                </div>

                {/* User Profile Panel */}
                {selectedUser && (
                    <div style={{
                        flex: '1',
                        padding: '20px',
                        border: '1px solid #007bff',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        {/* Header */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: '20px',
                            paddingBottom: '15px',
                            borderBottom: '2px solid #007bff'
                        }}>
                            <h2 style={{ margin: 0, color: '#007bff' }}>
                                {selectedUser.username}'s Profile
                            </h2>
                            <button 
                                onClick={closeUserProfile}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    padding: '5px',
                                    color: '#666'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* User Info */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '20px', 
                            marginBottom: '25px', 
                            padding: '20px', 
                            backgroundColor: '#f8f9fa', 
                            borderRadius: '10px' 
                        }}>
                            {selectedUser.image ? (
                                <img
                                    src={selectedUser.image}
                                    alt={selectedUser.username}
                                    style={{ 
                                        width: '100px', 
                                        height: '100px', 
                                        borderRadius: '50%', 
                                        objectFit: 'cover',
                                        border: '3px solid #007bff'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    backgroundColor: '#007bff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '36px',
                                    fontWeight: 'bold'
                                }}>
                                    {selectedUser.username[0].toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
                                    {selectedUser.username}
                                </h3>
                                {selectedUser.last_login && (
                                    <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
                                        Last seen: {new Date(selectedUser.last_login).toLocaleString()}
                                    </p>
                                )}
                                {/* Statystyki muzyczne - z bezpiecznym dostępem */}
                                {selectedUser.musicStats && (
                                    <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                                        <span style={{ marginRight: '15px' }}>
                                            🎵 {selectedUser.musicStats.totalArtists} Artists
                                        </span>
                                        <span style={{ marginRight: '15px' }}>
                                            🎧 {selectedUser.musicStats.totalTracks} Tracks
                                        </span>
                                        {selectedUser.musicStats.mostPlayedArtist && (
                                            <span>
                                                ⭐ {selectedUser.musicStats.mostPlayedArtist}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Time Range Selector */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ 
                                marginRight: '15px', 
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}>
                                Time Period:
                            </label>
                            <select
                                value={selectedTimeRange}
                                onChange={(e) => handleTimeRangeChange(e.target.value as '1month' | '6months' | '1year')}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    fontSize: '16px'
                                }}
                            >
                                <option value="1month">Last Month</option>
                                <option value="6months">Last 6 Months</option>
                                <option value="1year">Last Year</option>
                            </select>
                        </div>

                        {/* Top Artists - POPRAWIONE sprawdzenie null/undefined */}
                        <div style={{ marginBottom: '30px' }}>
                            <h3 style={{ 
                                color: '#007bff', 
                                borderBottom: '3px solid #007bff', 
                                paddingBottom: '8px',
                                fontSize: '20px'
                            }}>
                                🎵 Top Artists
                            </h3>
                            {selectedUser.topArtists[selectedTimeRange].length > 0 ? (
                                <div style={{ 
                                    display: 'grid', 
                                    gap: '8px',
                                    marginTop: '15px'
                                }}>
                                    {selectedUser.topArtists[selectedTimeRange].slice(0, 10).map((artist, index) => (
                                        <div 
                                            key={index} 
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '10px',
                                                backgroundColor: index < 3 ? '#e3f2fd' : '#f5f5f5',
                                                borderRadius: '6px',
                                                border: index < 3 ? '1px solid #90caf9' : '1px solid #e0e0e0'
                                            }}
                                        >
                                            <span style={{
                                                minWidth: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                backgroundColor: index < 3 ? '#007bff' : '#999',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                {index + 1}
                                            </span>
                                            <span style={{ 
                                                fontSize: '16px',
                                                fontWeight: index < 3 ? 'bold' : 'normal'
                                            }}>
                                                {artist}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ 
                                    color: '#666', 
                                    fontStyle: 'italic',
                                    textAlign: 'center',
                                    padding: '20px'
                                }}>
                                    No top artists data available for this period
                                </p>
                            )}
                        </div>

                        {/* Top Tracks - POPRAWIONE sprawdzenie null/undefined */}
                        <div>
                            <h3 style={{ 
                                color: '#28a745', 
                                borderBottom: '3px solid #28a745', 
                                paddingBottom: '8px',
                                fontSize: '20px'
                            }}>
                                🎧 Top Tracks
                            </h3>
                            {selectedUser.topTracks[selectedTimeRange].length > 0 ? (
                                <div style={{ 
                                    display: 'grid', 
                                    gap: '10px',
                                    marginTop: '15px'
                                }}>
                                    {selectedUser.topTracks[selectedTimeRange].slice(0, 10).map((track, index) => (
                                        <div 
                                            key={index} 
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px',
                                                backgroundColor: index < 3 ? '#e8f5e8' : '#f5f5f5',
                                                borderRadius: '6px',
                                                border: index < 3 ? '1px solid #a5d6a7' : '1px solid #e0e0e0'
                                            }}
                                        >
                                            <span style={{
                                                minWidth: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                backgroundColor: index < 3 ? '#28a745' : '#999',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                {index + 1}
                                            </span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ 
                                                    fontSize: '16px',
                                                    fontWeight: index < 3 ? 'bold' : 'normal',
                                                    marginBottom: '2px'
                                                }}>
                                                    {track.track_name}
                                                </div>
                                                <div style={{ 
                                                    fontSize: '14px', 
                                                    color: '#666' 
                                                }}>
                                                    by {track.artist_name}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ 
                                    color: '#666', 
                                    fontStyle: 'italic',
                                    textAlign: 'center',
                                    padding: '20px'
                                }}>
                                    No top tracks data available for this period
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Loading overlay */}
            {loadingProfile && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '18px', margin: 0 }}>Loading user profile...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Friends;
