import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "./theme-toggle"
import { Play, Pause, SkipBack, SkipForward, Volume2, Users, Clock, List, UserPlus, X, Music } from "lucide-react"

// const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

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

const mockUserData: UserData = {
  display_name: "Alex Johnson",
  product: "premium",
  images: [{ url: "/diverse-user-avatars.png" }],
  country: "US",
}

const mockTracks: SpotifyTrack[] = [
  {
    id: "1",
    name: "Blinding Lights",
    artists: [{ id: "1", name: "The Weeknd" }],
    album: {
      id: "1",
      name: "After Hours",
      images: [{ url: "/blinding-lights-album-cover.png" }],
    },
    duration_ms: 200040,
    external_urls: { spotify: "" },
    uri: "spotify:track:1",
  },
  {
    id: "2",
    name: "Watermelon Sugar",
    artists: [{ id: "2", name: "Harry Styles" }],
    album: {
      id: "2",
      name: "Fine Line",
      images: [{ url: "/watermelon-sugar-album-cover.png" }],
    },
    duration_ms: 174000,
    external_urls: { spotify: "" },
    uri: "spotify:track:2",
  },
  {
    id: "3",
    name: "Good 4 U",
    artists: [{ id: "3", name: "Olivia Rodrigo" }],
    album: {
      id: "3",
      name: "SOUR",
      images: [{ url: "/album-cover-good-4-u.png" }],
    },
    duration_ms: 178000,
    external_urls: { spotify: "" },
    uri: "spotify:track:3",
  },
  {
    id: "4",
    name: "Levitating",
    artists: [{ id: "4", name: "Dua Lipa" }],
    album: {
      id: "4",
      name: "Future Nostalgia",
      images: [{ url: "/album-cover-levitating.jpg" }],
    },
    duration_ms: 203000,
    external_urls: { spotify: "" },
    uri: "spotify:track:4",
  },
  {
    id: "5",
    name: "Stay",
    artists: [
      { id: "5", name: "The Kid LAROI" },
      { id: "6", name: "Justin Bieber" },
    ],
    album: {
      id: "5",
      name: "Stay",
      images: [{ url: "/album-cover-stay.png" }],
    },
    duration_ms: 141000,
    external_urls: { spotify: "" },
    uri: "spotify:track:5",
  },
]

const mockFriends: Friend[] = [
  {
    id: "1",
    username: "musiclover23",
    image: "/friend-avatar-1.jpg",
    last_login: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: "2",
    username: "beatdrop",
    image: "/friend-avatar-2.jpg",
    last_login: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: "3",
    username: "synthwave_fan",
    last_login: new Date(Date.now() - 7200000), // 2 hours ago
  },
]

