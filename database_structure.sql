--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: barkioapi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.barkioapi (
    id integer NOT NULL,
    status boolean NOT NULL,
    "time" numeric NOT NULL
);


ALTER TABLE public.barkioapi OWNER TO postgres;

--
-- Name: barkioapi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.barkioapi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.barkioapi_id_seq OWNER TO postgres;

--
-- Name: barkioapi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.barkioapi_id_seq OWNED BY public.barkioapi.id;


--
-- Name: barkioxmpp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.barkioxmpp (
    id integer NOT NULL,
    status boolean NOT NULL,
    "time" numeric
);


ALTER TABLE public.barkioxmpp OWNER TO postgres;

--
-- Name: barkioxmpp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.barkioxmpp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.barkioxmpp_id_seq OWNER TO postgres;

--
-- Name: barkioxmpp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.barkioxmpp_id_seq OWNED BY public.barkioxmpp.id;


--
-- Name: barkioapi id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barkioapi ALTER COLUMN id SET DEFAULT nextval('public.barkioapi_id_seq'::regclass);


--
-- Name: barkioxmpp id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barkioxmpp ALTER COLUMN id SET DEFAULT nextval('public.barkioxmpp_id_seq'::regclass);


--
-- Name: barkioapi barkioapi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barkioapi
    ADD CONSTRAINT barkioapi_pkey PRIMARY KEY (id);


--
-- Name: barkioxmpp barkioxmpp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barkioxmpp
    ADD CONSTRAINT barkioxmpp_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

