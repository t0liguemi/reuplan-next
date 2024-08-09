import { pgTable, bigint, varchar, timestamp, unique, integer, index, foreignKey, date, boolean, text, smallint } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const django_migrations = pgTable("django_migrations", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	app: varchar("app", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	applied: timestamp("applied", { withTimezone: true, mode: 'string' }).notNull(),
});

export const django_content_type = pgTable("django_content_type", {
	id: integer("id").primaryKey().notNull(),
	app_label: varchar("app_label", { length: 100 }).notNull(),
	model: varchar("model", { length: 100 }).notNull(),
},
(table) => {
	return {
		django_content_type_app_label_model_76bd3d3b_uniq: unique("django_content_type_app_label_model_76bd3d3b_uniq").on(table.app_label, table.model),
	}
});

export const api_evento = pgTable("api_evento", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	name: varchar("name", { length: 250 }).notNull(),
	lugar: varchar("lugar", { length: 250 }).notNull(),
	inicio: date("inicio").notNull(),
	final: date("final").notNull(),
	duracion: integer("duracion"),
	descripcion: varchar("descripcion", { length: 2000 }),
	privacidad1: boolean("privacidad1").notNull(),
	privacidad2: boolean("privacidad2").notNull(),
	privacidad3: boolean("privacidad3").notNull(),
	privacidad4: boolean("privacidad4").notNull(),
	requisitos1: boolean("requisitos1").notNull(),
	requisitos2: boolean("requisitos2").notNull(),
	requisitos3: boolean("requisitos3").notNull(),
	requisitos4: boolean("requisitos4").notNull(),
	respondidos: integer("respondidos"),
	mapsQuery: boolean("mapsQuery").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	organizador_id: bigint("organizador_id", { mode: "number" }).notNull().references(() => api_user.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		organizador_id_cb70ff0a: index("api_evento_organizador_id_cb70ff0a").on(table.organizador_id),
	}
});

export const api_respuesta = pgTable("api_respuesta", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	fecha: date("fecha").notNull(),
	inicio: integer("inicio").notNull(),
	final: integer("final").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	evento_id: bigint("evento_id", { mode: "number" }).notNull().references(() => api_evento.id, { onDelete: "cascade" } ),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	invitado_id: bigint("invitado_id", { mode: "number" }).notNull().references(() => api_user.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idEvento_id_c70dd406: index("api_respuesta_idEvento_id_c70dd406").on(table.evento_id),
		idInvitado_id_95ef906a: index("api_respuesta_idInvitado_id_95ef906a").on(table.invitado_id),
	}
});

export const api_rechazado = pgTable("api_rechazado", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	evento_id: bigint("evento_id", { mode: "number" }).notNull().references(() => api_evento.id, { onDelete: "cascade" } ),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	invitado_id: bigint("invitado_id", { mode: "number" }).notNull().references(() => api_user.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idEvento_id_2b3e32a4: index("api_rechazado_idEvento_id_2b3e32a4").on(table.evento_id),
		idInvitado_id_3fa5012d: index("api_rechazado_idInvitado_id_3fa5012d").on(table.invitado_id),
	}
});

export const api_invitacion = pgTable("api_invitacion", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	imprescindible: boolean("imprescindible").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	evento_id: bigint("evento_id", { mode: "number" }).notNull().references(() => api_evento.id, { onDelete: "cascade" } ),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	invitado_id: bigint("invitado_id", { mode: "number" }).notNull().references(() => api_user.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idEvento_id_14c8ab7c: index("api_invitacion_idEvento_id_14c8ab7c").on(table.evento_id),
		idInvitado_id_f4b1fd2c: index("api_invitacion_idInvitado_id_f4b1fd2c").on(table.invitado_id),
	}
});

export const django_admin_log = pgTable("django_admin_log", {
	id: integer("id").primaryKey().notNull(),
	action_time: timestamp("action_time", { withTimezone: true, mode: 'string' }).notNull(),
	object_id: text("object_id"),
	object_repr: varchar("object_repr", { length: 200 }).notNull(),
	action_flag: smallint("action_flag").notNull(),
	change_message: text("change_message").notNull(),
	content_type_id: integer("content_type_id").references(() => django_content_type.id),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	user_id: bigint("user_id", { mode: "number" }).notNull(),
},
(table) => {
	return {
		content_type_id_c4bce8eb: index("django_admin_log_content_type_id_c4bce8eb").on(table.content_type_id),
		user_id_c564eba6: index("django_admin_log_user_id_c564eba6").on(table.user_id),
	}
});

