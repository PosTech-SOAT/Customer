import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ClientCreateUseCase from '../../domain/use-cases/Client/ClientCreateUseCase';
import ClientListUseCase from '../../domain/use-cases/Client/ClientListUseCase';
import ClientFindOneByCpfUseCase from '../../domain/use-cases/Client/ClientFindOneByCpfUseCase';
import ClientUpdateUseCase from '../../domain/use-cases/Client/ClientUpdateUseCase';
import ClientFindOneByIdUseCase from '../../domain/use-cases/Client/ClientFindOneByIdUseCase';
import { LGPDFormDto } from '../dto/LGPDFormDto';
import { IClient } from '../entities/ClientEntity';
import { isUUID } from '../../utils/StringUtils';
import ClientLgpdUseCase from '../../domain/use-cases/Client/ClientLgpdUseCase';

export default class ClientController {
	async create(request: Request, response: Response) {
		const { name, email, cpf } = request.body;

		if (!name || !email || !cpf) {
			return response.status(400).json({ message: 'Missing required data' });
		}

		const createClientUseCase = container.resolve(ClientCreateUseCase);

		try {
			await createClientUseCase.execute({ name, email, cpf });

			return response
				.status(201)
				.json({ message: 'Client created successfully' });
		} catch (error: any) {
			return response.status(400).json({ message: error.message });
		}
	}

	async list(request: Request, response: Response) {
		const clientListUseCase = container.resolve(ClientListUseCase);

		try {
			const clients = await clientListUseCase.execute();

			return response.status(200).json(clients);
		} catch (error: any) {
			return response.status(400).json({ message: error.message });
		}
	}

	async findById(request: Request, response: Response) {
		const clientByIdUseCase = container.resolve(ClientFindOneByIdUseCase);

		try {
			const client = await clientByIdUseCase.execute(request.params.param);

			return response.status(200).json(client);
		} catch (error: any) {
			return response.status(400).json({ message: error.message });
		}
	}

	async findByCpf(request: Request, response: Response) {
		const clientByCpfUsecase = container.resolve(ClientFindOneByCpfUseCase);

		try {
			const client = await clientByCpfUsecase.execute(request.params.param);

			return response.status(200).json(client);
		} catch (error: any) {
			return response.status(400).json({ message: error.message });
		}
	}

	async update(request: Request, response: Response) {
		const clientListUseCase = container.resolve(ClientUpdateUseCase);

		try {
			await clientListUseCase.execute({
				id: request.params.cpf,
				params: request.body,
			});
			return response
				.status(200)
				.json({ message: 'Client updated successfully' });
		} catch (error: any) {
			return response.status(400).json({ message: error.message });
		}
	}

	async lgpd(request: Request, response: Response) {
		try {
			const form: LGPDFormDto = request.body;
			let client: IClient | null;
			if (isUUID(form.userId)) {
				client = await container
					.resolve(ClientFindOneByIdUseCase)
					.execute(form.userId);
			} else {
				client = await container
					.resolve(ClientFindOneByCpfUseCase)
					.execute(form.userId);
			}
			if (!client) {
				throw new Error('Client not found!');
			}
			const clientLgpdUseCase = container.resolve(ClientLgpdUseCase);
			await clientLgpdUseCase.execute({ client, form });
			return response
				.status(200)
				.json({ message: 'Client updated successfully' });
		} catch (error: any) {
			return response.status(400).json({ message: error.message });
		}
	}
}
