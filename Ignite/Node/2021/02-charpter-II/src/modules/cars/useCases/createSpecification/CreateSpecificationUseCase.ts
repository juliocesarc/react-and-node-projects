import { ISpecificationRepository } from '../../repositories/ISpecificationRepository'

interface IRequest {
  name: string
  description: string
}

export class CreateSpecificationUseCase {
  private specificationRepository: ISpecificationRepository

  constructor(specificationRepository: ISpecificationRepository) {
    this.specificationRepository = specificationRepository
  }

  execute({ name, description }: IRequest) {
    const specificationAlreadyExists =
      this.specificationRepository.findByName(name)

    if (specificationAlreadyExists) {
      throw new Error('This specification already exists!')
    }

    this.specificationRepository.create({
      name,
      description,
    })
  }
}
