import { Listener, Events } from '@sapphire/framework'
import { EmbedBuilder, Presence, TextChannel } from 'discord.js'

export class PresenceUpdate extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: Events.PresenceUpdate
        })
    }
    public async run(oldPresence: Presence, newPresence: Presence) {
        if (newPresence.userId !== '1027954911121526845' || newPresence.guild?.id !== this.container.client._config.mainServer) return;
        if (oldPresence && ['offline', 'invisible'].includes(newPresence.status)) {
            (oldPresence.client.channels.cache.get('1338197385490337913')! as TextChannel).send({
                content: `- ${this.container.client._config.emoji.cross} | ${newPresence.user?.tag} has gone offline!
${this.container.client._config.uptimePing.map(u => `			- <@!${u.toString()}>`).join('\n')}`,
                embeds: [new EmbedBuilder().setColor(0x2b2d31).setFooter({ text: 'This incident has been reported to the developers!' })]
            })
        } else if ((!oldPresence || ['offline', 'invisible'].includes(oldPresence.status)) && !['offline', 'invisible'].includes(newPresence.status)) {
            (newPresence.client.channels.cache.get('1338197385490337913')! as TextChannel).send({
                content: `- ${this.container.client._config.emoji.tick} | ${newPresence.user?.tag} has come online.
${this.container.client._config.uptimePing.map(u => `			- <@!${u.toString()}>`).join('\n')}`,
                embeds: [new EmbedBuilder().setColor(0x2b2d31).setFooter({ text: 'Although it\'s online, some features may not work as intended. If you encounter any issues, please report them to us immediately!' })]
            });
        };
    };
};