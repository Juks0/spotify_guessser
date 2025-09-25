-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.friends (
  user_id character varying NOT NULL,
  friend_id character varying NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT friends_pkey PRIMARY KEY (user_id, friend_id),
  CONSTRAINT friends_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT friends_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.users(id)
);
CREATE TABLE public.game_results (
  id integer NOT NULL DEFAULT nextval('game_results_id_seq'::regclass),
  room_code character varying NOT NULL,
  player1_id character varying,
  player2_id character varying,
  player1_score integer NOT NULL,
  player2_score integer NOT NULL,
  winner_id character varying,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT game_results_pkey PRIMARY KEY (id),
  CONSTRAINT game_results_player1_id_fkey FOREIGN KEY (player1_id) REFERENCES public.users(id),
  CONSTRAINT game_results_player2_id_fkey FOREIGN KEY (player2_id) REFERENCES public.users(id),
  CONSTRAINT game_results_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_top_artists (
  user_id character varying NOT NULL,
  artist_name character varying NOT NULL,
  rank integer NOT NULL,
  time_range character varying NOT NULL CHECK (time_range::text = ANY (ARRAY['1month'::character varying, '6months'::character varying, '1year'::character varying]::text[])),
  created_at timestamp without time zone DEFAULT now(),
  artist_id character varying,
  artist_image character varying,
  genres ARRAY,
  CONSTRAINT user_top_artists_pkey PRIMARY KEY (user_id, rank, time_range),
  CONSTRAINT user_top_artists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_top_tracks (
  user_id character varying NOT NULL,
  track_name character varying NOT NULL,
  artist_name character varying NOT NULL,
  rank integer NOT NULL,
  time_range character varying NOT NULL CHECK (time_range::text = ANY (ARRAY['1month'::character varying, '6months'::character varying, '1year'::character varying]::text[])),
  created_at timestamp without time zone DEFAULT now(),
  track_id character varying,
  album_name character varying,
  duration_ms integer,
  preview_url character varying,
  track_image character varying,
  CONSTRAINT user_top_tracks_pkey PRIMARY KEY (user_id, rank, time_range),
  CONSTRAINT user_top_tracks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id character varying NOT NULL,
  username character varying NOT NULL UNIQUE,
  image character varying,
  last_login timestamp without time zone,
  display_name character varying,
  email character varying,
  country character varying,
  product character varying CHECK (product::text = ANY (ARRAY['free'::character varying, 'premium'::character varying]::text[])),
  refresh_token character varying,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
-- Optymalne indeksy
CREATE INDEX idx_user_top_artists_user_time ON user_top_artists(user_id, time_range);
CREATE INDEX idx_user_top_artists_time_rank ON user_top_artists(time_range, rank);

CREATE INDEX idx_user_top_tracks_user_time ON user_top_tracks(user_id, time_range);  
CREATE INDEX idx_user_top_tracks_time_rank ON user_top_tracks(time_range, rank);

CREATE INDEX idx_friends_user ON friends(user_id);
CREATE INDEX idx_friends_friend ON friends(friend_id);

CREATE INDEX idx_game_results_player1 ON game_results(player1_id);
CREATE INDEX idx_game_results_player2 ON game_results(player2_id);
CREATE INDEX idx_game_results_created ON game_results(created_at DESC);
