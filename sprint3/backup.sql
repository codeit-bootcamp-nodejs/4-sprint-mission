--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: test_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO test_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: test_user
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Article; Type: TABLE; Schema: public; Owner: test_user
--

CREATE TABLE public."Article" (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Article" OWNER TO test_user;

--
-- Name: Article_id_seq; Type: SEQUENCE; Schema: public; Owner: test_user
--

CREATE SEQUENCE public."Article_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Article_id_seq" OWNER TO test_user;

--
-- Name: Article_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test_user
--

ALTER SEQUENCE public."Article_id_seq" OWNED BY public."Article".id;


--
-- Name: Comment; Type: TABLE; Schema: public; Owner: test_user
--

CREATE TABLE public."Comment" (
    id integer NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "productId" integer,
    "articleId" integer
);


ALTER TABLE public."Comment" OWNER TO test_user;

--
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: test_user
--

CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comment_id_seq" OWNER TO test_user;

--
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test_user
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- Name: Product; Type: TABLE; Schema: public; Owner: test_user
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    price integer NOT NULL,
    tags text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO test_user;

--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: test_user
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Product_id_seq" OWNER TO test_user;

--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test_user
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: test_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO test_user;

--
-- Name: Article id; Type: DEFAULT; Schema: public; Owner: test_user
--

ALTER TABLE ONLY public."Article" ALTER COLUMN id SET DEFAULT nextval('public."Article_id_seq"'::regclass);


--
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: test_user
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: test_user
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Data for Name: Article; Type: TABLE DATA; Schema: public; Owner: test_user
--

COPY public."Article" (id, title, content, "createdAt", "updatedAt") FROM stdin;
3	테스트 제목	테스트 내용	2025-08-06 01:38:33.296	2025-08-06 01:38:33.296
4	테스트 제목4	테스트 내용4	2025-08-06 01:39:05.018	2025-08-06 01:39:05.018
5	Hi	Hello	2025-08-06 01:39:56.023	2025-08-06 01:39:56.023
6	테스트6	내용	2025-08-07 04:37:45.941	2025-08-07 04:57:09.546
8	테스트5	내용입니다	2025-08-07 05:09:29.659	2025-08-07 05:09:29.659
9	테스트6	내용입니다	2025-08-07 05:09:34.558	2025-08-07 05:09:34.558
10	테스트 제목	내용입니다 	2025-08-07 07:33:03.121	2025-08-07 07:33:03.121
11	샘플 제목2		2025-08-08 01:18:56.702	2025-08-08 01:52:49.155
12	샘플 제목2	샘플 내용2	2025-08-08 02:12:05.302	2025-08-08 02:12:22.001
14	게시글	내용	2025-08-08 09:02:42.408	2025-08-08 09:02:42.408
15	게시글	내용	2025-08-08 09:03:00.158	2025-08-08 09:03:00.158
16	테스트 제목2	테스트 내용2	2025-08-11 00:47:16.868	2025-08-11 00:48:16.023
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: test_user
--

COPY public."Comment" (id, content, "createdAt", "updatedAt", "productId", "articleId") FROM stdin;
2	너무좋아요!	2025-08-06 05:24:08.519	2025-08-06 05:24:08.519	3	\N
1	좋습니다!	2025-08-06 05:10:58.344	2025-08-06 06:14:21.276	3	\N
5	너무좋아요!	2025-08-06 07:50:12.191	2025-08-06 07:50:12.191	4	\N
6	너무좋아요!	2025-08-06 08:01:24.657	2025-08-06 08:01:24.657	4	\N
7	너무좋아요!	2025-08-06 08:01:40.333	2025-08-06 08:01:40.333	4	\N
8	너무좋아요!	2025-08-06 08:02:36.852	2025-08-06 08:02:36.852	4	\N
9	이 제품 정말 좋네요!	2025-08-07 02:31:42.926	2025-08-07 02:31:42.926	5	\N
11	Good	2025-08-07 02:43:40.353	2025-08-07 02:43:40.353	5	\N
12	이 글에 대한 댓글입니다.	2025-08-07 05:15:58.947	2025-08-07 05:15:58.947	\N	3
13	이 글에 대한 댓글입니다1.	2025-08-07 05:16:14.065	2025-08-07 05:16:14.065	\N	3
14	이 글에 대한 댓글입니다3.	2025-08-07 05:16:16.983	2025-08-07 05:16:16.983	\N	3
16	이 글에 대한 댓글입니다2.	2025-08-07 05:16:31.836	2025-08-07 05:16:31.836	\N	4
15	이 글에 대한 댓글입니다5.	2025-08-07 05:16:25.646	2025-08-07 05:17:40.273	\N	4
18	좋은 상품이네요!	2025-08-07 07:49:51.684	2025-08-07 07:49:51.684	5	\N
19	하하하하	2025-08-07 07:52:15.335	2025-08-07 07:52:15.335	10	\N
22	댓글 내용	2025-08-08 07:16:11.186	2025-08-08 07:16:11.186	\N	12
24	댓글 내용	2025-08-08 07:16:17.937	2025-08-08 07:16:17.937	\N	12
28	댓글 내용	2025-08-08 07:16:19.445	2025-08-08 07:16:19.445	\N	12
23	댓글 내용111	2025-08-08 07:16:14.72	2025-08-08 07:17:15.815	\N	12
29	새로운 댓글	2025-08-08 08:06:00.388	2025-08-08 08:06:00.388	14	\N
30	새로운 댓글	2025-08-08 08:06:15.502	2025-08-08 08:06:15.502	14	\N
31	새로운 댓글	2025-08-08 08:06:17.438	2025-08-08 08:06:17.438	14	\N
32	새로운 댓글	2025-08-08 08:06:17.81	2025-08-08 08:06:17.81	14	\N
33	새로운 댓글	2025-08-08 08:06:18.124	2025-08-08 08:26:48.306	14	\N
25	댓글345	2025-08-08 07:16:18.34	2025-08-11 02:19:03.903	\N	12
38	댓글789	2025-08-11 02:27:46.822	2025-08-11 02:27:46.822	14	\N
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: test_user
--

COPY public."Product" (id, name, description, price, tags, "createdAt", "updatedAt") FROM stdin;
2	상품명	상품설명	10000	{태그1,태그2}	2025-08-05 09:26:00.066	2025-08-05 09:26:00.066
3	S25	상품설명	10000	{태그1,태그2}	2025-08-05 09:37:53.181	2025-08-05 09:37:53.181
5	iphone16	스마트폰	100000	{tag1,tag2}	2025-08-06 05:03:46.266	2025-08-06 05:03:46.266
4	S25	스마트폰	50000	{newTag1,newTag2}	2025-08-05 09:48:10.601	2025-08-06 05:08:18.28
6	ipad	smart	150000	{"",""}	2025-08-07 06:33:01.792	2025-08-07 06:33:01.792
7	ipad	smart	150000	{"",""}	2025-08-07 06:33:40.395	2025-08-07 06:33:40.395
9	ipad	\N	150000	{}	2025-08-07 06:50:37.336	2025-08-07 06:50:37.336
10	ipad	\N	150000	\N	2025-08-07 06:52:28.024	2025-08-07 06:52:28.024
8	ipad2	smart	250000	{}	2025-08-07 06:40:18.59	2025-08-07 07:31:17.859
11	ipad3	smart	300000	{}	2025-08-07 07:30:09.745	2025-08-07 09:53:54.731
12	예시 상품	설명	20000	{샘플}	2025-08-07 09:31:03.791	2025-08-08 02:16:36.933
14	예시상품	상품설명입니다	10000	{tag1}	2025-08-08 05:44:37.678	2025-08-08 05:44:37.678
16	상품	\N	10000	{tag1,tag2}	2025-08-08 09:02:42.432	2025-08-08 09:02:42.432
17	상품	\N	10000	{tag1,tag2}	2025-08-08 09:03:00.164	2025-08-08 09:03:00.164
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: test_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
dc610b49-1c9c-4589-b69a-bee2755ac988	6e1339a0f049b5b819f31f48e39ee0a51952fafe92bd01bd83c1541f21a242a9	2025-08-05 17:20:05.868709+09	20250805082005_sprint3	\N	\N	2025-08-05 17:20:05.807861+09	1
\.


--
-- Name: Article_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test_user
--

SELECT pg_catalog.setval('public."Article_id_seq"', 16, true);


--
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test_user
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 38, true);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test_user
--

SELECT pg_catalog.setval('public."Product_id_seq"', 18, true);


--
-- Name: Article Article_pkey; Type: CONSTRAINT; Schema: public; Owner: test_user
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: test_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: test_user
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: test_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Comment Comment_articleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: test_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES public."Article"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: test_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: test_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

