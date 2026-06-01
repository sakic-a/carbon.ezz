--
-- PostgreSQL database dump
--

\restrict yGN4N5ZW0z5lUhexeEF7Cm0R13sXv3Llh3AAz6WMQiB2ywxYzPhypjXymerP0vS

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-06-01 20:23:38

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 232 (class 1259 OID 33424)
-- Name: configurator_inquiries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configurator_inquiries (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    selected_model character varying(50) NOT NULL,
    wheel_shape character varying(50) NOT NULL,
    top_material character varying(50) NOT NULL,
    side_material character varying(50) NOT NULL,
    bottom_material character varying(50) NOT NULL,
    ring_enabled boolean NOT NULL,
    ring_colour character varying(50),
    thread_colour character varying(50) NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    car_model character varying(255),
    reply text
);


ALTER TABLE public.configurator_inquiries OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 33423)
-- Name: configurator_inquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.configurator_inquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configurator_inquiries_id_seq OWNER TO postgres;

--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 231
-- Name: configurator_inquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configurator_inquiries_id_seq OWNED BY public.configurator_inquiries.id;


--
-- TOC entry 230 (class 1259 OID 16998)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    message text NOT NULL,
    phone character varying(50),
    reply text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16997)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 229
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 228 (class 1259 OID 16983)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_name character varying(255),
    price numeric(10,2),
    quantity integer,
    image text
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16982)
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 227
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- TOC entry 226 (class 1259 OID 16969)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_email character varying(255) NOT NULL,
    total numeric(10,2) NOT NULL,
    shipping_address text,
    shipping_city character varying(100),
    shipping_zip character varying(20),
    shipping_country character varying(100),
    shipping_phone character varying(50),
    status character varying(50) DEFAULT 'Pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    shipping_name character varying(255)
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16968)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 225
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 224 (class 1259 OID 16953)
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    product_id integer,
    image_url text NOT NULL
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16952)
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_images_id_seq OWNER TO postgres;

--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 223
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- TOC entry 222 (class 1259 OID 16940)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    name_bs character varying(255),
    price numeric(10,2) NOT NULL,
    category character varying(50),
    image text,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16939)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 221
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 220 (class 1259 OID 16923)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'customer'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16922)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4898 (class 2604 OID 33427)
-- Name: configurator_inquiries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configurator_inquiries ALTER COLUMN id SET DEFAULT nextval('public.configurator_inquiries_id_seq'::regclass);


--
-- TOC entry 4896 (class 2604 OID 17001)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 4895 (class 2604 OID 16986)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- TOC entry 4892 (class 2604 OID 16972)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4891 (class 2604 OID 16956)
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- TOC entry 4889 (class 2604 OID 16943)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4886 (class 2604 OID 16926)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5078 (class 0 OID 33424)
-- Dependencies: 232
-- Data for Name: configurator_inquiries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configurator_inquiries (id, name, email, phone, selected_model, wheel_shape, top_material, side_material, bottom_material, ring_enabled, ring_colour, thread_colour, notes, created_at, car_model, reply) FROM stdin;
1	taida	taida@gmail.com	\N	audi	flat	alcantara	perforated	alcantara	f	red	white	\N	2026-06-01 17:15:03.639261	audi a3 2010	250
2	taida	taida@gmail.com	123	audi	factory	smooth	alcantara	alcantara	t	blue	white	\N	2026-06-01 17:29:02.552835	audi q5 2012	\N
3	taida	taida@gmail.com	061123456	audi	full	perforated	perforated	carbon	t	yellow	white	pitanje	2026-06-01 19:23:06.375212	golf 6 2012	\N
4	Admin	admin@admin.com	1	audi	full	carbon	perforated	perforated	t	blue	white	\N	2026-06-01 19:27:05.625506	a	\N
\.


--
-- TOC entry 5076 (class 0 OID 16998)
-- Dependencies: 230
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, name, email, message, phone, reply, created_at) FROM stdin;
1	aa	aa@gmail.com	pozz	061222333	\N	2025-12-30 17:43:40.934982
\.


--
-- TOC entry 5074 (class 0 OID 16983)
-- Dependencies: 228
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_name, price, quantity, image) FROM stdin;
1	1	BMW M-Performance Carbon Wheel	1299.99	1	/images/bmw-wheel.png
2	2	Mercedes AMG GT Style Wheel	1099.50	1	/images/mercedes-wheel.png
3	2	Audi RS Flat-Bottom Carbon	949.00	1	/images/audi-wheel.png
4	3	Audi RS Flat-Bottom Carbon	949.00	1	/images/audi-wheel.png
5	4	Audi a3 a4 a5 a6 a7 q5 q7	400.00	1	https://d4n0y8dshd77z.cloudfront.net/listings/70757803/lg/img-1757503301-b59af3ff3df3.jpeg
6	4	Golf 5 passat b6 eos	300.00	1	https://d4n0y8dshd77z.cloudfront.net/listings/70758031/lg/img-1757503732-d4c5cf5b6895.jpeg
7	5	Golf 8 R	599.97	1	https://d4n0y8dshd77z.cloudfront.net/listings/72379815/lg/img-1763465466-b1a347cfcf00.jpg
8	6	Golf 5 passat b6 eos	300.00	1	https://d4n0y8dshd77z.cloudfront.net/listings/70758031/lg/img-1757503732-d4c5cf5b6895.jpeg
9	7	Audi a3 a4 a5 a6 a7 q5 q7	600.00	1	https://d4n0y8dshd77z.cloudfront.net/listings/70757950/lg/img-1757503578-99178f6a4c1e.jpeg
10	8	Audi RS Flat-Bottom Carbon	949.00	1	/images/audi-wheel.png
11	9	Audi RS Flat-Bottom Carbon	949.00	1	/images/audi-wheel.png
12	10	Mercedes AMG GT Style Wheel	1099.50	1	/images/mercedes-wheel.png
13	11	BMW M-Performance Carbon Wheel	1299.99	1	/images/bmw-wheel.png
14	11	z	5.00	1	http://localhost:5001/uploads/1780237457592-96418018.jpeg
15	11	Audi Q5, Q7, Q8	999.00	1	/images/audi-q5.png
\.


--
-- TOC entry 5072 (class 0 OID 16969)
-- Dependencies: 226
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_email, total, shipping_address, shipping_city, shipping_zip, shipping_country, shipping_phone, status, created_at, shipping_name) FROM stdin;
1	ado2@gmail.com	1299.99	adresa	visoko	71300	Bosnia & Herzegovina	061555777	Pending	2025-12-30 17:40:56.779839	\N
3	adnaa@gmail.com	949.00	adresa	Sarajevo	71243	Bosnia & Herzegovina	+38760589589	Pending	2026-01-06 20:17:57.161965	Adna Sakic
5	someone@hotmail.com	599.97	adresa 25	Mostar	78000	Bosnia & Herzegovina	065369369	Pending	2026-01-07 15:45:32.362488	someone
6	someone@hotmail.com	300.00	adresa 25	Mostar	78000	Bosnia & Herzegovina	065369369	Pending	2026-01-07 15:46:16.607826	someone
7	ajla@hotmail.com	600.00	Hrasnicka cesta 15	Sarajevo	71000	Bosnia & Herzegovina	+38760456456	Pending	2026-01-07 17:33:09.856321	Adna Sakic
2	ado@gmail.com	2048.50	xx	tuzla	74000	Bosnia & Herzegovina	065456456	Approved	2026-01-06 18:51:23.218514	\N
4	adna@gmail.com	700.00	Hrasnicka cesta	Sarajevo	71000	Bosnia & Herzegovina	+38760789789	Declined	2026-01-07 15:43:37.284648	Adna Sakic
8	admin@admin.com	949.00	a	a	123	Bosnia & Herzegovina	123	Pending	2026-05-25 01:44:00.983721	a
9	adna@gmail.com	949.00	a	a	1	Bosnia & Herzegovina	1	Approved	2026-05-31 00:38:49.146368	a
10	adna@gmail.com	1099.50	a	a	1	Bosnia & Herzegovina	1	Pending	2026-05-31 00:49:37.533645	a
11	aa@aa	2303.99	mm	mm	1	Bosnia & Herzegovina	123	Pending	2026-06-01 01:20:49.281428	aa
\.