function getFlagEmoji(countryCode: string) {
  if (!countryCode) return ""
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export function MusicDashboard() {
  const [userData, setUserData] = useState<UserData | null>(mockUserData)
  const [friends, setFriends] = useState<Friend[]>(mockFriends)
  const [friendUsername, setFriendUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // Spotify Playback State - Initialize with mock playback state
  const [playbackState, setPlaybackState] = useState<SpotifyPlaybackState | null>({
    repeat_state: "off",
    shuffle_state: false,
    timestamp: Date.now(),
    progress_ms: 45000,
    is_playing: true,
    item: mockTracks[0],
  })
  const [queue, setQueue] = useState<SpotifyQueue | null>({
    currently_playing: mockTracks[0],
    queue: mockTracks.slice(1, 4),
  })
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedTrack[]>(
    mockTracks.slice(0, 5).map((track, index) => ({
      track,
      played_at: new Date(Date.now() - (index + 1) * 3600000).toISOString(),
    })),
  )

  useEffect(() => {
    console.log("[v0] Loading mock data for music dashboard")

    // Simulate progress updates for the currently playing track
    const progressInterval = setInterval(() => {
      setPlaybackState((prev) => {
        if (prev && prev.item && prev.is_playing && prev.progress_ms !== undefined) {
          const newProgress = prev.progress_ms + 1000
          if (newProgress >= prev.item.duration_ms) {
            // Track finished, move to next track
            const currentIndex = mockTracks.findIndex((track) => track.id === prev.item?.id)
            const nextTrack = mockTracks[(currentIndex + 1) % mockTracks.length]
            return {
              ...prev,
              progress_ms: 0,
              item: nextTrack,
            }
          }
          return {
            ...prev,
            progress_ms: newProgress,
          }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(progressInterval)
  }, [])

  const loadCurrentPlayback = async () => {
    console.log("[v0] Mock: Loading current playback")
    // Already initialized with mock data
  }

  const loadQueue = async () => {
    console.log("[v0] Mock: Loading queue")
    // Already initialized with mock data
  }

  const loadRecentlyPlayed = async () => {
    console.log("[v0] Mock: Loading recently played")
    // Already initialized with mock data
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const loadFriends = async () => {
    console.log("[v0] Mock: Loading friends")
    // Already initialized with mock data
  }

  const addFriend = async () => {
    if (!friendUsername.trim()) {
      setMessage("Please enter a username")
      return
    }

    setLoading(true)
    setMessage("")

    setTimeout(() => {
      const newFriend: Friend = {
        id: Date.now().toString(),
        username: friendUsername.trim(),
        last_login: new Date(),
      }
      setFriends((prev) => [...prev, newFriend])
      setMessage("Friend added successfully!")
      setFriendUsername("")
      setLoading(false)
    }, 500)
  }

  const removeFriend = async (friendId: string, friendUsername: string) => {
    if (!confirm(`Are you sure you want to remove ${friendUsername} from your friends?`)) {
      return
    }

    setFriends((prev) => prev.filter((friend) => friend.id !== friendId))
    setMessage("Friend removed successfully")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addFriend()
    }
  }

  const progressPercentage =
    playbackState?.item && playbackState.progress_ms
      ? (playbackState.progress_ms / playbackState.item.duration_ms) * 100
      : 0

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-balance">Music Dashboard</h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* User Profile - Top Left */}
          <Card className="col-span-4 row-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {userData ? (
                <div className="flex items-center gap-4">
                  {userData.images && userData.images.length > 0 && (
                    <img
                      src={userData.images[0].url || "/placeholder.svg"}
                      alt="User Avatar"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{userData.display_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{userData.product}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {getFlagEmoji(userData.country)} {userData.country}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Currently Playing - Top Center & Right */}
          <Card className="col-span-8 row-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Music className="h-5 w-5" />
                Now Playing
              </CardTitle>
            </CardHeader>
            <CardContent>
              {playbackState && playbackState.item ? (
                <div className="flex items-center gap-6">
                  <img
                    src={playbackState.item.album.images[0]?.url || "/placeholder.svg"}
                    alt={playbackState.item.album.name}
                    className="h-20 w-20 rounded-lg object-cover shadow-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-xl truncate">{playbackState.item.name}</h3>
                    <p className="text-muted-foreground truncate">
                      {playbackState.item.artists.map((artist) => artist.name).join(", ")}
                    </p>
                    <p className="text-sm text-muted-foreground truncate mt-1">{playbackState.item.album.name}</p>

                    {/* Progress Bar */}
                    {playbackState.progress_ms !== undefined && (
                      <div className="mt-4 space-y-2">
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formatTime(playbackState.progress_ms)}</span>
                          <span>{formatTime(playbackState.item.duration_ms)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      {playbackState.is_playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-20 text-muted-foreground">
                  <Music className="h-8 w-8 mr-2" />
                  No active playback
                </div>
              )}
            </CardContent>
          </Card>

          {/* Queue - Middle Left */}
          <Card className="col-span-4 row-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <List className="h-5 w-5" />
                  Queue
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={loadQueue}>
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar px-6 pb-6">
                {queue?.queue.length ? (
                  <div className="space-y-3">
                    {queue.queue.slice(0, 8).map((track, index) => (
                      <div
                        key={`${track.id}-${index}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <img
                          src={track.album.images[2]?.url || track.album.images[0]?.url}
                          alt={track.album.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm">{track.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {track.artists.map((artist) => artist.name).join(", ")}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatTime(track.duration_ms)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <List className="h-6 w-6 mr-2" />
                    No tracks in queue
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recently Played - Middle Center */}
          <Card className="col-span-5 row-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  Recently Played
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={loadRecentlyPlayed}>
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar px-6 pb-6">
                {recentlyPlayed.length ? (
                  <div className="space-y-3">
                    {recentlyPlayed.map((item, index) => (
                      <div
                        key={`${item.track.id}-${index}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <img
                          src={item.track.album.images[2]?.url || item.track.album.images[0]?.url}
                          alt={item.track.album.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm">{item.track.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.track.artists.map((artist) => artist.name).join(", ")}
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(item.played_at).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <Clock className="h-6 w-6 mr-2" />
                    No recent tracks
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Friends - Middle Right */}
          <Card className="col-span-3 row-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Friends ({friends.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Friend Form */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Username"
                    value={friendUsername}
                    onChange={(e) => setFriendUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button onClick={addFriend} disabled={loading} size="icon" className="shrink-0">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
                {message && <p className="text-xs text-muted-foreground">{message}</p>}
              </div>

              {/* Friends List */}
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2">
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      {friend.image ? (
                        <img
                          src={friend.image || "/placeholder.svg"}
                          alt={friend.username}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {friend.username[0].toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">{friend.username}</p>
                        {friend.last_login && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(friend.last_login).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFriend(friend.id, friend.username)}
                        className="h-6 w-6 shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-20 text-muted-foreground text-center">
                    <div>
                      <Users className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-xs">No friends yet</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
