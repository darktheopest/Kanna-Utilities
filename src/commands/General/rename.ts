import { Args, Command } from '@sapphire/framework';
import { Message } from 'discord.js';
import { RateLimitManager } from '@sapphire/ratelimits';

const rateLimitManager = new RateLimitManager(60000, 2);

export class Rename extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            name: 'rename',
            requiredUserPermissions: ['ManageChannels'],
            description: 'Rename a channel',
            preconditions: ['GuildTextOnly']
        })
    }
    public async messageRun(message: Message, args: Args) {
        // Pick channel
        const channel = await args.pick('channel').catch(() => null)
        // Reply when channel is not defnied
        if (!channel) return message.reply({ content: `Channel not found` });
        // Acquire the rate limit
        const ratelimit = rateLimitManager.acquire(channel.id);
        // Check if there is a rate limit right now
        if (ratelimit.limited) return message.reply({ content: `A ratelimit for this channel was reached! Retry after <t:${Math.round(ratelimit.remaining / 1000)}:R>` });
        // We're not rate limited so we drip the bucket. After consuming twice, the third run through we'll be rate limited.
        await message.reply('Edited!');
        return ratelimit.consume();
    }
}