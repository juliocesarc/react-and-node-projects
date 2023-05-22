import { Request, Response } from 'express'
import { ImportCategoryUseCases } from './ImportCategoryUseCase'

export class ImportCategoryController {
  private importCategoryController: ImportCategoryUseCases

  constructor(importCategoryController: ImportCategoryUseCases) {
    this.importCategoryController = importCategoryController
  }

  handle(req: Request, res: Response) {
    const { file } = req
    this.importCategoryController.execute(file)
    return res.send()
  }
}
