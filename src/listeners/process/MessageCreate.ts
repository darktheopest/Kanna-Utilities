import { Events, Listener } from "@sapphire/framework";
import { Message } from "discord.js";

export class TagResponse extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: Events.MessageCreate
        })
    }
    public async run(message: Message) {
        // if (message.partial) await message.fetch()

        // if (message.author.bot) return;

        // const trigger = message.content.slice(0).split(/ +/g)

        // const data = await this.container.client._tags.get(trigger)
        // if (data.length === 0) return;

        // const content = data[0].content.replaceAll('{del}', '')

        // message.channel.send({
        //     content: content,
        //     embeds: data[0].embeds,
        //     components: data[0].components
        // })
        // if (data[0].content.includes('{del}')) await message.delete().catch(() => {})
        // return;
    }
}