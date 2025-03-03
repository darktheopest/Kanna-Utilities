import { Listener, Events } from '@sapphire/framework'
import { Message } from 'discord.js'
import suggestionModel from '../../database/models/SuggestionModel';

export class SuggestionMessageThreadSync extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: Events.MessageDelete
        })
    }
    public async run(message: Message) {
        if (message.partial || !message) return;
        if (message.channel.id !== '1146060149186891836') return;

        const data = await suggestionModel.findOne({
            suggestionURL: message.url
        }).exec()

        if (!data) return;

        return await message.thread?.delete(`[Automation] >>> Delete Suggestion ${data.code} Thread For SuggestionDeleted`).catch(() => { });
    }
}