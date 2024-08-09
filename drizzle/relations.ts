import { relations } from "drizzle-orm/relations";
import { api_user, api_evento, api_respuesta, api_rechazado, api_invitacion, django_content_type, django_admin_log, auth_permission, auth_group, auth_group_permissions, api_user_groups, api_user_user_permissions, api_signupkey, api_recoverykey } from "./schema";

export const api_eventoRelations = relations(api_evento, ({one, many}) => ({
	api_user: one(api_user, {
		fields: [api_evento.organizador_id],
		references: [api_user.id]
	}),
	api_respuestas: many(api_respuesta),
	api_rechazados: many(api_rechazado),
	api_invitacions: many(api_invitacion),
}));

export const api_userRelations = relations(api_user, ({many}) => ({
	api_eventos: many(api_evento),
	api_respuestas: many(api_respuesta),
	api_rechazados: many(api_rechazado),
	api_invitacions: many(api_invitacion),
	api_user_groups: many(api_user_groups),
	api_user_user_permissions: many(api_user_user_permissions),
	api_signupkeys: many(api_signupkey),
	api_recoverykeys: many(api_recoverykey),
}));

export const api_respuestaRelations = relations(api_respuesta, ({one}) => ({
	api_evento: one(api_evento, {
		fields: [api_respuesta.evento_id],
		references: [api_evento.id]
	}),
	api_user: one(api_user, {
		fields: [api_respuesta.invitado_id],
		references: [api_user.id]
	}),
}));

export const api_rechazadoRelations = relations(api_rechazado, ({one}) => ({
	api_evento: one(api_evento, {
		fields: [api_rechazado.evento_id],
		references: [api_evento.id]
	}),
	api_user: one(api_user, {
		fields: [api_rechazado.invitado_id],
		references: [api_user.id]
	}),
}));

export const api_invitacionRelations = relations(api_invitacion, ({one}) => ({
	api_evento: one(api_evento, {
		fields: [api_invitacion.evento_id],
		references: [api_evento.id]
	}),
	api_user: one(api_user, {
		fields: [api_invitacion.invitado_id],
		references: [api_user.id]
	}),
}));

export const django_admin_logRelations = relations(django_admin_log, ({one}) => ({
	django_content_type: one(django_content_type, {
		fields: [django_admin_log.content_type_id],
		references: [django_content_type.id]
	}),
}));

export const django_content_typeRelations = relations(django_content_type, ({many}) => ({
	django_admin_logs: many(django_admin_log),
	auth_permissions: many(auth_permission),
}));

export const auth_permissionRelations = relations(auth_permission, ({one, many}) => ({
	django_content_type: one(django_content_type, {
		fields: [auth_permission.content_type_id],
		references: [django_content_type.id]
	}),
	auth_group_permissions: many(auth_group_permissions),
	api_user_user_permissions: many(api_user_user_permissions),
}));

export const auth_group_permissionsRelations = relations(auth_group_permissions, ({one}) => ({
	auth_group: one(auth_group, {
		fields: [auth_group_permissions.group_id],
		references: [auth_group.id]
	}),
	auth_permission: one(auth_permission, {
		fields: [auth_group_permissions.permission_id],
		references: [auth_permission.id]
	}),
}));

export const auth_groupRelations = relations(auth_group, ({many}) => ({
	auth_group_permissions: many(auth_group_permissions),
	api_user_groups: many(api_user_groups),
}));

export const api_user_groupsRelations = relations(api_user_groups, ({one}) => ({
	api_user: one(api_user, {
		fields: [api_user_groups.user_id],
		references: [api_user.id]
	}),
	auth_group: one(auth_group, {
		fields: [api_user_groups.group_id],
		references: [auth_group.id]
	}),
}));

export const api_user_user_permissionsRelations = relations(api_user_user_permissions, ({one}) => ({
	api_user: one(api_user, {
		fields: [api_user_user_permissions.user_id],
		references: [api_user.id]
	}),
	auth_permission: one(auth_permission, {
		fields: [api_user_user_permissions.permission_id],
		references: [auth_permission.id]
	}),
}));

export const api_signupkeyRelations = relations(api_signupkey, ({one}) => ({
	api_user: one(api_user, {
		fields: [api_signupkey.user_id],
		references: [api_user.id]
	}),
}));

export const api_recoverykeyRelations = relations(api_recoverykey, ({one}) => ({
	api_user: one(api_user, {
		fields: [api_recoverykey.user_id],
		references: [api_user.id]
	}),
}));