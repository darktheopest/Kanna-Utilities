import { Listener, Events } from '@sapphire/framework'
import { EmbedBuilder, TextChannel, type GuildMember, AuditLogEvent } from 'discord.js'

export class GuildMemberRemove extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: Events.GuildMemberRemove
        })
    }
    public async run(member: GuildMember) {

        if (member.partial) await member.fetch()
        const audit = await member.guild.fetchAuditLogs({
            type: AuditLogEvent.MemberKick,
            limit: 1
        }).then(audit => audit.entries.first())
        if (!audit || !audit.target) return;
        const auditTarget = await audit?.target?.fetch()
        const executor = await audit?.executor?.fetch()
        if (member.user.id !== auditTarget!.id) return;
        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setDescription(`## Member Kicked
**- Target**: ${member?.toString()} (\`${member?.id}\`)
**- Executor**: ${executor?.toString()} (\`${executor?.id}\`)
**- Reason**: \`${audit?.reason}\`
**- Timestamp**: <t:${Math.round(audit!.createdTimestamp / 1000)}:R>`);
        ; (this.container.client.channels.cache.get('1079049356340121694') as TextChannel).send({
            embeds: [embed]
        })
    }
}