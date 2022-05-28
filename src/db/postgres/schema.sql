-- Table: public.url

-- DROP TABLE public.url;

DROP DATABASE IF EXISTS 'url-shortener-test';
CREATE DATABASE 'url-shortener-test';

CREATE TABLE public.url
(
    id character varying(16) COLLATE pg_catalog."default" NOT NULL,
    original_url character varying(1024) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL,
    expire_at timestamp with time zone NOT NULL,
    CONSTRAINT url_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.url
    OWNER to root;