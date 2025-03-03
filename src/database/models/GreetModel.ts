import { EmbedBuilder } from 'discord.js'
import { model, Schema } from 'mongoose'

interface G {
    channelId: string,
    messages: string,
    enabled: boolean,
    timeToDelete: number
}

const schema = new Schema<G>({
    channelId: String,
    messages: String,
    enabled: Boolean,
    timeToDelete: {
        type: Number,
        default: 5000
    }
})

const greetModel = model<G>('GreetModel', schema)

export default greetModel