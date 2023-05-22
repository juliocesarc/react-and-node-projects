import { ICategoriesRepository } from '../../repositories/ICategoriesRepository'

interface IRequest {
  name: string
  description: string
}

export class CreateCategoryUseCase {
  private categoriesRepository: ICategoriesRepository

  constructor(categoriesRepository: ICategoriesRepository) {
    this.categoriesRepository = categoriesRepository
  }

  execute({ name, description }: IRequest): void {
    const categoryAlreadyExists = this.categoriesRepository.findByName(name)

    if (categoryAlreadyExists) {
      throw new Error('This category already exists!')
      //   return res.status(401).json({
      //     error: 'This category already exists',
      //   })
    }

    this.categoriesRepository.create({ name, description })
  }
}
