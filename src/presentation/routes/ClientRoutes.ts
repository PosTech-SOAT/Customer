import { Router } from 'express';

import ClientController from '../../infra/controllers/ClientController';
import { isUUID } from '../../utils/StringUtils';

const clientRoutes = Router();

const clientController = new ClientController();

clientRoutes.post('/', clientController.create);
clientRoutes.get('/', clientController.list);
clientRoutes.patch('/:cpf', clientController.update);
clientRoutes.get('/:param', async (req, res) => {
	const { param } = req.params;

	if (isUUID(param)) {
		return clientController.findById(req, res);
	} else {
		return clientController.findByCpf(req, res);
	}
});
clientRoutes.delete('/lgpd', clientController.lgpd);

export default clientRoutes;
