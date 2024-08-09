import { LGPDFormDto } from '../../infra/dto/LGPDFormDto';
import { ClientModel, IClient } from '../entities/Client';
import { ILGPDForm, LgpdFormModel } from '../entities/LGPDForm';
import {
	CreateClientParams,
	IClientRepository,
} from '../interfaces/repositories/IClientRepository';

export class ClientRepository implements IClientRepository {
	async createClient(params: CreateClientParams): Promise<IClient> {
		const client = new ClientModel(params);
		return client.save();
	}

	async findByCPF(cpf: string): Promise<IClient | null> {
		return ClientModel.findOne({ cpf }).exec();
	}

	async findById(id: string): Promise<IClient | null> {
		return ClientModel.findById(id).exec();
	}

	async list(): Promise<IClient[]> {
		return ClientModel.find().exec();
	}

	async update(cpf: string, data: CreateClientParams): Promise<void> {
		await ClientModel.findOneAndUpdate({ cpf }, data).exec();
	}

	async delete(id: string): Promise<void> {
		await ClientModel.deleteOne({ _id: id }).exec();
	}

	async createLGPDReport(
		clientId: string,
		form: LGPDFormDto,
	): Promise<ILGPDForm> {
		const lgpdForm = new LgpdFormModel({ clientId, ...form });
		return lgpdForm.save();
	}
}
