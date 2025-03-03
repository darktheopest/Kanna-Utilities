import { Schema, model } from 'mongoose'
import type { EmbedBuilder,  ActionRowBuilder } from 'discord.js';
export interface TCase {
    trigger: string,
	content: string,
	embeds: any[],
    components: any[]
}

export const TagsSchema = new Schema<TCase>({
	trigger: String,
	content: String,
	embeds: Array<EmbedBuilder[]>,
    components: Array<ActionRowBuilder[]>
});
const TagModel = model<TCase>('tags', TagsSchema);
export default TagModel

