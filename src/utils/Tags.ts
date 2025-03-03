import TagModel from "../database/models/TagsModel";
import { EmbedBuilder, ActionRowBuilder } from 'discord.js'

export default class Tags {
    public constructor() {}

    public async add(name: { name: string, content: string }) {
        const data = new TagModel({
            trigger: name.name,
            content: name.content
        })
        return await data.save()
    }

    public async get(name: string) {
        return await TagModel.find({ trigger: name }).exec()
    }

    public async edit(name: { name: string, content: string, embeds: EmbedBuilder[], components: ActionRowBuilder[] }) {
         return await TagModel.updateOne({
            trigger: name.name
         }, {
            $set: {
                content: name.content,
                embeds: name.embeds,
                components: name.components
            }
         })
    }

    public async delete(name: string) {
        return await TagModel.deleteOne({
            trigger: name
        })
    }

    public async list() {
        return await TagModel.find().exec()
    }
}