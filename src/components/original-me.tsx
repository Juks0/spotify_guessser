"use client"

import type React from "react"
import { useEffect, useState } from "react"

const backendApiUrl = import.meta.env.VITE_BACKEND_URL

interface UserData {
  display_name: string
  product: string
  images: { url: string }[]
  country: string
}

interface Friend {
  id: string
  username: string
  image?: string
  last_login?: Date
}

// Spotify Playback Interfaces
interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{
    id: string
    name: string
  }>
  album: {
    id: string
    name: string
    images: Array<{
      url: string
      height?: number
      width?: number
    }>
  }
  duration_ms: number
  preview_url?: string
  external_urls: {
    spotify: string
  }
  uri: string
}

interface SpotifyPlaybackState {
  repeat_state: "off" | "track" | "context"
  shuffle_state: boolean
  timestamp: number
  progress_ms?: number
  is_playing: boolean
  item?: SpotifyTrack
}

interface SpotifyQueue {
  currently_playing: SpotifyTrack | null
  queue: SpotifyTrack[]
}

interface RecentlyPlayedTrack {
  track: SpotifyTrack
  played_at: string
}

function getFlagEmoji(countryCode: string) {
  if (!countryCode) return ""
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

const Me = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendUsername, setFriendUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // Spotify Playback State
  const [playbackState, setPlaybackState] = useState<SpotifyPlaybackState | null>(null)
  const [queue, setQueue] = useState<SpotifyQueue | null>(null)
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedTrack[]>([])

  useEffect(() => {
    console.log("Fetching user data from backend...")
    fetch(backendApiUrl + "/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch(console.error)

    loadFriends()
    loadCurrentPlayback()
    loadQueue()
    loadRecentlyPlayed()

    // Poll playback state every 5 seconds
    const playbackInterval = setInterval(loadCurrentPlayback, 50000)

    return () => clearInterval(playbackInterval)
  }, [])

  const loadCurrentPlayback = async () => {
    try {
      const response = await fetch(backendApiUrl + "/spotify/playback", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setPlaybackState(data)
      } else if (response.status !== 204) {
        console.error("Failed to get playback state")
      }
    } catch (error) {
      console.error("Error loading playback state:", error)
    }
  }

  const loadQueue = async () => {
    try {
      const response = await fetch(backendApiUrl + "/spotify/playback/queue", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setQueue(data)
      }
    } catch (error) {
      console.error("Error loading queue:", error)
    }
  }

  const loadRecentlyPlayed = async () => {
    try {
      const response = await fetch(backendApiUrl + "/spotify/recently-played?limit=10", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setRecentlyPlayed(data.items || [])
      }
    } catch (error) {
      console.error("Error loading recently played:", error)
    }
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // ===== FRIENDS FUNCTIONS =====

  const loadFriends = async () => {
    try {
      const response = await fetch(backendApiUrl + "/friends", {
        credentials: "include",
      })
      if (response.ok) {
        const friendsData = await response.json()
        setFriends(friendsData)
      }
    } catch (error) {
      console.error("Error loading friends:", error)
    }
  }

  const addFriend = async () => {
    if (!friendUsername.trim()) {
      setMessage("Please enter a username")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch(backendApiUrl + "/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: friendUsername.trim() }),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage("Friend added successfully!")
        setFriendUsername("")
        loadFriends()
      } else {
        setMessage(result.error || "Failed to add friend")
      }
    } catch (error) {
      setMessage("Error adding friend")
      console.error("Error adding friend:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFriend = async (friendId: string, friendUsername: string) => {
    if (!confirm(`Are you sure you want to remove ${friendUsername} from your friends?`)) {
      return
    }

    try {
      const response = await fetch(backendApiUrl + `/friends/${friendId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        setMessage("Friend removed successfully")
        loadFriends()
      } else {
        setMessage("Failed to remove friend")
      }
    } catch (error) {
      setMessage("Error removing friend")
      console.error("Error removing friend:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addFriend()
    }
  }

  return (
    <div>
      {/* User Profile Section */}
      {userData ? (
        <div>
          <h2>Your Profile</h2>
          <p>Name: {userData.display_name}</p>
          <p>Plan: {userData.product}</p>
          {userData.images && userData.images.length > 0 && (
            <img src={userData.images[0].url} alt="User Avatar" width="100" />
          )}
          <p>
            Country: {getFlagEmoji(userData.country)} {userData.country}
          </p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      {/* Currently Playing Section */}
      <div>
        <h2>🎵 Currently Playing</h2>
        {playbackState && playbackState.item ? (
          <div>
            <img
              src={playbackState.item.album.images[0]?.url}
              alt={playbackState.item.album.name}
              width="80"
              height="80"
            />
            <h3>{playbackState.item.name}</h3>
            <p>by {playbackState.item.artists.map((artist) => artist.name).join(", ")}</p>
            <p>{playbackState.item.album.name}</p>

            {/* Progress Bar (read-only) */}
            {playbackState.progress_ms !== undefined && (
              <div>
                <progress value={playbackState.progress_ms} max={playbackState.item.duration_ms}></progress>
                <p>
                  {formatTime(playbackState.progress_ms)} / {formatTime(playbackState.item.duration_ms)}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p>No active playback found</p>
        )}
      </div>

      {/* Queue Section */}
      <div>
        <h2>📋 Queue (Next 5 tracks)</h2>
        <button onClick={loadQueue}>Refresh Queue</button>

        {queue?.queue.length ? (
          <div>
            {queue.queue.slice(0, 5).map((track, index) => (
              <div key={`${track.id}-${index}`}>
                <img
                  src={track.album.images[2]?.url || track.album.images[0]?.url}
                  alt={track.album.name}
                  width="40"
                  height="40"
                />
                <div>
                  <p>{track.name}</p>
                  <p>{track.artists.map((artist) => artist.name).join(", ")}</p>
                  <span>{formatTime(track.duration_ms)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No tracks in queue</p>
        )}
      </div>

      {/* Recently Played Section */}
      <div>
        <h2>🕐 Recently Played</h2>
        <button onClick={loadRecentlyPlayed}>Refresh Recently Played</button>

        {recentlyPlayed.length ? (
          <div>
            {recentlyPlayed.map((item, index) => (
              <div key={`${item.track.id}-${index}`}>
                <img
                  src={item.track.album.images[2]?.url || item.track.album.images[0]?.url}
                  alt={item.track.album.name}
                  width="40"
                  height="40"
                />
                <div>
                  <p>{item.track.name}</p>
                  <p>{item.track.artists.map((artist) => artist.name).join(", ")}</p>
                  <p>Played at: {new Date(item.played_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recently played tracks</p>
        )}
      </div>

      {/* Friends Section */}
      <div>
        <h2>Friends ({friends.length})</h2>

        {/* Add friend form */}
        <div>
          <h3>Add Friend</h3>
          <input
            type="text"
            placeholder="Enter username"
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button onClick={addFriend} disabled={loading}>
            {loading ? "Adding..." : "Add Friend"}
          </button>
          {message && <p>{message}</p>}
        </div>

        {/* Friends list */}
        {friends.length > 0 ? (
          <div>
            <h3>Your Friends</h3>
            {friends.map((friend) => (
              <div key={friend.id}>
                <div>
                  {friend.image ? (
                    <img src={friend.image} alt={friend.username} width="40" height="40" />
                  ) : (
                    <div>{friend.username[0].toUpperCase()}</div>
                  )}
                  <div>
                    <p>{friend.username}</p>
                    {friend.last_login && <p>Last seen: {new Date(friend.last_login).toLocaleDateString()}</p>}
                  </div>
                </div>
                <button onClick={() => removeFriend(friend.id, friend.username)}>Remove</button>
              </div>
            ))}
          </div>
        ) : (
          <p>No friends added yet. Add some friends to get started!</p>
        )}
      </div>
    </div>
  )
}

export default Me
