import { Request, Response } from 'express'
import { CreateCategoryUseCase } from './CreateCategoryUseCase'

export class CreateCategoryController {
  private createCategoryUseCase: CreateCategoryUseCase

  constructor(createCategoryUseCase: CreateCategoryUseCase) {
    this.createCategoryUseCase = createCategoryUseCase
  }

  handle(req: Request, res: Response) {
    const { name, description } = req.body

    this.createCategoryUseCase.execute({ name, description })

    return res.status(201).send()
  }
}
