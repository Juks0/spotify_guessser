"use client"
import React from "react"
import { Component } from "react"
import type { NavigateFunction } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { ArrowLeft, ExternalLink, Music, Users } from "lucide-react"

const backendApiUrl = import.meta.env.VITE_BACKEND_URL

interface ArtistImage {
  url: string
}

interface Album {
  images: ArtistImage[]
}

interface Track {
  id: string
  name: string
  album: Album
}

interface ArtistDetailsProps {
  artistId: string
  navigate?: NavigateFunction
}

interface ArtistDetailsState {
  artist: {
    name: string
    images: ArtistImage[]
    followers: { total: number }
    popularity: number
    external_urls: { spotify: string }
  } | null
  topSongs: Track[]
  loading: boolean
  songsLoading: boolean
}

class ArtistDetails extends Component<ArtistDetailsProps, ArtistDetailsState> {
  state: ArtistDetailsState = {
    artist: null,
    topSongs: [],
    loading: true,
    songsLoading: true,
  }

  componentDidMount(): void {
    this.fetchArtist()
  }

  componentDidUpdate(prevProps: ArtistDetailsProps): void {
    if (this.props.artistId !== prevProps.artistId) {
      this.fetchArtist()
    }
  }

  fetchArtist() {
    const { artistId } = this.props
    this.setState({ loading: true, artist: null, songsLoading: true, topSongs: [] })

    fetch(`${backendApiUrl}/artistdetails?id=${artistId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((artistData) => {
        this.setState({ artist: artistData, loading: false })
      })
      .catch((err) => {
        console.error("Error fetching artist details:", err)
        this.setState({ loading: false })
      })

    fetch(`${backendApiUrl}/artisttopsongs?id=${artistId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((songsData) => {
        this.setState({ topSongs: songsData.tracks || [], songsLoading: false })
      })
      .catch((err) => {
        console.error("Error fetching artist top songs:", err)
        this.setState({ songsLoading: false })
      })
  }

  render() {
    const { artist, loading, topSongs, songsLoading } = this.state
    const { navigate } = this.props

    if (loading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm sm:text-base">Loading artist details...</p>
          </div>
        </div>
      )
    }

    if (!artist) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No artist data found.</p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate && navigate(-1)}
              className="hover:bg-accent shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground truncate">{artist.name}</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Hero Section - Artist Image */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-0">
                  {artist.images && artist.images[0] ? (
                    <img
                      src={artist.images[0].url || "/placeholder.svg"}
                      alt={artist.name}
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-muted flex items-center justify-center">
                      <Music className="w-16 h-16 sm:w-24 sm:h-24 text-muted-foreground/30" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground h-11 sm:h-10"
                onClick={() => window.open(artist.external_urls.spotify, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Spotify
              </Button>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-colors">
                  <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 sm:p-3 rounded-lg bg-primary/10 shrink-0">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">Followers</p>
                        <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                          {artist.followers.total.toLocaleString("pl-PL")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-colors">
                  <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 sm:p-3 rounded-lg bg-primary/10 shrink-0">
                        <Music className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">Popularity</p>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${artist.popularity}%` }}
                            />
                          </div>
                          <span className="text-base sm:text-lg font-bold text-foreground min-w-[2.5ch] sm:min-w-[3ch]">
                            {artist.popularity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Songs Section */}
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Top Songs</CardTitle>
                </CardHeader>
                <CardContent>
                  {songsLoading ? (
                    <div className="flex items-center justify-center py-8 sm:py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs sm:text-sm text-muted-foreground">Loading top songs...</p>
                      </div>
                    </div>
                  ) : topSongs.length > 0 ? (
                    <div className="space-y-2">
                      {topSongs.map((song, index) => (
                        <div
                          key={song.id}
                          onClick={() => navigate && navigate(`/track-details/${song.id}`)}
                          className="group flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Badge
                            variant="secondary"
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shrink-0 text-xs sm:text-sm"
                          >
                            {index + 1}
                          </Badge>
                          {song.album?.images?.[0] ? (
                            <img
                              src={song.album.images[0].url || "/placeholder.svg"}
                              alt={song.name}
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-md object-cover shrink-0 group-hover:shadow-lg transition-shadow"
                            />
                          ) : (
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-muted flex items-center justify-center shrink-0">
                              <Music className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm sm:text-base text-foreground truncate group-hover:text-primary transition-colors">
                              {song.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <Music className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-sm sm:text-base text-muted-foreground">No top songs found.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ArtistDetails
