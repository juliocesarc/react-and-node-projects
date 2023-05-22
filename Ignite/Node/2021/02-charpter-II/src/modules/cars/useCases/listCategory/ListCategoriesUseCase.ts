import { Category } from '../../model/Category'
import { CategoriesRepository } from '../../repositories/implementations/CategoriesRepository'

export class ListCategoriesUseCase {
  private categoriesRepositorie: CategoriesRepository

  constructor(categoriesRepositorie: CategoriesRepository) {
    this.categoriesRepositorie = categoriesRepositorie
  }

  execute(): Category[] {
    const categories = this.categoriesRepositorie.list()
    return categories
  }
}
