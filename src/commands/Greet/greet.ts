import { Args } from "@sapphire/framework";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { AttachmentBuilder, EmbedBuilder, Guild, Message, TextChannel } from "discord.js";
import { setTimeout } from "timers/promises";
import greetModel from "../../database/models/GreetModel";
import GreetReplacer from "../../utils/GreetReplacer";

export class Greet extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
            name: 'greet',
            description: 'Setup greet system for server',
            requiredUserPermissions: ['Administrator'],
            subcommands: [
                {
                    name: 'help',
                    messageRun: 'help',
                    default: true
                },
                {
                    name: 'enable',
                    messageRun: 'enable'
                },
                {
                    name: 'disable',
                    messageRun: 'disable'
                },
                {
                    name: 'debug',
                    messageRun: 'debug'
                },
                {
                    name: 'list',
                    messageRun: 'list'
                },
                {
                    name: 'var',
                    messageRun: 'var'
                }
            ]
        })
    }
    public async help(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setDescription(`## ${this.container.client._config.prefix}${this.name}`)
            .setFields([
                {
                    name: 'Enable',
                    value: `*Enable greet for channel*
                    \`${this.container.client._config.prefix}${this.name} enable <channel>\``
                },
                {
                    name: 'Disable',
                    value: `*Disable greet channel*
                    \`${this.container.client._config.prefix}${this.name} disable <channel>\``
                },
                {
                    name: 'Debug',
                    value: `*Test greet*
                    \`${this.container.client._config.prefix}${this.name} debug <channel>\``
                },
                {
                    name: 'List',
                    value: `*Show greet channels*
                    \`${this.container.client._config.prefix}${this.name} list\``
                },
                {
                    name: 'Var',
                    value: `*Show greet variables*
                    \`${this.container.client._config.prefix}${this.name} var\``
                }
            ])
            ; (message.channel as TextChannel).send({ embeds: [embed] })
    }

    public async enable(message: Message, args: Args) {
        const channels = await args.repeat('guildTextChannel').catch(() => null);
        if (!channels) return message.reply('Please mention(s) channel(s).\n\n*You can add more than 1 channel!*')
        const content = (args.finished ? null : await args.repeat('string').catch(() => null))?.join(' ');
        if (content?.length === 0) return message.reply(`Please provide message for greet!\n\n*\`${this.container.client._config.prefix}${this.name} var\` will show you all useful variables!*`)
        const msg = await (message.channel as TextChannel).send(`${message.client._config.emoji.loading} Processing is in progress. Please wait!`)
        let messages: Array<O> = []
        channels.forEach(async (c: TextChannel, index: number) => {
            const data = await this.get(c).catch((e) => console.log(e))
            if (data) {
                if (data?.enabled) return messages.push({
                    data: `\`${index + 1}\` | ${message.client._config.emoji.exclamation} | ${c.toString()} has already enabled greet!`,
                    index: index
                })
            }
            return data ? await greetModel.updateOne({
                channelId: c.id
            }, {
                $set: {
                    enabled: true
                }
            }).then(() => {
                messages.push({
                    data: `\`${index + 1}\` | ${message.client._config.emoji.tick} | Enabled greet for ${c.toString()}`,
                    index: index
                })
            }) : await greetModel.create({
                channelId: c.id,
                messages: content,
                enabled: true
            }).then(() => {
                messages.push({
                    data: `\`${index + 1}\` | ${message.client._config.emoji.tick} | Enabled greet for ${c.toString()}`,
                    index: index
                })
            })
        })
        await setTimeout(5000)
        return msg.edit(`Done ${message.client._config.emoji.tick}\n\n${messages.sort((a, b) => a.index - b.index).map(d => d.data).join('\n')}`)
    }
    private async get(channel: TextChannel) {
        return await greetModel.findOne({ channelId: channel.id }).exec()
    }
    public async disable(message: Message, args: Args) {
        const channels = await args.repeat('guildTextChannel').catch(() => null);
        if (!channels) return message.reply('Please mention(s) channel(s).\n\n*You can select more than 1 channel!*')
        const msg = await (message.channel as TextChannel).send(`${message.client._config.emoji.loading} Processing is in progress. Please wait!`)
        let messages: Array<O> = []
        channels.forEach(async (c: TextChannel, index: number) => {
            const data = await this.get(c).catch((e) => console.log(e))
            if (!data) return messages.push({
                data: `\`${index + 1}\`| ${message.client._config.emoji.exclamation} | ${c.toString()} | Not found in database`,
                index: index
            })
            if (!data?.enabled) return messages.push({
                data: `\`${index + 1}\` | ${message.client._config.emoji.cross} | ${c.toString()} hasn't enabled!`,
                index: index
            })
            return await greetModel.updateOne({
                channelId: c.id
            }, {
                $set: {
                    enabled: false
                }
            }).then(() => {
                messages.push({
                    data: `\`${index + 1}\` | ${message.client._config.emoji.tick} | Disabled greet for ${c.toString()}`,
                    index: index
                })
            })
        })
        await setTimeout(5000)
        msg.edit(`Done ${message.client._config.emoji.tick}\n\n${messages.sort((a, b) => a.index - b.index).map(d => d.data).join('\n')}`)
        return;
    }
    public async list(message: Message) {
        const data = await greetModel.find().exec()
        const mapped = data.map((d, c) => `${c + 1} - ${(message.client.channels.cache.get(d.channelId) as TextChannel).name}(${d.channelId}): ${d.enabled}\n- ${d.messages}\n- Time to delete: ${d.timeToDelete}ms`).join('\n')
        const buffer = new AttachmentBuilder(Buffer.from(mapped)).setName('list.txt')
        message.reply({
            files: [buffer]
        })
    }
    public async var(message: Message) {
        const variables: Array<V> = [
            {
                var: '!{user.mention}',
                test: message.author.toString()
            },
            {
                var: '!{user.username}',
                test: message.author.username
            },
            {
                var: '!{user.tag}',
                test: message.author.tag
            },
            {
                var: '!{user.id}',
                test: message.author.id
            },
            {
                var: '!{guild.name}',
                test: message.guild?.name
            },
            {
                var: '!{guild.membercount}',
                test: (await message.guild?.members.fetch())?.size
            }
        ]
        const embed = new EmbedBuilder()
            .setColor(0x2b2d31);

        variables.forEach((v) => {
            embed.addFields([
                {
                    name: v.var,
                    value: `${v.test}`,
                    inline: true
                }
            ])
        })
            ; (message.channel as TextChannel).send({ embeds: [embed] })
    }
    public async debug(message: Message, args: Args) {
        const channels = await args.repeat('guildTextChannel').catch(() => null);
        if (!channels) return message.reply('Please mention(s) channel(s).\n\n*You can select more than 1 channel to debug!*')
        let messages: Array<O> = []
        const msg = await (message.channel as TextChannel).send(`${message.client._config.emoji.loading} Processing is in progress. Please wait!`)
        channels.forEach(async (c: TextChannel, index: number) => {
            const data = await this.get(c).catch((e) => console.log(e))
            if (!data) return messages.push({
                data: `\`${index + 1}\`| ${message.client._config.emoji.exclamation} | ${c.toString()} | Not found in database`,
                index: index
            })
            const isEnabled = data?.enabled ? message.client._config.emoji.tick : message.client._config.emoji.cross
            const messageWithVars = await GreetReplacer({
                messages: data!.messages,
                user: message.author,
                guild: message.guild as Guild
            })
            return messages.push({
                data: `\`${index + 1}\`| ${isEnabled} | <#${data!.channelId}> | ${messageWithVars}`,
                index: index
            })
        })

        await setTimeout(5000)
        msg.edit(`Done ${message.client._config.emoji.tick}\n\n${messages.sort((a, b) => a.index - b.index).map(d => d.data).join('\n')}`)
        return;
    }
}
interface V {
    var: string,
    test: any
}
interface O {
    index: number,
    data: string
}