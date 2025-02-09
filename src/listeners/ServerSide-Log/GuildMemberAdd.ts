import { Listener, Events } from '@sapphire/framework'
import { EmbedBuilder, TextChannel, type GuildMember } from 'discord.js'

export class GuildMemberAdd extends Listener {
	public constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, {
			...options,
			event: Events.GuildMemberAdd
		})
	}
	public async run(rawMember: GuildMember) {
		const member = await rawMember.fetch(true)
		const embed = new EmbedBuilder()
			.setColor(this.container.client._config.color.accept)
			.setDescription(`## Member Join
- **Username**: \`${member.user.tag}\`
- **ID**: \`${member.user.id}\`
- **Rejoin**: ${member.flags.has('DidRejoin') ? this.container.client._config.emoji.tick : this.container.client._config.emoji.cross}
- **Created**: <t:${Math.round(member.user.createdTimestamp / 1000)}:R>`)
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