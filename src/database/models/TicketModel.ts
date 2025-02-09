import { Schema, model, SchemaTypes } from 'mongoose'

interface TicketInterface {
    author: string,
    ticketID: string
    closed: {
        isClosed: boolean
        closedBy: string
        closedTimestamp: number
    },
    claimed: {
        isClaimed: boolean
        claimedBy: string
        claimedTimestamp: number
    },
    deleted: {
        isDeleted: boolean
        deletedBy: string
        deletedTimestamp: number
    },
    reason: string
    createdTimestamp: number
}
const schema = new Schema<TicketInterface>({
    author: SchemaTypes.String,
    ticketID: SchemaTypes.String,
    closed: {
        isClosed: SchemaTypes.Boolean,
        closedBy: SchemaTypes.String,
        closedTimestamp: SchemaTypes.Number
    },
    claimed: {
        isClaimed: SchemaTypes.Boolean,
        claimedBy: SchemaTypes.String,
        claimedTimestamp: SchemaTypes.Number
    },
    deleted: {
        isDeleted: SchemaTypes.Boolean,
        deletedBy: SchemaTypes.String,
        deletedTimestamp: SchemaTypes.Number
    },
    reason: SchemaTypes.String,
    createdTimestamp: SchemaTypes.Number
})
const TicketModel = model<TicketInterface>('TicketModel', schema)
export default TicketModel