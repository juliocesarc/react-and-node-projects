import { CategoriesRepository } from '../../repositories/implementations/CategoriesRepository'
import { ListCategoriesUseCase } from './ListCategoriesUseCase'
import { ListCategoryController } from './ListCategoryController'

const categoriesRepository = CategoriesRepository.getInstance()
const listCategoriesUseCase = new ListCategoriesUseCase(categoriesRepository)
export const listCategoryController = new ListCategoryController(
  listCategoriesUseCase,
)
