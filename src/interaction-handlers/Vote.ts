import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { ButtonInteraction, EmbedBuilder } from 'discord.js';
import suggestionModel from '../database/models/SuggestionModel';
import createBar from '../utils/ProgressBar';

export class ButtonHandler extends InteractionHandler {
  public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button
    });
  }

  public override parse(interaction: ButtonInteraction) {
    if (!['upvote', 'consider', 'downvote'].includes(interaction.customId)) return this.none();

    return this.some();
  }

  public async run(interaction: ButtonInteraction) {
    const data = await suggestionModel.findOne({
        suggestionURL: interaction.message.url
    }).exec()
    if (data?.status[0].accepted || data?.status[1].denied) return await interaction.reply({
        content: `This suggestion vote have already closed!`,
        ephemeral: true
    })
    await interaction.deferUpdate()
    if (data!.votes[0].participants.find(u => u.user.includes(interaction.user.id))) {
        data!.votes[0].participants = data!.votes[0].participants.filter(u => u.user !== interaction.user.id)
        await data?.save()
    } else if (data!.votes[1].participants.find(u => u.user.includes(interaction.user.id))) {
        data!.votes[1].participants = data!.votes[1].participants.filter(u => u.user !== interaction.user.id)
        await data?.save()
    } else if (data!.votes[2].participants.find(u => u.user.includes(interaction.user.id))) {
        data!.votes[2].participants = data!.votes[2].participants.filter(u => u.user !== interaction.user.id)
        await data?.save()
    }



    switch(interaction.customId) {
        case 'upvote':
            data!.votes[0].participants.push({ user: interaction.user.id, timestamp: Math.round(Date.now() / 1000 )})
            await data?.save()
            break;
        case 'consider':
            data!.votes[1].participants.push({ user: interaction.user.id, timestamp: Math.round(Date.now() / 1000 )})
            await data?.save()
            break;
        case 'downvote':
            data!.votes[2].participants.push({ user: interaction.user.id, timestamp: Math.round(Date.now() / 1000 )})
            await data?.save()
            break;
    }

    const newData = await suggestionModel.findOne({
        suggestionURL: interaction.message.url
    }).exec()

    const upvote = data!.votes[0].participants.length
    const consider = data!.votes[1].participants.length
    const downvote = data!.votes[2].participants.length
    const total = upvote + consider + downvote
    
    // Create progress-bar
    const upvoteProgressBar = createBar({ current: upvote, total: total })
    const considerProgressBar = createBar({ current: consider, total: total })
    const downvoteProgressBar = createBar({ current: downvote, total: total })

    // Edit embed
    const embed = EmbedBuilder.from(interaction.message.embeds[1])
            .spliceFields(0, 1, {
                name: 'Upvote',
                value: `${upvoteProgressBar[0]} \`${upvote} | ${upvoteProgressBar[1]}%\``,
            })
            .spliceFields(1, 2, {
                name: 'Consider',
                value: `${considerProgressBar[0]} \`${consider} | ${considerProgressBar[1]}%\``,
            })
            .spliceFields(2, 3, {
                name: 'Downvote',
                value: `${downvoteProgressBar[0]} \`${downvote} | ${downvoteProgressBar[1]}%\``,
            })

    return interaction.message.edit({
            embeds: [
                EmbedBuilder.from(interaction.message.embeds[0]),
                embed]
        })
  }
}