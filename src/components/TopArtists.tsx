"use client"
import React from "react"
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
  const [gridSize, setGridSize] = useState("large")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const timeRangeOptions = [
    { label: "1 Month", value: "short_term" },
    { label: "6 Months", value: "medium_term" },
    { label: "1 Year", value: "long_term" },
  ]

  const limitOptions = [10, 20, 50]
  const gridSizeOptions = [
    { label: "Large", value: "large" },
    { label: "Medium", value: "medium" },
    { label: "Small", value: "small" }
  ]

  const getGridClasses = (size: string) => {
    const baseClasses = "grid gap-3 sm:gap-4"
    const columnClasses = {
      large: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
      medium: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
      small: "grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8"
    }
    return `${baseClasses} ${columnClasses[size as keyof typeof columnClasses]}`
  }

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
            <p className="text-muted-foreground">Your most listened to artists on Spotify</p>
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

            {/* Grid Size Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Grid Size</label>
              <div className="flex gap-2">
                {gridSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGridSize(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      gridSize === option.value
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {option.label}
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
          <div className={getGridClasses(gridSize)}>
            {artists.map((artist, index) => (
              <Card
                key={artist.id}
                className="group cursor-pointer overflow-hidden transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                onClick={() => navigate(`/artist-details/${artist.id}`)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {artist.images && artist.images.length > 0 ? (
                      <img
                        src={artist.images[0].url || "/placeholder.svg"}
                        alt={artist.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-3xl sm:text-4xl font-bold text-muted-foreground">
                          {artist.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 p-2.5 sm:p-3">
                    <h3 className="font-semibold text-sm sm:text-base leading-tight line-clamp-1">{artist.name}</h3>
                    {artist.genres && artist.genres.length > 0 && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {artist.genres.slice(0, 2).join(", ")}
                      </p>
                    )}
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-primary transition-all" style={{ width: `${artist.popularity}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{artist.popularity}%</span>
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
