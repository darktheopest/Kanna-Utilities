import { Command } from '@sapphire/framework';
import { EmbedBuilder, type Message, TextChannel } from 'discord.js';

export class Ping extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
			name: 'ping',
			description: 'Get the bot\'s latency'
		});
	}
	public async messageRun(message: Message) {
		const msg = await (message.channel as TextChannel).send('Ping?');
		return msg.edit({
			embeds: [
				new EmbedBuilder()
					.setAuthor({
						name: message.client.user.username,
						iconURL: message.client.user.avatarURL() as string,
					})
					.setColor(message.member?.displayColor as number)
					.setFields({
						name: 'Bot Latency',
						value: `\`${Math.round(this.container.client.ws.ping)}ms\``,
					}, {
						name: 'API Latency',
						value: `\`${msg.createdTimestamp - message.createdTimestamp}ms\``,
					})
					.setFooter({
						text: message.author.tag,
						iconURL: message.author.avatarURL() as string,
					})
					.setTimestamp()
					.setTitle('Pong!'),
			],
		});
	}
}