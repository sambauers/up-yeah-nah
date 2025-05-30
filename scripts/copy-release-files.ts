import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { z } from 'zod'

const packagePath = resolve(__dirname, '..', 'package.json')

const packageSchema = z
  .object({
    devDependencies: z.any(),
    files: z.any(),
    packageManager: z.any(),
    scripts: z.any(),
    main: z.string().optional(),
    types: z.string().optional(),
  })
  .passthrough()

const packageJson = packageSchema.parse(
  JSON.parse(readFileSync(packagePath).toString()),
)

// Create truncated package.json for distribution
const distPackagePath = resolve(__dirname, '..', 'dist', 'package.json')

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
    source: resolve(__dirname, '..', 'README.md'),
    destination: resolve(__dirname, '..', 'dist', 'README.md'),
  },
  {
    source: resolve(__dirname, '..', 'LICENSE.md'),
    destination: resolve(__dirname, '..', 'dist', 'LICENSE.md'),
  },
]
docFilePaths.forEach(({ source, destination }) => {
  copyFileSync(source, destination)
})
