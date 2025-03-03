import { Listener, Events } from '@sapphire/framework'
import { GuildMember, EmbedBuilder, TextChannel } from 'discord.js'

export class GuildMemberRemove extends Listener {
	public constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, {
			...options,
			event: Events.GuildMemberRemove
		})
	}
	public async run(member: GuildMember) {
		const embed = new EmbedBuilder()
			.setColor(this.container.client._config.color.error)
			.setDescription(`## Member Leave
- **Username**: \`${member.user.tag}\`
- **ID**: \`${member.user.id}\`
- **Created**: <t:${Math.round(member.user.createdTimestamp / 1000)}:R>
- **Joined**: <t:${Math.round(member.joinedTimestamp as number / 1000)}:R>`)
			.setTimestamp()
			.setFooter({
				iconURL: member.guild.iconURL() as string,
				text: `We now have ${member.guild.memberCount} members!`
			})
			.setThumbnail(member.user.displayAvatarURL({ forceStatic: true, size: 256 }));
		(this.container.client.channels.cache.get('1079049356340121697') as TextChannel).send({
			content: `- <t:${Math.round(Date.now() / 1000)}:F>\n			- ${member.user.toString()}`,
			embeds: [embed]
		})
	}
}