import { model, Schema } from 'mongoose'

interface M {
    user: string,
    messages: number
}

const schema = new Schema<M>({
    user: String,
    messages: Number
})

const messagesModel = model<M>('MessagesModel', schema)

export default messagesModel