CREATE TABLE "url" (
	"id" varchar PRIMARY KEY NOT NULL,
	"url" varchar NOT NULL,
	"short_code" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "url_url_unique" UNIQUE("url"),
	CONSTRAINT "url_short_code_unique" UNIQUE("short_code")
);
