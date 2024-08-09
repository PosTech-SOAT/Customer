import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { LGPDFormDto } from '../../infra/dto/LGPDFormDto';

export type ILGPDForm = {
	_id: string;
	clientId: string;
} & LGPDFormDto &
	Document;

const lgpdFormSchema: Schema = new Schema(
	{
		_id: { type: String, default: uuidv4 },
		cliendId: { type: String, default: uuidv4 },
		userId: { type: String, required: true },
		name: { type: String, required: true },
		address: { type: String, required: true },
		phone: { type: String, required: true },
		exclusion: { type: Boolean, required: true },
	},
	{ timestamps: true },
);

export const LgpdFormModel = mongoose.model<ILGPDForm>(
	'LGPDForm',
	lgpdFormSchema,
);
