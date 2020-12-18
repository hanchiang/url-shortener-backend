-- Table: public.url

-- DROP TABLE public.url;

CREATE TABLE public.url
(
    created_at date NOT NULL,
    id character varying(16)[] COLLATE pg_catalog."default" NOT NULL,
    original_url character varying(1024)[] COLLATE pg_catalog."default" NOT NULL,
    updated_at date NOT NULL,
    CONSTRAINT url_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.url
    OWNER to root;