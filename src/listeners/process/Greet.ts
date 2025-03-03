import { Listener, Events } from "@sapphire/framework";
import { GuildMember, TextChannel } from "discord.js";
import GreetReplacer from "../../utils/GreetReplacer";

export class Greet extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: Events.GuildMemberAdd
        })
    }

    public async run(rawMember: GuildMember) {
       const member = await rawMember.fetch();
        const data = await this.container.client._greetModel.find({ enabled: true })

        data.forEach(async(d) => {
            const channel = await this.container.client.channels.fetch(d.channelId) as TextChannel
            const messages = await GreetReplacer({
                messages: d.messages,
                user: member.user,
                guild: member.guild
            })
            await channel?.send(messages).then((message) => setTimeout(() => {
                message.delete().catch(() => {})
            }, d.timeToDelete))
        })
    }
}