"use client"
import React from 'react';
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"

const backendApiUrl = import.meta.env.VITE_BACKEND_URL

interface Artist {
  id: string
  name: string
  images: { url: string }[]
  genres: string[]
  popularity: number
}

const TopArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([])
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

    fetch(`${backendApiUrl}/topartists?${params.toString()}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setArtists(Array.isArray(data.items) ? data.items : [])
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Top Artists</h1>
            <p className="text-muted-foreground">Your most played artists on Spotify</p>
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

        {/* Artists Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading your top artists...</p>
            </div>
          </div>
        ) : artists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {artists.map((artist, index) => (
              <Card
                key={artist.id}
                className="group cursor-pointer overflow-hidden transition-all hover:shadow-xl hover:scale-105 hover:border-primary/50"
                onClick={() => navigate(`/artist-details/${artist.id}`)}
              >
                <CardContent className="p-0">
                  {/* Artist Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {artist.images && artist.images.length > 0 ? (
                      <>
                        <img
                          src={artist.images[0].url || "/placeholder.svg"}
                          alt={artist.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Rank Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-primary text-primary-foreground font-bold text-lg px-3 py-1">
                            #{index + 1}
                          </Badge>
                        </div>

                        {/* Play Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-primary-foreground ml-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl font-bold text-primary">{artist.name.charAt(0)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">No Image</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Artist Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {artist.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {artist.genres && artist.genres.length > 0 ? artist.genres.slice(0, 2).join(", ") : "No genres"}
                      </p>
                    </div>

                    {/* Popularity Meter */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Popularity</span>
                        <span className="font-medium text-foreground">{artist.popularity}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all"
                          style={{ width: `${artist.popularity}%` }}
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
              <p className="text-lg font-medium text-foreground">No artists found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopArtists
