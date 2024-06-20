--
-- PostgreSQL database dump
--

-- Dumped from database version 13.14 (Debian 13.14-0+deb11u1)
-- Dumped by pg_dump version 15.4

-- Started on 2024-06-20 11:18:26

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
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 202 (class 1259 OID 16452)
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    tag_id integer NOT NULL,
    tag_name character varying(255)
);


--
-- TOC entry 201 (class 1259 OID 16450)
-- Name: categories_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3014 (class 0 OID 0)
-- Dependencies: 201
-- Name: categories_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_tag_id_seq OWNED BY public.categories.tag_id;


--
-- TOC entry 205 (class 1259 OID 16490)
-- Name: mock_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mock_categories (
    tag_id integer NOT NULL,
    tag_name character varying(255)
);


--
-- TOC entry 204 (class 1259 OID 16488)
-- Name: mock_categories_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mock_categories_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3015 (class 0 OID 0)
-- Dependencies: 204
-- Name: mock_categories_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mock_categories_tag_id_seq OWNED BY public.mock_categories.tag_id;


--
-- TOC entry 200 (class 1259 OID 16385)
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    product_id character varying(255) NOT NULL,
    name character varying(255),
    price numeric,
    per character varying(255)
);


--
-- TOC entry 203 (class 1259 OID 16467)
-- Name: tag_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tag_products (
    product_id character varying(255),
    tag_id integer
);


--
-- TOC entry 2868 (class 2604 OID 16455)
-- Name: categories tag_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN tag_id SET DEFAULT nextval('public.categories_tag_id_seq'::regclass);


--
-- TOC entry 2869 (class 2604 OID 16493)
-- Name: mock_categories tag_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mock_categories ALTER COLUMN tag_id SET DEFAULT nextval('public.mock_categories_tag_id_seq'::regclass);


--
-- TOC entry 2873 (class 2606 OID 16457)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (tag_id);


--
-- TOC entry 2875 (class 2606 OID 16495)
-- Name: mock_categories mock_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mock_categories
    ADD CONSTRAINT mock_categories_pkey PRIMARY KEY (tag_id);


--
-- TOC entry 2871 (class 2606 OID 16429)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- TOC entry 2876 (class 2606 OID 16470)
-- Name: tag_products tag_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag_products
    ADD CONSTRAINT tag_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 2877 (class 2606 OID 16541)
-- Name: tag_products tag_products_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag_products
    ADD CONSTRAINT tag_products_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.categories(tag_id);


--
-- TOC entry 3013 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2024-06-20 11:18:29

--
-- PostgreSQL database dump complete
--

