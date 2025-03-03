import { Args, Command } from '@sapphire/framework'
import { Message, ButtonStyle, TextChannel } from 'discord.js'
import ms from 'ms'

export class GiveawayStart extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            name: 'start',
            requiredUserPermissions: ['ManageMessages'],
            description: 'Start a new giveaway',
            preconditions: ['GuildTextOnly']
        })
    }
    public async messageRun(message: Message, args: Args) {
        const timePick = (await args.pick('string')) as string
        const time = ms(timePick)
        const winnerPick = await args.pick('number')
        const prizePick = await args.rest('string')
        const client = message.client
        const newGiveaway = await message.client._giveaways.start({
            channelID: message.channel.id,
            guildID: message.guild?.id,
            hostMemberID: message.author.id,
            prize: prizePick,
            time: timePick,
            winnersCount: winnerPick,

            defineEmbedStrings(giveaway: any, host: any) {
                return {
                    // this ephemeral reply will be sent when they join the giveaway (embeds may also be used here)
                    joinGiveawayMessage: {
                        messageContent: ':white_check_mark: | You have joined the giveaway!'
                    },

                    // this ephemeral reply will be sent when they leave the giveaway (embeds may also be used here)
                    leaveGiveawayMessage: {
                        messageContent: ':exclamation: | You have left the giveaway!'
                    },

                    // this embed will be sent on giveaway start
                    start: {
                        messageContent: ':tada: **GIVEAWAY STARTED!** :tada:',

                        // embed properties
                        title: `Giveaway (ID: ${giveaway.id})`,
                        titleIcon: client.user?.displayAvatarURL({ size: 2048 }),

                        description: `Prize: **${giveaway.prize}**.\nWinners: **${giveaway.winnersCount}**\n` +
                            `Entries: **${giveaway.entriesCount}**\nHost: **${host.username}**\nEnds at: <t:${giveaway.endTimestamp}:R>`,

                        footer: `Ends at:`,
                        timestamp: giveaway.endTimestamp,
                        footerIcon: client.user?.displayAvatarURL({ size: 2048 })
                    },

                    // defining all messages that are related
                    // to giveaway finish
                    finish(mentionsString: any, winnersCount: any) {
                        return {
                            // this message will be sent separately in the giveaway channel when the giveaway ends
                            // used to mention the giveaway winners
                            endMessage: {
                                messageContent: `Congratulations ${mentionsString} on winning **${giveaway.prize}**!`
                            },

                            // the new separated message that the giveaway message in giveaway channel
                            // will be changed to after the giveaway is finished
                            newGiveawayMessage: {
                                messageContent: ':tada: **GIVEAWAY FINISHED!** :tada:',

                                title: `Giveaway (ID: ${giveaway.id})`,
                                titleIcon: client.user?.displayAvatarURL({ size: 2048 }),


                                // using "giveaway.winnersCount" to pluralize the "winners" word because
                                // it's constant and most likely to match the actual number of winners

                                // using "winnersCount" in "Winners" string in case if the actual number of winners
                                // will not match the giveaway's number of winners
                                description: `Prize: **${giveaway.prize}**\nEntries: **${giveaway.entriesCount}**\n` +
                                    `${winnersCount == 1 ? 'Winner' : `Winners **(${winnersCount})**`}: ${mentionsString} `,

                                footer: `Ended at:`,
                                footerIcon: client.user?.displayAvatarURL({ size: 2048 }),
                                timestamp: giveaway.endedTimestamp
                            },

                            // the new message that the giveaway message in giveaway channel will be changed to
                            // after the giveaway is finished with no winners
                            noWinnersNewGiveawayMessage: {
                                messageContent: ':tada: **GIVEAWAY FINISHED!** :tada:',

                                title: `Giveaway (ID: ${giveaway.id})`,
                                titleIcon: client.user?.displayAvatarURL({ size: 2048 }),
                                description: `There was no winners in "**${giveaway.prize}**" giveaway!`,

                                footer: `Ended at:`,
                                timestamp: giveaway.endedTimestamp,
                                footerIcon: client.user?.displayAvatarURL({ size: 2048 })
                            },

                            // the new separated message that the giveaway message in giveaway channel
                            // will be changed to after the giveaway is finished with no winners (embeds may also be used here)
                            noWinnersEndMessage: {
                                messageContent: `Unfortunetly, there are no winners in the **${giveaway.prize}** giveaway`
                            }
                        }
                    },

                    // defining all messages that are related
                    // to rerolling the giveaway winners
                    reroll(mentionsString: any, winnersCount: any) {
                        return {
                            // this ephemeral reply will be sent when they're not a host
                            // of the giveaway and trying to reroll the winners (embeds may also be used here)
                            onlyHostCanReroll: {
                                messageContent: ':x: | Only host of this giveaway can reroll the winners'
                            },

                            // the new message that the giveaway message in giveaway channel will be changed to
                            // after the reroll
                            newGiveawayMessage: {
                                messageContent: ':tada: **GIVEAWAY REROLLED!** :tada:',

                                title: `Giveaway (ID: ${giveaway.id})`,
                                titleIcon: client.user?.displayAvatarURL({ size: 2048 }),

                                description: `Prize: **${giveaway.prize}**\nEntries: **${giveaway.entriesCount}**\n` +
                                    `${winnersCount == 1 ? 'Winner' : `Winners **(${winnersCount})**`}: ${mentionsString}`,

                                footer: `Ended at:`,
                                timestamp: giveaway.endedTimestamp,
                                footerIcon: client.user?.displayAvatarURL({ size: 2048 })
                            },

                            // this message will be sent separately in the giveaway channel after the reroll
                            // used to mention the new giveaway winners (embeds may also be used here)
                            rerollMessage: {
                                messageContent: `${winnersCount == 1 ? 'New winner is' : 'New winners are'} ` +
                                    `${mentionsString}, congratulations!`
                            },

                            // this ephemeral reply will be sent after the successful reroll (embeds may also be used here)
                            successMessage: {
                                messageContent: ':white_check_mark: | Successfully rerolled the winners!'
                            }
                        }
                    }
                }
            },

            // defining the buttons to be attached on giveaway related messages
            buttons: {
                // the "join giveaway" button to attach on the initial giveaway message
                joinGiveawayButton: {
                    text: 'Join the giveaway',
                    emoji: '🎉', // either an emoji or custom emoji ID is acceptable
                    style: ButtonStyle.Primary
                },

                // the "reroll" button to attach on the separated giveaway end message
                rerollButton: {
                    text: 'Reroll Winners',
                    emoji: '🔁', // either an emoji or custom emoji ID is acceptable
                    style: ButtonStyle.Primary
                },

                // the "go to nessage" link button to attach on the separated giveaway end message
                // that will bring to the initial giveaway message
                goToMessageButton: {
                    text: 'Go to Message',
                    emoji: '↗️' // either an emoji or custom emoji ID is acceptable
                }
            }
        })

            // send the success message
            ; (message.channel as TextChannel).send({
                content: `**${newGiveaway.prize}** giveaway (ID: **${newGiveaway.id}**) has started ------> ${newGiveaway.messageURL}`
            })
        return;
    }
}