export const authtoken_token = pgTable("authtoken_token", {
	key: varchar("key", { length: 40 }).primaryKey().notNull(),
	created: timestamp("created", { withTimezone: true, mode: 'string' }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	user_id: bigint("user_id", { mode: "number" }).notNull(),
},
(table) => {
	return {
		key_10f0b77e_like: index("authtoken_token_key_10f0b77e_like").on(table.key),
		authtoken_token_user_id_key: unique("authtoken_token_user_id_key").on(table.user_id),
	}
});

export const auth_permission = pgTable("auth_permission", {
	id: integer("id").primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	content_type_id: integer("content_type_id").notNull().references(() => django_content_type.id),
	codename: varchar("codename", { length: 100 }).notNull(),
},
(table) => {
	return {
		content_type_id_2f476e4b: index("auth_permission_content_type_id_2f476e4b").on(table.content_type_id),
		auth_permission_content_type_id_codename_01ab375a_uniq: unique("auth_permission_content_type_id_codename_01ab375a_uniq").on(table.content_type_id, table.codename),
	}
});

export const auth_group = pgTable("auth_group", {
	id: integer("id").primaryKey().notNull(),
	name: varchar("name", { length: 150 }).notNull(),
},
(table) => {
	return {
		name_a6ea08ec_like: index("auth_group_name_a6ea08ec_like").on(table.name),
		auth_group_name_key: unique("auth_group_name_key").on(table.name),
	}
});

export const auth_group_permissions = pgTable("auth_group_permissions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	group_id: integer("group_id").notNull().references(() => auth_group.id),
	permission_id: integer("permission_id").notNull().references(() => auth_permission.id),
},
(table) => {
	return {
		group_id_b120cbf9: index("auth_group_permissions_group_id_b120cbf9").on(table.group_id),
		permission_id_84c5c92e: index("auth_group_permissions_permission_id_84c5c92e").on(table.permission_id),
		auth_group_permissions_group_id_permission_id_0cd325b0_uniq: unique("auth_group_permissions_group_id_permission_id_0cd325b0_uniq").on(table.group_id, table.permission_id),
	}
});

export const api_user_groups = pgTable("api_user_groups", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	user_id: bigint("user_id", { mode: "number" }).notNull().references(() => api_user.id),
	group_id: integer("group_id").notNull().references(() => auth_group.id),
},
(table) => {
	return {
		api_customuser_groups_customuser_id_9eb4b783: index("api_customuser_groups_customuser_id_9eb4b783").on(table.user_id),
		api_customuser_groups_group_id_f049027c: index("api_customuser_groups_group_id_f049027c").on(table.group_id),
		api_customuser_groups_customuser_id_group_id_d5b0c2ab_uniq: unique("api_customuser_groups_customuser_id_group_id_d5b0c2ab_uniq").on(table.user_id, table.group_id),
	}
});

export const api_user = pgTable("api_user", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	password: varchar("password", { length: 128 }).notNull(),
	last_login: timestamp("last_login", { withTimezone: true, mode: 'string' }),
	is_superuser: boolean("is_superuser").notNull(),
	email: varchar("email", { length: 254 }).notNull(),
	is_staff: boolean("is_staff").notNull(),
	is_active: boolean("is_active").notNull(),
	date_joined: timestamp("date_joined", { withTimezone: true, mode: 'string' }).notNull(),
	name: varchar("name", { length: 255 }),
	username: varchar("username", { length: 255 }).notNull(),
},
(table) => {
	return {
		api_customuser_email_18215455_like: index("api_customuser_email_18215455_like").on(table.email),
		api_customuser_username_f5ae5d7f_like: index("api_customuser_username_f5ae5d7f_like").on(table.username),
		api_customuser_email_key: unique("api_customuser_email_key").on(table.email),
		api_customuser_username_key: unique("api_customuser_username_key").on(table.username),
	}
});

export const api_user_user_permissions = pgTable("api_user_user_permissions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	user_id: bigint("user_id", { mode: "number" }).notNull().references(() => api_user.id),
	permission_id: integer("permission_id").notNull().references(() => auth_permission.id),
},
(table) => {
	return {
		api_customuser_user_permissions_customuser_id_5365c9ba: index("api_customuser_user_permissions_customuser_id_5365c9ba").on(table.user_id),
		api_customuser_user_permissions_permission_id_8735d73e: index("api_customuser_user_permissions_permission_id_8735d73e").on(table.permission_id),
		api_customuser_user_perm_customuser_id_permission_9deacd8d_uniq: unique("api_customuser_user_perm_customuser_id_permission_9deacd8d_uniq").on(table.user_id, table.permission_id),
	}
});

export const django_session = pgTable("django_session", {
	session_key: varchar("session_key", { length: 40 }).primaryKey().notNull(),
	session_data: text("session_data").notNull(),
	expire_date: timestamp("expire_date", { withTimezone: true, mode: 'string' }).notNull(),
},
(table) => {
	return {
		session_key_c0390e0f_like: index("django_session_session_key_c0390e0f_like").on(table.session_key),
		expire_date_a5c62663: index("django_session_expire_date_a5c62663").on(table.expire_date),
	}
});

export const api_signupkey = pgTable("api_signupkey", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	created: timestamp("created", { withTimezone: true, mode: 'string' }).notNull(),
	key: varchar("key", { length: 16 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	user_id: bigint("user_id", { mode: "number" }).notNull().references(() => api_user.id),
},
(table) => {
	return {
		user_id_afc8c36b: index("api_signupkey_user_id_afc8c36b").on(table.user_id),
	}
});

export const api_recoverykey = pgTable("api_recoverykey", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	created: timestamp("created", { withTimezone: true, mode: 'string' }).notNull(),
	key: varchar("key", { length: 8 }).notNull(),
	attempts: integer("attempts").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	user_id: bigint("user_id", { mode: "number" }).notNull().references(() => api_user.id),
	successful_attempt: boolean("successful_attempt").notNull(),
},
(table) => {
	return {
		user_id_e4905ea1: index("api_recoverykey_user_id_e4905ea1").on(table.user_id),
	}
});