import { Command } from '@sapphire/framework'
import { Message, TextChannel } from 'discord.js'
import { setTimeout } from 'node:timers/promises'

export class Nuke extends Command {
    public constructor(context: Command.LoaderContext, options: Command.LoaderContext) {
        super(context, {
            ...options,
            name: 'nuke',
            description: 'Delete and create new channel',
            requiredUserPermissions: ['ManageChannels'],
            preconditions: ['GuildTextOnly']
        })
    }
    public async messageRun(message: Message) {
        (message.channel as TextChannel).send('Fireworkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
        await setTimeout(5000);
        (message.channel as TextChannel).clone({
        }).then(async (c) => {
            c.setPosition((message.channel as TextChannel).position)
            await message.channel.delete('Nuked by ' + message.author.tag).catch(() => { })
            c.send(`Nuked by \`${message.author.tag}\``)
        })
    }
}