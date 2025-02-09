import { Listener, Events } from '@sapphire/framework'
import { EmbedBuilder, TextChannel, AuditLogEvent, GuildBan } from 'discord.js'

export class GuildBanAdd extends Listener {
	public constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, {
			...options,
			event: Events.GuildBanAdd
		})
	}
	public async run(ban: GuildBan) {
		const audit = await ban.guild.fetchAuditLogs({
			type: AuditLogEvent.MemberBanAdd,
			limit: 1
		}).then(audit => audit.entries.first())
		const member = await audit?.target?.fetch()
		const executor = await audit?.executor?.fetch()
		const embed = new EmbedBuilder()
			.setColor(0x2b2d31)
			.setDescription(`## Guild Ban Add
**- Target**: ${member?.toString()} (\`${member?.id}\`)
**- Executor**: ${executor?.toString()} (\`${executor?.id}\`)
**- Reason**: \`${audit?.reason}\`
**- Timestamp**: <t:${Math.round(audit!.createdTimestamp / 1000)}:R>`)
			.setThumbnail(member!.avatarURL())
			; (this.container.client.channels.cache.get('1079049356340121694') as TextChannel).send({
				embeds: [embed]
			})
	}
}