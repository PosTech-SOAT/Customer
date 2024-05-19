import { faker } from '@faker-js/faker';
import { ClientModel } from './domain/entities/Client';
import { CreateClientParams } from './domain/interfaces/repositories/IClientRepository';
import { ClientRepository } from './domain/repositories/ClientRepository';

// Mock ClientModel
jest.mock('./domain/entities/Client', () => {
	const mockClientInstance = {
		save: jest.fn(),
	};

	const ClientModel: any = jest.fn(() => mockClientInstance);

	ClientModel.findOne = jest.fn();
	ClientModel.findById = jest.fn();
	ClientModel.find = jest.fn();
	ClientModel.findOneAndUpdate = jest.fn();

	return { ClientModel };
});

describe('ClientRepository', () => {
	let clientRepository: ClientRepository;
	const params: CreateClientParams = {
		name: faker.person.firstName(),
		email: faker.internet.email(),
		cpf: faker.number.int({ min: 11111111111, max: 99999999999 }).toString(),
	};
	beforeEach(() => {
		clientRepository = new ClientRepository();
		jest.clearAllMocks();
	});

	it('should create a new client', async () => {
		const params: CreateClientParams = {
			name: 'John Doe',
			email: faker.internet.email(),
			cpf: '12345678900',
		};
		const mockClientInstance = new ClientModel();
		(mockClientInstance.save as jest.Mock).mockResolvedValue(params);

		const client = await clientRepository.createClient(params);

		expect(mockClientInstance.save).toHaveBeenCalled();
		expect(client).toEqual(params);
	});

	it('should find a client by CPF', async () => {
		const cpf = params.cpf;
		const client = { id: '1', name: 'John Doe', email: params.email, cpf: cpf };

		(ClientModel.findOne as jest.Mock).mockReturnValueOnce({
			exec: jest.fn().mockResolvedValue(client),
		});

		const foundClient = await clientRepository.findByCPF(cpf);

		expect(ClientModel.findOne).toHaveBeenCalledWith({ cpf });
		expect(foundClient).toEqual(client);
	});

	it('should find a client by ID', async () => {
		const id = '1';
		const client = { id: '1', name: 'John Doe', cpf: '12345678900' };

		(ClientModel.findById as jest.Mock).mockReturnValueOnce({
			exec: jest.fn().mockResolvedValue(client),
		});

		const foundClient = await clientRepository.findById(id);

		expect(ClientModel.findById).toHaveBeenCalledWith(id);
		expect(foundClient).toEqual(client);
	});

	it('should list all clients', async () => {
		const clients = [
			{ id: '1', name: 'John Doe', cpf: '12345678900' },
			{ id: '2', name: 'Jane Doe', cpf: '98765432100' },
		];

		(ClientModel.find as jest.Mock).mockReturnValueOnce({
			exec: jest.fn().mockResolvedValue(clients),
		});

		const allClients = await clientRepository.list();

		expect(ClientModel.find).toHaveBeenCalled();
		expect(allClients).toEqual(clients);
	});

	it('should update a client by CPF', async () => {
		const cpf = '12345678900';
		const data: CreateClientParams = {
			name: 'John Doe Updated',
			cpf: '12345678900',
			email: 'a@b.com',
		};

		(ClientModel.findOneAndUpdate as jest.Mock).mockReturnValueOnce({
			exec: jest.fn().mockResolvedValue(null),
		});

		await clientRepository.update(cpf, data);

		expect(ClientModel.findOneAndUpdate).toHaveBeenCalledWith({ cpf }, data);
	});
});
