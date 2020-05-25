import { requireTypescript } from '@ssen/require-typescript';
import fs from 'fs-extra';
import path from 'path';
import { BuildTransformFile, buildTransformFileName } from '../rule';

interface Params {
  packageDir: string;
}

export async function getBuildTransform({ packageDir }: Params): Promise<BuildTransformFile> {
  const file: string = path.join(packageDir, buildTransformFileName);

  return fs.existsSync(file) ? requireTypescript<BuildTransformFile>(file) : {};
}
