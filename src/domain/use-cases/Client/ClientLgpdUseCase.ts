/* eslint-disable indent */
import { inject, injectable } from 'tsyringe';
import {
	CreateClientParams,
	IClientRepository,
} from '../../interfaces/repositories/IClientRepository';
import { IBaseUseCase } from '../../interfaces/use-cases/IBaseUseCase';
import {
	LGPDFormDto,
	LGPDStatusExecution,
} from '../../../infra/dto/LGPDFormDto';
import { IClient } from '../../../infra/entities/ClientEntity';
import rabbitMqInstance from '../../../data/data-sources/factories/RabbitMqInstance';

type ClientLgpdUseCaseParams = {
	form: LGPDFormDto;
	client: IClient;
};

@injectable()
export default class ClientLgpdUseCase
	implements IBaseUseCase<ClientLgpdUseCaseParams, any>
{
	constructor(
		@inject('ClientRepository')
		private clientRepository: IClientRepository,
	) {}

	async execute({ form, client }: ClientLgpdUseCaseParams): Promise<any> {
		try {
			await rabbitMqInstance.start();
			await rabbitMqInstance.enQueue(
				'lgpd_execution',
				JSON.stringify({ id: client.id, exclude: form.exclusion }),
			);
			const handleConclusion = async (id: string) => {
				try {
					await this.clientRepository.delete(id);
					await this.clientRepository.createLGPDReport(id, form);
				} catch {
					// handle update of LGPD table
				}
			};
			rabbitMqInstance.listen('lgpd_conclusion', async (message) => {
				const { id, status } = JSON.parse(message.content.toString());
				if (status === LGPDStatusExecution.SUCCESS) {
					await handleConclusion(id);
				}
			});
		} catch {
			return Promise.reject();
		}
	}
}
