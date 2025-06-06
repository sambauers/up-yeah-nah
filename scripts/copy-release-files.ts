import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { z } from 'zod/v4'

const rootPath = resolve(__dirname, '..', '..')
const packagePath = resolve(rootPath, 'package.json')

const packageSchema = z.looseObject({
  devDependencies: z.any(),
  files: z.any(),
  packageManager: z.any(),
  scripts: z.any(),
  main: z.string().optional(),
  types: z.string().optional(),
})

const packageJson = packageSchema.parse(
  JSON.parse(readFileSync(packagePath).toString()),
)

// Create truncated package.json for distribution
const distPackagePath = resolve(rootPath, 'dist', 'package.json')

delete packageJson.devDependencies
delete packageJson.files
delete packageJson.packageManager
delete packageJson.scripts
packageJson.main = 'index.js'
packageJson.types = 'types/index.d.ts'
const distPackageContents = JSON.stringify(packageJson, null, '  ')
writeFileSync(distPackagePath, distPackageContents.concat('\n'))

// Copy README and LICENSE
const docFilePaths = [
  {
    source: resolve(rootPath, 'README.md'),
    destination: resolve(rootPath, 'dist', 'README.md'),
  },
  {
    source: resolve(rootPath, 'LICENSE.md'),
    destination: resolve(rootPath, 'dist', 'LICENSE.md'),
  },
]
docFilePaths.forEach(({ source, destination }) => {
  copyFileSync(source, destination)
})