--
-- TOC entry 5070 (class 0 OID 16953)
-- Dependencies: 224
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, product_id, image_url) FROM stdin;
1	7	https://www.instagram.com/p/DR9yqJSDNh2/?img_index=4
4	11	https://d4n0y8dshd77z.cloudfront.net/listings/70757950/lg/img-1757503582-90b613423de2.jpeg
5	12	https://d4n0y8dshd77z.cloudfront.net/listings/70757803/lg/img-1757503307-31a7a96c22ba.jpeg
6	13	https://d4n0y8dshd77z.cloudfront.net/listings/70758031/lg/img-1757503743-3d739ef53e7c.jpeg
7	13	https://d4n0y8dshd77z.cloudfront.net/listings/70758031/lg/img-1757503746-899f06cd73af.jpeg
8	14	https://d4n0y8dshd77z.cloudfront.net/listings/72379815/lg/img-1763465454-7ed9af6c803f.jpg
9	14	https://d4n0y8dshd77z.cloudfront.net/listings/72379815/lg/img-1763465460-35607aed8c41.jpg
10	15	https://d4n0y8dshd77z.cloudfront.net/listings/59771797/lg/img-1711097687-e6483e30736a.jpg
11	15	https://d4n0y8dshd77z.cloudfront.net/listings/59771797/lg/img-1711097691-ecaa9c4a925b.jpg
12	15	https://d4n0y8dshd77z.cloudfront.net/listings/59771797/lg/img-1711097662-ac0d5e210c8d.jpg
\.


--
-- TOC entry 5068 (class 0 OID 16940)
-- Dependencies: 222
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, name_bs, price, category, image, description, created_at) FROM stdin;
1	BMW M-Performance Carbon Wheel	BMW M-Performance Karbonski Volan	1299.99	bmw	/images/bmw-wheel.png	Premium Alcantara and Carbon Fiber steering wheel compatible with BMW F30/F80 M3/M4. Features M-Tri stitching and ergonomic grip.	2025-12-30 15:33:07.554671
2	Audi RS Flat-Bottom Carbon	Audi RS Ravni Karbonski Volan	949.00	audi	/images/audi-wheel.png	Sporty flat-bottom design for Audi A4/A5/S4/S5 B8.5. Perforated leather grips with gloss carbon accents and RS badging.	2025-12-30 15:33:07.554671
3	Mercedes AMG GT Style Wheel	Mercedes AMG GT Stil Volan	1099.50	mercedes	/images/mercedes-wheel.png	Latest AMG GT style upgrade for Mercedes C-Class W205. Includes airbag cover, paddle shifters, and touch buttons.	2025-12-30 15:33:07.554671
4	VW Golf 7 GTI/R Carbon	VW Golf 7 GTI/R Karbon	879.99	vw	/images/vw-wheel.png	Direct replacement for Golf MK7 GTI/R. Red stitching at 12 o class clock with aggressive contoured grips for maximum control.	2025-12-30 15:33:07.554671
6	Carbon Fiber Shift Paddles	Karbonske Poluge Mjenjača	249.00	others	/images/paddles.png	Extended magnetic paddle shifters made from real dry carbon fiber. Fits various models. Provides a satisfying click and better reach.	2025-12-30 15:33:07.554671
7	Audi Q5, Q7, Q8	Audi Q5, Q7, Q8	999.00	accessories	/images/audi-q5.png		2026-01-06 21:05:02.107108
11	Audi a3 a4 a5 a6 a7 q5 q7	Audi a3 a4 a5 a6 a7 q5 q7	600.00	audi	https://d4n0y8dshd77z.cloudfront.net/listings/70757950/lg/img-1757503578-99178f6a4c1e.jpeg	flat bottom, carbon and perforated leather, red stitch	2026-01-07 02:22:20.712086
12	Audi a3 a4 a5 a6 a7 q5 q7	Audi a3 a4 a5 a6 a7 q5 q7	400.00	audi	https://d4n0y8dshd77z.cloudfront.net/listings/70757803/lg/img-1757503301-b59af3ff3df3.jpeg	modified shape, genuine and perforated leather, black stitch	2026-01-07 02:48:23.610626
13	Golf 5 passat b6 eos	Golf 5 passat b6 eos	300.00	vw	https://d4n0y8dshd77z.cloudfront.net/listings/70758031/lg/img-1757503732-d4c5cf5b6895.jpeg	modified shape, alcantara and perforated leather, yellow ring and yellow stitch	2026-01-07 02:51:02.553508
14	Golf 8 R	Golf 8 R	599.97	vw	https://d4n0y8dshd77z.cloudfront.net/listings/72379815/lg/img-1763465466-b1a347cfcf00.jpg	modified shape, alcantara x perforated leather, blue ring and blue stitch	2026-01-07 02:53:33.981875
15	Mercedes CLS modified steering wheel	Mercedes CLS modified steering wheel	600.00	mercedes	https://d4n0y8dshd77z.cloudfront.net/listings/59771797/lg/img-1711097662-ac0d5e210c8d.jpg	Preoblikovan presvucen volan mercedes e klasa cls	2026-04-21 18:46:37.820129
16	z	z	5.00	accessories	http://localhost:5001/uploads/1780237457592-96418018.jpeg		2026-05-31 16:24:29.389849
\.


