"use client"

import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ArrowLeft, ExternalLink, Play, Music, Clock, TrendingUp, Calendar, Disc } from "lucide-react"

const backendApiUrl = import.meta.env.VITE_BACKEND_URL

interface Artist {
  id: string
  name: string
  uri: string
}

interface AlbumImage {
  url: string
}

interface Album {
  total_tracks: number
  images: AlbumImage[]
  name: string
  release_date: string
}

interface Track {
  album: Album
  artists: Artist[]
  duration_ms: number
  name: string
  popularity: number
  preview_url: string | null
  external_urls: { spotify: string }
}

interface TrackDetailsProps {
  trackId: string
}

const TrackDetails: React.FC<TrackDetailsProps> = ({ trackId }) => {
  const [track, setTrack] = useState<Track | null>(null)
  const [artistImages, setArtistImages] = useState<{ [id: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!trackId) return
    setLoading(true)
    setTrack(null)
    const params = new URLSearchParams({ id: trackId })
    fetch(`${backendApiUrl}/trackdetails?${params.toString()}`, { credentials: "include" })
      .then((res) => res.json())
      .then((trackData: Track) => {
        setTrack(trackData)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching track details:", err)
        setLoading(false)
      })
  }, [trackId])

  useEffect(() => {
    if (!track || !track.artists) return
    track.artists.forEach((artist) => {
      if (artistImages[artist.id]) return
      fetch(`${backendApiUrl}/artistdetails?id=${artist.id}`, { credentials: "include" })
        .then((res) => res.json())
        .then((artistData) => {
          if (artistData && artistData.images && artistData.images.length > 0) {
            setArtistImages((prev) => ({
              ...prev,
              [artist.id]: artistData.images[0].url,
            }))
          } else {
            setArtistImages((prev) => ({
              ...prev,
              [artist.id]: "",
            }))
          }
        })
        .catch((err) => {
          console.error("Error fetching artist details:", err)
        })
    })
  }, [track])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm sm:text-base text-muted-foreground">Loading track details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardContent className="flex items-center justify-center h-[40vh]">
              <p className="text-muted-foreground">No track data found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 -ml-2 xs:ml-0">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="w-full xs:w-auto">
            <Button className="gap-2 w-full xs:w-auto">
              <ExternalLink className="w-4 h-4" />
              Open in Spotify
            </Button>
          </a>
        </div>

        {/* Hero Section */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr] gap-4 sm:gap-6 p-4 sm:p-6">
              {/* Album Artwork */}
              <div className="relative group mx-auto w-full max-w-sm md:max-w-none">
                {track.album.images[0] ? (
                  <img
                    src={track.album.images[0].url || "/placeholder.svg"}
                    alt={track.name}
                    className="w-full aspect-square object-cover rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <Music className="w-16 h-16 sm:w-24 sm:h-24 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="flex flex-col justify-center space-y-3 sm:space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2 text-xs">
                    Track
                  </Badge>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-balance leading-tight">
                    {track.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-muted-foreground">
                    {track.artists.map((artist, index) => (
                      <React.Fragment key={artist.id}>
                        <button
                          onClick={() => navigate(`/artist-details/${artist.id}`)}
                          className="text-foreground hover:text-primary transition-colors font-medium hover:underline"
                        >
                          {artist.name}
                        </button>
                        {index < track.artists.length - 1 && <span>•</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-2 sm:pt-4">
                  <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/50 rounded-lg">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm sm:text-base font-semibold truncate">{formatDuration(track.duration_ms)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/50 rounded-lg">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Popularity</p>
                      <p className="text-sm sm:text-base font-semibold truncate">{track.popularity}/100</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/50 rounded-lg">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Release Date</p>
                      <p className="text-sm sm:text-base font-semibold truncate">{track.album.release_date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/50 rounded-lg">
                    <Disc className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Album Tracks</p>
                      <p className="text-sm sm:text-base font-semibold truncate">{track.album.total_tracks}</p>
                    </div>
                  </div>
                </div>

                {/* Audio Preview */}
                {track.preview_url && (
                  <div className="pt-2 sm:pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-primary" />
                      <p className="text-sm font-medium">Preview</p>
                    </div>
                    <audio
                      controls
                      src={track.preview_url}
                      className="w-full h-10 rounded-lg"
                      style={{
                        filter: "hue-rotate(0deg) saturate(1.2)",
                      }}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Album Info */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Disc className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Album Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-start sm:items-center gap-2">
                <span className="text-sm sm:text-base text-muted-foreground">Album Name</span>
                <span className="font-medium text-sm sm:text-base text-right">{track.album.name}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-sm sm:text-base text-muted-foreground">Total Tracks</span>
                <span className="font-medium text-sm sm:text-base">{track.album.total_tracks}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-sm sm:text-base text-muted-foreground">Release Date</span>
                <span className="font-medium text-sm sm:text-base">{track.album.release_date}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artists */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Artists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {track.artists.map((artist) => (
                <button
                  key={artist.id}
                  onClick={() => navigate(`/artist-details/${artist.id}`)}
                  className="group relative overflow-hidden rounded-lg border bg-card p-3 sm:p-4 transition-all hover:shadow-lg hover:border-primary active:scale-95"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {artistImages[artist.id] && artistImages[artist.id] !== "" ? (
                      <img
                        src={artistImages[artist.id] || "/placeholder.svg"}
                        alt={artist.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-border group-hover:ring-primary transition-all shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center ring-2 ring-border group-hover:ring-primary transition-all shrink-0">
                        <Music className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors truncate">
                        {artist.name}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Artist</p>
                    </div>
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-all rotate-180 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TrackDetails
