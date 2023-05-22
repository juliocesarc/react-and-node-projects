import fs from 'node:fs'
import { Express } from 'express'
import { parse } from 'csv-parse'
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository'

interface IImportCategory {
  name: string
  description: string
}

export class ImportCategoryUseCases {
  private categoriesRepository: ICategoriesRepository

  constructor(categoriesRepository: ICategoriesRepository) {
    this.categoriesRepository = categoriesRepository
  }

  loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path)
      const categories: IImportCategory[] = []

      const parseFile = parse()

      stream.pipe(parseFile)

      parseFile
        .on('data', async (line: any) => {
          const [name, description] = line
          categories.push({
            name,
            description,
          })
        })
        .on('end', () => {
          fs.promises.unlink(file.path)
          resolve(categories)
        })
        .on('error', (err) => {
          reject(err)
        })
    })
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file)

    categories.map(async (categorie) => {
      const { name, description } = categorie

      const existCategorie = this.categoriesRepository.findByName(name)

      if (existCategorie) {
        this.categoriesRepository.create({
          name,
          description,
        })
      }
    })
  }
}
