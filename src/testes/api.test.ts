import request from 'supertest';
import { app } from '..';
import { faker } from '@faker-js/faker';
function delay() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(true);
		}, 3000);
	});
}
describe('Testando o endpoint /api/clients', () => {
	const mockClient = {
		name: faker.person.firstName(),
		email: faker.internet.email(),
		cpf: faker.number.int({ min: 11111111111, max: 99999999999 }).toString(),
	};
	beforeAll(async () => {
		await delay();
	});

	test('Deve retornar uma lista de clientes', async () => {
		const response = await request(app).get('/api/clients');
		expect(response.status).toBe(200);
		expect(response.body).toBeInstanceOf(Array); // Verifica se a resposta é um array
		expect(response.body.length).toBeGreaterThanOrEqual(0); // Verifica se há pelo menos 0 clientes retornados
	}, 50000);

	test('Deve criar um novo cliente quando enviado um POST valido.', async () => {
		const response = await request(app).post('/api/clients').send(mockClient);

		expect(response.status).toBe(201); // Verifica se o status é 201 (Created)
		expect(response.body).toHaveProperty(
			'message',
			'Client created successfully',
		); // Verifica se a mensagem de sucesso é retornada
	});

	test('Deve falhar criação de um novo cliente. Campos insuficientes.', async () => {
		const response = await request(app)
			.post('/api/clients')
			.send({ name: 'teste' });

		expect(response.status).toBe(400); // Verifica se o status é 400 (bad request)
		expect(response.body).toHaveProperty('message', 'Missing required data'); // Verifica mensagem de erro
	});

	test('Deve buscar um cliente inexistente por CPF.', async () => {
		const response = await request(app).post('/api/clients').send(mockClient);

		expect(response.status).toBe(400); // Verifica se o status é 201 (Created)
		expect(response.body).toHaveProperty(
			'message',
			'CPF already exists in the database',
		); // Verifica se a mensagem de sucesso é retornada
	});

	test('Deve atualizar um cliente quando enviado um PATCH válido', async () => {
		const cpf = mockClient.cpf;
		const updatedClient = {
			name: faker.person.firstName(),
			email: faker.internet.email(),
			cpf: mockClient.cpf,
		};

		const response = await request(app)
			.patch(`/api/clients/${cpf}`)
			.send(updatedClient);

		expect(response.status).toBe(200); // Verifica se o status é 200 (OK)
		expect(response.body).toHaveProperty(
			'message',
			'Client updated successfully',
		); // Verifica se a mensagem de sucesso é retornada
	});

	test('Deve retornar um cliente quando enviado um CPF como parâmetro', async () => {
		const cpf = mockClient.cpf;

		const response = await request(app).get(`/api/clients/${cpf}`);

		expect(response.status).toBe(200); // Verifica se o status é 200 (OK)
		expect(response.body).toHaveProperty('cpf', cpf); // Verifica se o CPF do cliente retornado é igual ao CPF enviado como parâmetro
	});

	test('Deve retornar um cliente quando enviado um ID como parâmetro', async () => {
		const uuid = '7e168a6f-6f70-41a8-ad42-06d9e98c89b9';

		const response = await request(app).get(`/api/clients/${uuid}`);

		expect(response.status).toBe(200); // Verifica se o status é 200 (OK)
		expect(response.body).toHaveProperty('id', uuid); // Verifica se o ID do cliente retornado é igual ao ID enviado como parâmetro
	});

	test('Deve buscar um cliente inexistente por CPF', async () => {
		const cpf = 'weqewqeqeqeq';

		const response = await request(app).get(`/api/clients/${cpf}`);

		expect(response.status).toBe(200); // Verifica se o status é 200 (OK)
		// expect(response.body).toHaveProperty('id', cpf); // Verifica se o ID do cliente retornado é igual ao ID enviado como parâmetro
	});

	test('Deve buscar um cliente inexistente por ID', async () => {
		const uuid = '0e000a6f-6f70-41a8-ad42-06d9e98c89b9';

		const response = await request(app).get(`/api/clients/${uuid}`);

		expect(response.status).toBe(200); // Verifica se o status é 200 (OK)
		// expect(response.body).toHaveProperty('id', cpf); // Verifica se o ID do cliente retornado é igual ao ID enviado como parâmetro
	});
});
