import { CategoriesRepository } from '../../repositories/implementations/CategoriesRepository'
import { ImportCategoryController } from './ImportCategoryController'
import { ImportCategoryUseCases } from './ImportCategoryUseCase'

const categoriesRepository = CategoriesRepository.getInstance()
const importCategoryUseCase = new ImportCategoryUseCases(categoriesRepository)
export const importCategoryController = new ImportCategoryController(
  importCategoryUseCase,
)
