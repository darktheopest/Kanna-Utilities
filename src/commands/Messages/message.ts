import { Args } from '@sapphire/framework'
import { Subcommand } from '@sapphire/plugin-subcommands'
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder, Message, TextChannel } from 'discord.js'

export class Messages extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
            name: 'message',
            description: 'Message subcommand',
            aliases: ['msg'],
            subcommands: [
                {
                    name: 'count',
                    messageRun: 'count',
                    default: true
                },
                {
                    name: 'leaderboard',
                    messageRun: 'lederboard',
                },
                {
                    name: 'lb',
                    messageRun: 'leaderboard'
                },
                {
                    name: 'reset',
                    messageRun: 'reset'
                }
            ]
        })
    }
    public async count(message: Message, args: Args) {
        const user = await args.pick('user').catch(() => message.author)

        const data = await this.container.client._messages.findOne({
            user: user.id
        }).exec()

        const allData = await this.container.client._messages.find().exec()

        const index = (allData.sort((a, b) => b.messages - a.messages).findIndex((u) => u.user === user.id)) + 1

        let messages: number = 0;

        if (data) messages = data.messages

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setDescription(`## Your Messages
Your current messages count is: **${messages}**`)
            .setFooter({
                text: `Your current rank is: ${data ? index : 'unknown'}`
            })

            ; (message.channel as TextChannel).send({
                embeds: [embed]
            })
    }

    public async leaderboard(message: Message) {
        const fullData = await this.container.client._messages.find().limit(10).exec()
        const main = await this.container.client._messages.findOne({
            user: message.author.id
        }).exec()
        const data = main === null ? 0 : main.messages;
        const index = (fullData.sort((a, b) => b.messages - a.messages).findIndex((u) => u.user === message.author.id)) + 1

        const embed = new EmbedBuilder()
            .setThumbnail(message.guild!.iconURL())
            .setTitle(`Leaderboard (${fullData.length} entries)`)
            .setDescription(
                `${fullData.length !== 0
                    ? fullData
                        .map((x, i) => {
                            return `\`${this.top(i + 1)}\`. <@!${x.user}>・**${x.messages}** messages`;
                        })
                        .join('\n')
                    : `No data found`
                }`,
            )
            .setColor(0x2b2d31)
            .setFooter({
                text: `🏆 Position・${data === 0 ? `unknown` : index}`,
            });

        return message
            .reply({
                embeds: [embed],
            })
            .catch(() => { });
    }
    private top(index: number) {
        return index === 1 ? '🥇' : index === 2 ? '🥈' : index === 3 ? '🥉' : index < 10 ? String(`0${index}`) : index;
    }

    public async reset(message: Message) {

        const allData = await message.client._messages.find().exec()

        const warningEmbed = new EmbedBuilder()
            .setColor(message.client._config.color.warning)
            .setDescription(`## Action Warning
- This action will delete **${allData.length}** user datas! Do you want to continue?`)
        const selectButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('Accept')
                .setCustomId('acp')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setLabel('Deny')
                .setCustomId('den')
                .setStyle(ButtonStyle.Danger)
        )
        await (message.channel as TextChannel).send({
            embeds: [warningEmbed],
            components: [selectButton]
        }).then(async msg1 => {
            const collector = msg1.createMessageComponentCollector({
                filter: interaction => interaction.user.id === message.author.id && ['acp', 'den'].includes(interaction.customId),
                time: 120000,
                componentType: ComponentType.Button
            })
            collector.on('collect', async (i: ButtonInteraction) => {
                switch (i.customId) {
                    case 'acp':
                        i.message.delete()
                        const msg = await (message.channel as TextChannel).send(`Processing is in progress ${message.client._config.emoji.loading}. Please wait!`)

                        await message.client._messages.deleteMany({
                            "__v": 0
                        }).exec()

                        msg.edit(`Done ${message.client._config.emoji.tick}\n\nCleared ${allData.length} user(s)!`)

                        collector.stop()
                        break;
                    case 'den':
                        i.message.delete()
                        collector.stop()
                        break;
                }
            })
            collector.on('end', async (i: ButtonInteraction) => {
                msg1.delete().catch(() => { })
            })
        })
    }
}