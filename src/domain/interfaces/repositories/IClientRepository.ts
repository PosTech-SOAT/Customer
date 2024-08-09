import { LGPDFormDto } from '../../../infra/dto/LGPDFormDto';
import { IClient } from '../../entities/Client';
import { ILGPDForm } from '../../entities/LGPDForm';

export type CreateClientParams = {
	name: string;
	email: string;
	cpf: string;
};

export interface IClientRepository {
	createClient(params: CreateClientParams): Promise<IClient>;
	findById(id: string): Promise<IClient | null>;
	findByCPF(cpf: string): Promise<IClient | null>;
	list(): Promise<IClient[]>;
	update(cpf: string, params: CreateClientParams): Promise<void>;
	delete(id: string): Promise<void>;
	createLGPDReport(clientId: string, form: LGPDFormDto): Promise<ILGPDForm>;
}
