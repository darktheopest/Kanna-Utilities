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
    if (!['all'].includes(interaction.customId)) return this.none();

    return this.some();
  }

  public async run(interaction: ButtonInteraction) {
    const data = await suggestionModel.findOne({
        suggestionURL: interaction.message.url
    }).exec()
    await interaction.reply({
        content: `Upvote: ${data?.votes[0].participants.length}\nConsider: ${data?.votes[1].participants.length}\nDownvote: ${data?.votes[2].participants.length}`
    })
  }
}