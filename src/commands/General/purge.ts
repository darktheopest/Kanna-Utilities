import { Command, Args } from '@sapphire/framework';
import { Message, TextChannel, Collection, DiscordAPIError } from 'discord.js';

export class Purge extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            name: 'purge',
            requiredUserPermissions: ['ManageMessages'],
            description: 'Purge messages based on various filters',
            flags: ['number', 'pins', 'bots', 'links', 'embeds'],
            preconditions: ['GuildTextOnly']
        });
    }

    public async messageRun(message: Message, args: Args) {
        const channel = message.channel as TextChannel;

        // Fetch arguments
        let amount = await args.pick('number').catch(() => 0);
        const deletePins = args.getFlags('pins');
        const deleteBots = args.getFlags('bots');
        const deleteLinks = args.getFlags('links');
        const deleteEmbeds = args.getFlags('embeds');
        const authorIds = await args.repeat('string' as const).catch(() => []);

        if (amount <= 0) amount = 100;

        const userMessageCounts = new Map<string, number>();
        let fetchedMessages: Collection<string, Message<true>>;

        try {
            // Fetch messages
            fetchedMessages = await channel.messages.fetch({ limit: amount });
        } catch (error) {
            console.error('Error fetching messages:', error);
            return message.reply('Failed to fetch messages. Make sure I have the necessary permissions');
        }

        // Update user message counts
        fetchedMessages.forEach((message) => {
            if (!userMessageCounts.has(message.author.id)) {
                userMessageCounts.set(message.author.id, 1);
            } else {
                userMessageCounts.set(message.author.id, userMessageCounts.get(message.author.id)! + 1);
            }
        });

        const data = [];
        for (const [userId, messageCount] of Array.from(userMessageCounts.entries())) {
            try {
                const user = await this.container.client.users.fetch(userId);
                data.push(`${messageCount} - ${user.tag}`);
            } catch (error) {
                console.error(`Error fetching user with ID ${userId}:`, error);
            }
        }

        // Filter messages based on the flags provided
        const messagesToDelete = fetchedMessages.filter((msg) => {
            if (!deletePins && msg.pinned) return false; // Exclude pinned messages unless --pins is specified
            if (authorIds.length > 0 && !authorIds.includes(msg.author.id as never)) return false; // Filter by author
            if (deleteBots && !msg.author.bot) return false; // Filter bot messages
            if (deleteLinks && !msg.content.match(/https?:\/\/\S+/)) return false; // Filter messages with links
            if (deleteEmbeds && msg.embeds.length === 0) return false; // Filter messages with embeds
            return true; // Default: Include the message
        });

        // Perform bulk deletion in chunks of 100
        const messageIds = [...messagesToDelete.keys()];
        const chunkSize = 100; // Discord bulk delete limit
        let deletedCount = 0;

        for (let i = 0; i < messageIds.length; i += chunkSize) {
            const chunk = messageIds.slice(i, i + chunkSize);
            try {
                await channel.bulkDelete(chunk, true);
                deletedCount += chunk.length;
            } catch (error) {
                if (error instanceof DiscordAPIError && error.code === 10008) {
                    console.error('Unknown Message Error: A message does not exist or is inaccessible');
                } else {
                    console.error('Error deleting messages:', error);
                }
            }
        }

        return message.reply(`Deleted ${deletedCount} messages:\n\n${data.join('\n')}`);
    }
}