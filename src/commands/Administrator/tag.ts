import { Args } from '@sapphire/framework'
import { Subcommand } from '@sapphire/plugin-subcommands'
import { AttachmentBuilder, EmbedBuilder, Message, TextChannel } from 'discord.js'

export class Tags extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
            name: 'tag',
            description: 'Tag subcommand',
            requiredUserPermissions: ['Administrator'],
            subcommands: [
                {
                    name: 'list',
                    messageRun: 'list'
                },
                {
                    name: 'help',
                    default: true,
                    messageRun: 'help'
                },
                {
                    name: 'add',
                    messageRun: 'add'
                },
                {
                    name: 'delete',
                    messageRun: 'delete'
                }
            ]
        })
    }
    public async help(message: Message) {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setDescription(`## Tag Help`)
            .setFields([
                {
                    name: 'List',
                    value: `- \`${this.container.client._config.prefix}tag list\``,
                    inline: true
                },
                {
                    name: 'Add',
                    value: `- \`${this.container.client._config.prefix}tag add [tag name] [tag body]\``,
                    inline: true
                },
                {
                    name: 'Delete',
                    value: `- \`${this.container.client._config.prefix}tag delete [tag name]\``,
                    inline: true
                }
            ])
            .setTimestamp()

            ; (message.channel as TextChannel).send({
                embeds: [helpEmbed]
            })
    }

    public async list(message: Message) {
        const data = await this.container.client._tags.list()
        const mappedData = data.map((a, b) => `${b + 1} - ${a.trigger}`).join('\n')
        const attachment = new AttachmentBuilder(Buffer.from(mappedData)).setName('data.js')
            ; (message.channel as TextChannel).send({
                files: [attachment]
            })
    }
    public async add(message: Message, args: Args) {
        const arg = await args.repeat('string').catch(() => null)
        const trigger = arg![0].toString()
        const response = arg!.filter((a) => a !== arg![0]).join(' ')

        if (arg!.length <= 1) return message.reply({
            content: `${this.container.client._config.emoji.cross} | Invalid syntax!`
        })
        if ((await this.container.client._tags.get(trigger)).length > 0) return message.reply({
            content: `${this.container.client._config.emoji.cross} | I'm sorry but this tag already exists!`
        });

        return await this.container.client._tags.add({
            name: trigger,
            content: response!.toString()
        }).then((data) => message.reply({
            content: `${this.container.client._config.emoji.tick} | Created tag \`${data.trigger}\``
        }))
    }
}