--
-- TOC entry 5066 (class 0 OID 16923)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, created_at) FROM stdin;
2	ado	ado2@gmail.com	ado	customer	2025-12-30 16:58:59.157006
3	ado	ado@gmail.com	ado	customer	2026-01-06 18:50:23.615203
4	adooo	adoooo@gmail.com	ado000	customer	2026-01-06 19:29:52.831724
5	adna	adna@gmail.com	$2b$10$YwKpDDTCK2o4Q0wu3k/UX.4pVjCrp2wfMH9ui45/Lrw2BafgKb5Xq	customer	2026-01-06 19:36:57.527723
6	adnaa	adnaa@gmail.com	$2b$10$vV/Tp9s61a8r/.XU/FMCguO6XHdjj11AnilDTFRtHm/qXwtOAIq9K	customer	2026-01-06 19:56:59.752607
1	Admin	admin@admin.com	$2b$10$CGqKtb17XkATtFFkTE7LHOCsJa0tPkmnY.IKOdYXx2PwHxOdd9mg.	admin	2025-12-30 15:33:07.554671
7	Someone	someone@hotmail.com	$2b$10$mDbmash/xYPpBiquJBKho.aP6U7imC3AJAsP66ZwyvWvZwCt9s6OC	customer	2026-01-07 15:44:42.18223
8	ajla	ajla@hotmail.com	$2b$10$xc8FLVrBiO0YM/Wi94qxmeVaDqLpVvNSF7zGaX2D0o4xkw1TczNHC	customer	2026-01-07 17:32:37.094514
9	aa	aa@h	$2b$10$UIwXca3JMPHi2h.XR33HfOI7UNElz.uCE9iW3RuDQp2H8/gnP1ake	customer	2026-05-31 23:33:18.004211
10	aaa	aa@hh	$2b$10$OnDaFSGda/h5r.6vEUzL.uB0lifcVZPUhK4u7auztN.A8mmbf68S.	customer	2026-06-01 00:00:28.513672
11	ss	ss@s	$2b$10$4pfCFtzmK6PYi1N4EwLyl.157IIeVPi62SS4GBuYC8o0RVA/ncR.i	customer	2026-06-01 00:01:26.586074
12	aaA	aa@aa	$2b$10$NjmwOPLREg4kdXLRkh14jO6lL1RcvAn69d4bQ18P7wv9ctzh66cPG	customer	2026-06-01 01:15:29.584221
13	taida	taida@gmail.com	$2b$10$vb7UOo/rIiD.wE4PBAjxlepDyVzBOeH9XOInU2wBLBV63vT21repS	customer	2026-06-01 17:14:03.466503
\.


--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 231
-- Name: configurator_inquiries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configurator_inquiries_id_seq', 4, true);


--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 229
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, true);


--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 227
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 15, true);


--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 225
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 11, true);


--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 223
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 14, true);


--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 221
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 17, true);


--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 13, true);


--
-- TOC entry 4915 (class 2606 OID 33442)
-- Name: configurator_inquiries configurator_inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configurator_inquiries
    ADD CONSTRAINT configurator_inquiries_pkey PRIMARY KEY (id);


--
-- TOC entry 4913 (class 2606 OID 17010)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4911 (class 2606 OID 16991)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4909 (class 2606 OID 16981)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4907 (class 2606 OID 16962)
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 16951)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4901 (class 2606 OID 16938)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4903 (class 2606 OID 16936)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4917 (class 2606 OID 16992)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4916 (class 2606 OID 16963)
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


-- Completed on 2026-06-01 20:23:38

--
-- PostgreSQL database dump complete
--

\unrestrict yGN4N5ZW0z5lUhexeEF7Cm0R13sXv3Llh3AAz6WMQiB2ywxYzPhypjXymerP0vS
