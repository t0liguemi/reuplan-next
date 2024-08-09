-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "django_migrations" (
	"id" bigint PRIMARY KEY NOT NULL,
	"app" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"applied" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "django_content_type" (
	"id" integer PRIMARY KEY NOT NULL,
	"app_label" varchar(100) NOT NULL,
	"model" varchar(100) NOT NULL,
	CONSTRAINT "django_content_type_app_label_model_76bd3d3b_uniq" UNIQUE("app_label","model")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_evento" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" varchar(250) NOT NULL,
	"lugar" varchar(250) NOT NULL,
	"inicio" date NOT NULL,
	"final" date NOT NULL,
	"duracion" integer,
	"descripcion" varchar(2000),
	"privacidad1" boolean NOT NULL,
	"privacidad2" boolean NOT NULL,
	"privacidad3" boolean NOT NULL,
	"privacidad4" boolean NOT NULL,
	"requisitos1" boolean NOT NULL,
	"requisitos2" boolean NOT NULL,
	"requisitos3" boolean NOT NULL,
	"requisitos4" boolean NOT NULL,
	"respondidos" integer,
	"mapsQuery" boolean NOT NULL,
	"organizador_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_respuesta" (
	"id" bigint PRIMARY KEY NOT NULL,
	"fecha" date NOT NULL,
	"inicio" integer NOT NULL,
	"final" integer NOT NULL,
	"evento_id" bigint NOT NULL,
	"invitado_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_rechazado" (
	"id" bigint PRIMARY KEY NOT NULL,
	"evento_id" bigint NOT NULL,
	"invitado_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_invitacion" (
	"id" bigint PRIMARY KEY NOT NULL,
	"imprescindible" boolean NOT NULL,
	"evento_id" bigint NOT NULL,
	"invitado_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "django_admin_log" (
	"id" integer PRIMARY KEY NOT NULL,
	"action_time" timestamp with time zone NOT NULL,
	"object_id" text,
	"object_repr" varchar(200) NOT NULL,
	"action_flag" smallint NOT NULL,
	"change_message" text NOT NULL,
	"content_type_id" integer,
	"user_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authtoken_token" (
	"key" varchar(40) PRIMARY KEY NOT NULL,
	"created" timestamp with time zone NOT NULL,
	"user_id" bigint NOT NULL,
	CONSTRAINT "authtoken_token_user_id_key" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_permission" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"content_type_id" integer NOT NULL,
	"codename" varchar(100) NOT NULL,
	CONSTRAINT "auth_permission_content_type_id_codename_01ab375a_uniq" UNIQUE("content_type_id","codename")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_group" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	CONSTRAINT "auth_group_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_group_permissions" (
	"id" bigint PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	CONSTRAINT "auth_group_permissions_group_id_permission_id_0cd325b0_uniq" UNIQUE("group_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_user_groups" (
	"id" bigint PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"group_id" integer NOT NULL,
	CONSTRAINT "api_customuser_groups_customuser_id_group_id_d5b0c2ab_uniq" UNIQUE("user_id","group_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_user" (
	"id" bigint PRIMARY KEY NOT NULL,
	"password" varchar(128) NOT NULL,
	"last_login" timestamp with time zone,
	"is_superuser" boolean NOT NULL,
	"email" varchar(254) NOT NULL,
	"is_staff" boolean NOT NULL,
	"is_active" boolean NOT NULL,
	"date_joined" timestamp with time zone NOT NULL,
	"name" varchar(255),
	"username" varchar(255) NOT NULL,
	CONSTRAINT "api_customuser_email_key" UNIQUE("email"),
	CONSTRAINT "api_customuser_username_key" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_user_user_permissions" (
	"id" bigint PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"permission_id" integer NOT NULL,
	CONSTRAINT "api_customuser_user_perm_customuser_id_permission_9deacd8d_uniq" UNIQUE("user_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "django_session" (
	"session_key" varchar(40) PRIMARY KEY NOT NULL,
	"session_data" text NOT NULL,
	"expire_date" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_signupkey" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created" timestamp with time zone NOT NULL,
	"key" varchar(16) NOT NULL,
	"user_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_recoverykey" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created" timestamp with time zone NOT NULL,
	"key" varchar(8) NOT NULL,
	"attempts" integer NOT NULL,
	"user_id" bigint NOT NULL,
	"successful_attempt" boolean NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_evento" ADD CONSTRAINT "api_evento_organizador_id_api_user_id_fk" FOREIGN KEY ("organizador_id") REFERENCES "public"."api_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_respuesta" ADD CONSTRAINT "api_respuesta_evento_id_api_evento_id_fk" FOREIGN KEY ("evento_id") REFERENCES "public"."api_evento"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_respuesta" ADD CONSTRAINT "api_respuesta_invitado_id_api_user_id_fk" FOREIGN KEY ("invitado_id") REFERENCES "public"."api_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_rechazado" ADD CONSTRAINT "api_rechazado_evento_id_api_evento_id_fk" FOREIGN KEY ("evento_id") REFERENCES "public"."api_evento"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_rechazado" ADD CONSTRAINT "api_rechazado_invitado_id_api_user_id_fk" FOREIGN KEY ("invitado_id") REFERENCES "public"."api_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_invitacion" ADD CONSTRAINT "api_invitacion_evento_id_api_evento_id_fk" FOREIGN KEY ("evento_id") REFERENCES "public"."api_evento"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_invitacion" ADD CONSTRAINT "api_invitacion_invitado_id_api_user_id_fk" FOREIGN KEY ("invitado_id") REFERENCES "public"."api_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "django_admin_log" ADD CONSTRAINT "django_admin_log_content_type_id_django_content_type_id_fk" FOREIGN KEY ("content_type_id") REFERENCES "public"."django_content_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_permission" ADD CONSTRAINT "auth_permission_content_type_id_django_content_type_id_fk" FOREIGN KEY ("content_type_id") REFERENCES "public"."django_content_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_group_permissions" ADD CONSTRAINT "auth_group_permissions_group_id_auth_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."auth_group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_group_permissions" ADD CONSTRAINT "auth_group_permissions_permission_id_auth_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."auth_permission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_user_groups" ADD CONSTRAINT "api_user_groups_user_id_api_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."api_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_user_groups" ADD CONSTRAINT "api_user_groups_group_id_auth_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."auth_group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_user_user_permissions" ADD CONSTRAINT "api_user_user_permissions_user_id_api_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."api_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_user_user_permissions" ADD CONSTRAINT "api_user_user_permissions_permission_id_auth_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."auth_permission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_signupkey" ADD CONSTRAINT "api_signupkey_user_id_api_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."api_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_recoverykey" ADD CONSTRAINT "api_recoverykey_user_id_api_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."api_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_evento_organizador_id_cb70ff0a" ON "api_evento" ("organizador_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_respuesta_idEvento_id_c70dd406" ON "api_respuesta" ("evento_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_respuesta_idInvitado_id_95ef906a" ON "api_respuesta" ("invitado_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_rechazado_idEvento_id_2b3e32a4" ON "api_rechazado" ("evento_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_rechazado_idInvitado_id_3fa5012d" ON "api_rechazado" ("invitado_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_invitacion_idEvento_id_14c8ab7c" ON "api_invitacion" ("evento_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_invitacion_idInvitado_id_f4b1fd2c" ON "api_invitacion" ("invitado_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "django_admin_log_content_type_id_c4bce8eb" ON "django_admin_log" ("content_type_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "django_admin_log_user_id_c564eba6" ON "django_admin_log" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "authtoken_token_key_10f0b77e_like" ON "authtoken_token" ("key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_permission_content_type_id_2f476e4b" ON "auth_permission" ("content_type_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_group_name_a6ea08ec_like" ON "auth_group" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_group_permissions_group_id_b120cbf9" ON "auth_group_permissions" ("group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_group_permissions_permission_id_84c5c92e" ON "auth_group_permissions" ("permission_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_customuser_groups_customuser_id_9eb4b783" ON "api_user_groups" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_customuser_groups_group_id_f049027c" ON "api_user_groups" ("group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_customuser_email_18215455_like" ON "api_user" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_customuser_username_f5ae5d7f_like" ON "api_user" ("username");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_customuser_user_permissions_customuser_id_5365c9ba" ON "api_user_user_permissions" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_customuser_user_permissions_permission_id_8735d73e" ON "api_user_user_permissions" ("permission_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "django_session_session_key_c0390e0f_like" ON "django_session" ("session_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "django_session_expire_date_a5c62663" ON "django_session" ("expire_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_signupkey_user_id_afc8c36b" ON "api_signupkey" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_recoverykey_user_id_e4905ea1" ON "api_recoverykey" ("user_id");
*/