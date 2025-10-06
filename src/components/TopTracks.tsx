"use client"
import React from 'react';
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"

const backendApiUrl = import.meta.env.VITE_BACKEND_URL

interface Track {
  id: string
  name: string
  album: {
    images: { url: string }[]
    name: string
  }
  artists: { name: string }[]
  popularity: number
}

const TopTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([])
  const [timeRange, setTimeRange] = useState("medium_term")
  const [limit, setLimit] = useState(20)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const timeRangeOptions = [
    { label: "1 Month", value: "short_term" },
    { label: "6 Months", value: "medium_term" },
    { label: "1 Year", value: "long_term" },
  ]

  const limitOptions = [10, 20, 50]

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({
      time_range: timeRange,
      limit: limit.toString(),
    })

    fetch(`${backendApiUrl}/toptracks?${params.toString()}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setTracks(Array.isArray(data.items) ? data.items : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [timeRange, limit])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Top Tracks</h1>
            <p className="text-muted-foreground">Your most played tracks on Spotify</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Time Range Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Time Range</label>
              <div className="flex gap-2">
                {timeRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimeRange(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      timeRange === option.value
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Limit Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Show</label>
              <div className="flex gap-2">
                {limitOptions.map((n) => (
                  <button
                    key={n}
                    onClick={() => setLimit(n)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      limit === n
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tracks Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading your top tracks...</p>
            </div>
          </div>
        ) : tracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tracks.map((track, index) => (
              <Card
                key={track.id}
                className="group cursor-pointer overflow-hidden transition-all duration-500 ease-in-out hover:shadow-xl hover:scale-105 hover:border-primary/50"
                onClick={() => navigate(`/track-details/${track.id}`)}
              >
                <CardContent className="p-0">
                  {/* Album Art */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {track.album.images && track.album.images.length > 0 ? (
                      <>
                        <img
                          src={track.album.images[0].url || "/placeholder.svg"}
                          alt={track.name}
                          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />

                        {/* Rank Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-primary text-primary-foreground font-bold text-lg px-3 py-1">
                            #{index + 1}
                          </Badge>
                        </div>

                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-500 ease-in-out">
                        {track.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {track.artists.map((a) => a.name).join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground/70 line-clamp-1 mt-1">{track.album.name}</p>
                    </div>

                    {/* Popularity Meter */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Popularity</span>
                        <span className="font-medium text-foreground">{track.popularity}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all"
                          style={{ width: `${track.popularity}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-foreground">No tracks found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopTracks
