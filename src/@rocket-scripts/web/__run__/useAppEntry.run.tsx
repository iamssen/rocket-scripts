import { copyTmpDirectory } from '@ssen/tmp-directory';
import { exec } from 'child_process';
import { render, Text } from 'ink';
import path from 'path';
import React from 'react';
import { AppEntry } from '../rules/getAppEntry';
import { useAppEntry } from '../rules/useAppEntry';

function Test({ appDir }: { appDir: string }) {
  const entry: AppEntry[] | null = useAppEntry({ appDir });

  return (
    <>
      {entry?.map(({ name }) => (
        <Text>{name}</Text>
      ))}
    </>
  );
}

copyTmpDirectory(process.cwd(), 'test/fixtures/web/useAppEntry').then((cwd) => {
  render(<Test appDir={path.join(cwd)} />);
  exec(`open ${cwd}`);
});
