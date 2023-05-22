import { Request, Response } from 'express'
import { ListCategoriesUseCase } from './ListCategoriesUseCase'

export class ListCategoryController {
  private listCategoriesUseCase: ListCategoriesUseCase

  constructor(listCategoriesUseCase: ListCategoriesUseCase) {
    this.listCategoriesUseCase = listCategoriesUseCase
  }

  handle(req: Request, res: Response) {
    const all = this.listCategoriesUseCase.execute()
    return res.json(all)
  }
}
