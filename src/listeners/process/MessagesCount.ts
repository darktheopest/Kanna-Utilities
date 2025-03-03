import { Listener, Events } from '@sapphire/framework'
import { Message } from 'discord.js'

export class MessagesCount extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: Events.MessageCreate
        })
    }
    public async run(message: Message) {
        if (message.partial) await message.fetch()

        if (message.author.bot) return;

        const data = await this.container.client._messages.findOne({
            user: message.author.id
        }).exec()

        if (!data) return await this.container.client._messages.create({
            user: message.author.id,
            messages: 1
        }).then(() => 1)

        return await this.container.client._messages.updateOne({
            user: message.author.id
        }, {
            $inc: {
                messages: 1
            }
        }).exec()
    }
}