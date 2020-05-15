import {Router} from 'express'
import {parseISO, parse} from 'date-fns'
import {getCustomRepository} from 'typeorm'
import AppointmentsRepository from '../../../../modules/appointments/repositories/AppointmentsRepository'
import CreateAppointmentService from '../../../../modules/appointments/services/CreateAppointmentService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const appointmentsRouter = Router()

//aplica o middleware(token jwt) em todas as rotas, caso queira adicionar em uma rota especifica basta
//colocar o ensureAuthenticated antes do async e do request response
appointmentsRouter.use(ensureAuthenticated)

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository =  getCustomRepository(AppointmentsRepository)
  //chama o método que lista todos os agendamentos
  const appointments = await appointmentsRepository.find()

  return response.json(appointments)
})

appointmentsRouter.post('/', async (request, response) => {

  const {provider_id, date} = request.body

  //a data é convertido para o formato ISO
  const parsedDate = parseISO(date)

  const createAppointment = new CreateAppointmentService()

  const appointment = await createAppointment.execute({provider_id, date: parsedDate})

  return response.json(appointment)

})

export default appointmentsRouter