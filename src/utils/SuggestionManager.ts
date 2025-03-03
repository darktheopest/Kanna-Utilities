import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, Message, ButtonStyle, ChatInputCommandInteraction, ComponentType, EmbedBuilder, TextChannel, User } from "discord.js";
import suggestionModel from "../database/models/SuggestionModel";
import config from "../config";
import EClient from "../structures/EClient";
import createBar from "./ProgressBar";
import FetchMessageURL from "./FetchMessageURL";
import dayjs from "dayjs";

export default class SuggestionManager {
    public async CreateSuggestion(input: Suggestion) {
        let code: string = this.createCode()

        const data = await suggestionModel.findOne({
            code: code
        }).exec()

        if (data) code = this.createCode()
        const bar = createBar({ current: 0, total: 3 })
        const suggestFinalEmbed = [
            new EmbedBuilder()
                .setDescription(`## New Suggestion`)
                .setFields([
                    {
                        name: `•  Suggestion - ${dayjs(Date.now()).format('HH:MM DD/MM/YY')}`,
                        value: `\`\`\`txt\n${this.cleanContent(input.suggestion, input.interaction.channel as TextChannel)}\n\`\`\``
                    },
                    {
                        name: '•  Status',
                        value: `<:invisible:1088472352859365496> Waiting for a response from staff`
                    }
                ])
                .setFooter({
                    text: `From ${input.user.tag} // Ref: ${code}`,
                })
                .setThumbnail(input.user.avatarURL()),
            new EmbedBuilder()
                .setColor(0x2b2d31)
                .setFields([
                    {
                        name: 'Upvote',
                        value: `${bar[0]} \`0 | ${bar[1]}%\``,
                    },
                    {
                        name: 'Consider',
                        value: `${bar[0]} \`0 | ${bar[1]}%\``,
                    },
                    {
                        name: 'Downvote',
                        value: `${bar[0]} \`0 | ${bar[1]}%\``,
                    }
                ])
        ]
        const suggestFinalComponents = new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
                .setEmoji('👍')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('upvote'),
            new ButtonBuilder()
                .setEmoji('🤔')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('consider'),
            new ButtonBuilder()
                .setEmoji('👎')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('downvote')
        )
        const suggestConfirmEmbed = new EmbedBuilder()
            .setColor(config.color.warning)
            .setDescription(`## Suggestion Confirm
- Your suggestion:\n\`\`\`js\n${input.suggestion}\n\`\`\``)
            .setFooter({ text: `Please check your suggestion carefully. Once submitted, you cannot edit or delete it` });
        const suggestConfirmComponents = new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
                .setCustomId('acp')
                .setLabel('Accept')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('dny')
                .setLabel('Deny')
                .setStyle(ButtonStyle.Danger)
        )
        await input.interaction.editReply({
            embeds: [suggestConfirmEmbed],
            components: [suggestConfirmComponents]
        }).then(async message => {
            const collector = message.createMessageComponentCollector({
                filter: i => ['acp', 'dny'].includes(i.customId) && i.user.id === input.interaction.user.id,
                componentType: ComponentType.Button,
                time: 60000
            })
            collector.on('collect', async (i: ButtonInteraction) => {
                await i.deferReply({ ephemeral: true })
                switch (i.customId) {
                    case 'acp':
                        ; (input.client.channels.cache.get('1146060149186891836') as TextChannel).send({
                            embeds: suggestFinalEmbed,
                            components: [suggestFinalComponents]
                        }).then(async msg => {
                            msg.startThread({
                                name: this.cleanContent(input.suggestion, input.interaction.channel as TextChannel),
                                reason: `[Automation] >>> Locked thread for suggestion ${code}`
                            })
                            const DMMessage = await i.user.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(0x2b2d31)
                                        .setTitle(`Suggestion \`${code}\` Log`)
                                        .setURL(msg.url)
                                        .addFields({
                                            name: `•  Posted - ${dayjs(Date.now()).format('HH:mm DD/MM/YY')}`,
                                            value: this.cleanContent(input.suggestion, input.interaction.channel as TextChannel)
                                        })
                                ]
                            }).catch(() => { }) as Message
                            await suggestionModel.create({
                                code: code,
                                suggestionURL: msg.url,
                                suggestion: input.suggestion,
                                createdTimestamp: Date.now(),
                                votes: [
                                    {
                                        vote: 'upvote'
                                    },
                                    {
                                        vote: 'consider'
                                    },
                                    {
                                        vote: 'downvote'
                                    }
                                ],
                                status: [
                                    {
                                        accepted: false
                                    },
                                    {
                                        denied: false
                                    }
                                ],
                                DMLogMessageURL: DMMessage.url
                            })
                            await i.editReply({ content: `[Click Here](${msg.url})` })
                        })
                        collector.stop()
                        await input.interaction.deleteReply()
                        break;
                    case 'dny':
                        await input.interaction.deleteReply()
                        await i.deleteReply()
                        break;
                }
            })
            collector.on('end', async () => {
                await message.delete().catch(() => { })
            })
        })

    }

    private createCode(): string {
        return Math.random().toString(20).substring(8, 14)
    }

    #model = suggestionModel

    public async accept(input: ModerateSuggestion) {
        const data = await this.#model.findOne({
            code: input.code
        }).exec()


        // Update database
        data!.status[0].accepted = true
        data!.status[0].by = input.user.id
        data!.status[0].timestamp = Math.round(Date.now() / 1000)
        data!.status[1].denied = false
        await data?.save()

        // Fetch suggestionMessage
        const message = (await FetchMessageURL.FetchMessageURL(data!.suggestionURL, input.client))

        // Update embed
        const suggestEmbed = EmbedBuilder.from(message.message.embeds[0])
            .setColor(input.client._config.color.accept)
            .spliceFields(1, 2, {
                name: `•  Status - ${dayjs(Date.now()).format('HH:MM DD/MM/YY')}`,
                value: `<:online:1088472361331851455> Accepted by \`${input.user.tag}\`\n- ${input.comment}`
            })


        const DMMessage = await FetchMessageURL.FetchDmMessageURL(data!.DMLogMessageURL, input.client).catch(() => { })
        if (DMMessage) {
            DMMessage.message.edit({
                embeds: [
                    EmbedBuilder.from(DMMessage.message.embeds[0])
                        .addFields({
                            name: `•  Accepted by - ${dayjs(Date.now()).format('HH:mm DD/MM/YY')}`,
                            value: input.comment
                        })
                ]
            })
        }
        await message.message.thread?.setLocked(true, `[Automation] >>> Locked thread for SuggestionAccepted`).catch(() => { })
            ; (message).message.edit({
                embeds: [
                    suggestEmbed,
                    message.message.embeds[1]
                ]
            })
    }

    public async deny(input: ModerateSuggestion) {
        const data = await this.#model.findOne({
            code: input.code
        }).exec()


        // Update database
        data!.status[0].accepted = false
        data!.status[1].denied = true
        data!.status[1].by = input.user.id
        data!.status[1].timestamp = Math.round(Date.now() / 1000)
        await data?.save()

        // Fetch suggestionMessage
        const message = (await FetchMessageURL.FetchMessageURL(data!.suggestionURL, input.client))

        // Update embed
        const suggestEmbed = EmbedBuilder.from(message.message.embeds[0])
            .setColor(input.client._config.color.error)
            .spliceFields(1, 2, {
                name: `•  Status - ${dayjs(Date.now()).format('HH:MM DD/MM/YY')}`,
                value: `<:dnd:1088472358181945384> Denied by \`${input.user.tag}\`\n- ${input.comment}`
            })


        const DMMessage = await FetchMessageURL.FetchDmMessageURL(data!.DMLogMessageURL, input.client).catch(() => { })
        if (DMMessage) {
            DMMessage.message.edit({
                embeds: [
                    EmbedBuilder.from(DMMessage.message.embeds[0])
                        .addFields({
                            name: `•  Denied by - ${dayjs(Date.now()).format('HH:mm DD/MM/YY')}`,
                            value: input.comment
                        })
                ]
            })
        }
        await message.message.thread?.setLocked(true, `[Automation] >>> Locked thread for SuggestionDenied`).catch(() => { })
            ; (message).message.edit({
                embeds: [
                    suggestEmbed,
                    message.message.embeds[1]
                ]
            })
    }

    public async addComment(input: ModerateSuggestion) {
        const data = await this.#model.findOne({
            code: input.code
        }).exec()



        // Fetch suggestionMessage
        const message = (await FetchMessageURL.FetchMessageURL(data!.suggestionURL, input.client))

        // Update embed
        const suggestEmbed = EmbedBuilder.from(message.message.embeds[0])
            .addFields({
                name: `•  Comment from \`${input.user.tag}\` - ${dayjs(Date.now()).format('HH:MM DD/MM/YY')}`,
                value: `- ${input.comment}`
            })


        const DMMessage = await FetchMessageURL.FetchDmMessageURL(data!.DMLogMessageURL, input.client).catch(() => { })
        if (DMMessage) {
            DMMessage.message.edit({
                embeds: [
                    EmbedBuilder.from(DMMessage.message.embeds[0])
                        .addFields({
                            name: `•  New comment from \`${input.user.tag}\` - ${dayjs(Date.now()).format('HH:mm DD/MM/YY')}`,
                            value: input.comment
                        })
                ]
            })
        }
        message.message.edit({
            embeds: [suggestEmbed, message.message.embeds[1]]
        })
    }

    private cleanContent(str: string, channel: TextChannel) {
        return str.replaceAll(/<(@[!&]?|#)(\d{17,19})>/g, (match, type, id) => {
            switch (type) {
                case '@':
                case '@!': {
                    const member = channel.guild?.members.cache.get(id);
                    if (member) {
                        return `@${member.displayName}`;
                    }

                    const user = channel.client.users.cache.get(id);
                    return user ? `@${user.username}` : match;
                }
                case '@&': {
                    const role = channel.guild.roles.cache.get(id);
                    return role ? `@${role.name}` : match;
                }
                case '#': {
                    const mentionedChannel = channel.client.channels.cache.get(id) as TextChannel;
                    return mentionedChannel ? `#${mentionedChannel.name}` : match;
                }
                default: {
                    return match;
                }
            }
        });
    }
}

interface Suggestion {
    user: User,
    suggestion: string,
    interaction: ChatInputCommandInteraction,
    client: EClient
}

interface ModerateSuggestion {
    user: User,
    client: EClient,
    code: string,
    comment: string
}