import { copyTmpDirectory } from '../../../@ssen/tmp-directory';
import { exec } from 'child_process';
import { Color, render } from 'ink';
import path from 'path';
import { AppEntry } from '../rules/getAppEntry';
import { useAppEntry } from '../rules/useAppEntry';
import React from 'react';

function Test({ appDir }: { appDir: string }) {
  const entry: AppEntry[] | null = useAppEntry({ appDir });

  return (
    <>
      {entry?.map(({ name }) => (
        <Color blue>{name}</Color>
      ))}
    </>
  );
}

copyTmpDirectory(process.cwd(), 'test/fixtures/web/useAppEntry').then((cwd) => {
  render(<Test appDir={path.join(cwd)} />);
  exec(`open ${cwd}`);
});
