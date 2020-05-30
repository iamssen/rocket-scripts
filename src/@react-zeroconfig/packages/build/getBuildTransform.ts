import { requireTypescript } from '@ssen/require-typescript';
import path from 'path';
import { BuildTransformFile, buildTransformFileName } from '../rule';

interface Params {
  packageDir: string;
}

export async function getBuildTransform({ packageDir }: Params): Promise<BuildTransformFile> {
  const file: string = path.join(packageDir, buildTransformFileName);

  try {
    return requireTypescript<BuildTransformFile>(file);
  } catch {
    return {};
  }
}
