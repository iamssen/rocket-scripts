import { Divider } from '@rocket-scripts/web-dev-server/components/Divider';
import { exec } from 'child_process';
import { Text, useInput } from 'ink';
import React, { useEffect, useMemo, useState } from 'react';
import { PadText } from './components/PadText';
import { DevServer } from './DevServer';
import { DevServerStatus, WebpackStats } from './types';

export interface DevServerUIProps {
  header?: string;
  devServer: DevServer;
  cwd: string;
  logfile: string;
}

export function DevServerUI({ header, devServer, cwd, logfile }: DevServerUIProps) {
  const [status, setStatus] = useState<DevServerStatus>(DevServerStatus.STARTING);
  const [webpackStats, setWebpackStats] = useState<WebpackStats>({ status: 'waiting' });
  const [showDetails, setShowDetails] = useState<boolean>(true);

  useEffect(() => {
    const statusSubscription = devServer.status().subscribe(setStatus);
    const webpackStatsSubscription = devServer.webpackStats().subscribe(setWebpackStats);

    return () => {
      statusSubscription.unsubscribe();
      webpackStatsSubscription.unsubscribe();
    };
  }, [devServer]);

  const webpackStatsJson = useMemo(() => {
    return webpackStats.status === 'done'
      ? webpackStats.statsData.toJson({
          all: false,
          errors: true,
          warnings: true,
          timings: true,
        })
      : null;
  }, [webpackStats]);

  useInput((input, key) => {
    switch (input) {
      case 'd':
        setShowDetails((prev) => !prev);
        break;
      case 'l':
        exec(`code ${logfile}`);
        break;
      case 'p':
        exec(`code ${cwd}`);
        break;
      case 'q':
        process.exit();
        break;
    }
  });

  return (
    <>
      {typeof header === 'string' && <Text color="gray">{header}</Text>}

      <PadText title="Log" color="blueBright">
        {logfile}
      </PadText>

      <PadText title="Keys" color="blueBright">
        (d) Toggle Details (l) Open log with `code` (p) Open project with `code` (q) Quit
      </PadText>

      <PadText title="Server" color="blueBright">
        {status === DevServerStatus.STARTING
          ? 'DevServer Starting...'
          : status === DevServerStatus.STARTED
          ? 'DevServer Started!'
          : status === DevServerStatus.CLOSING
          ? 'DevServer Closing...'
          : 'DevServer Closed.'}
      </PadText>

      <Divider>
        {webpackStats.status === 'waiting'
          ? 'Server Stating'
          : webpackStats.status === 'invalid'
          ? 'Compiling'
          : webpackStatsJson
          ? `Compiled (${webpackStatsJson.time}ms)`
          : '?'}
      </Divider>

      {webpackStatsJson && webpackStatsJson.errors.length > 0 && (
        <>
          <Divider bold color="redBright">
            Error
          </Divider>
          {webpackStatsJson.errors.map((text) => (
            <Text key={text} color="redBright">
              {text}
            </Text>
          ))}
        </>
      )}

      {webpackStatsJson && webpackStatsJson.warnings.length > 0 && (
        <>
          <Divider bold color="yellow">
            Warning
          </Divider>
          {webpackStatsJson.warnings.map((text) => (
            <Text key={text} color="yellow">
              {text}
            </Text>
          ))}
        </>
      )}
    </>
  );
}
