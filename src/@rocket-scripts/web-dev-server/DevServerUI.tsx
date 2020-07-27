import { Color, Text } from 'ink';
import React, { useEffect, useMemo, useState } from 'react';
import { DevServer } from './DevServer';
import { DevServerStatus, WebpackStats } from './types';

export interface DevServerUIProps {
  devServer: DevServer;
  logfile: string;
}

export function DevServerUI({ devServer, logfile }: DevServerUIProps) {
  const [status, setStatus] = useState<DevServerStatus>(DevServerStatus.STARTING);
  const [webpackStats, setWebpackStats] = useState<WebpackStats>({ status: 'waiting' });

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
        })
      : null;
  }, [webpackStats]);

  //useInput()

  return (
    <>
      <Text>Log : {logfile}</Text>
      <Text>Status : {status}</Text>
      {webpackStats.status === 'waiting' && (
        <Color bold blueBright>
          Compiling...
        </Color>
      )}
      {webpackStats.status === 'done' && webpackStatsJson && webpackStatsJson.errors.length > 0 && (
        <>
          <Color bold redBright>
            Errors...
          </Color>
          {webpackStatsJson.errors.map((text) => (
            <Color key={text} red>
              {text}
            </Color>
          ))}
        </>
      )}
      {webpackStats.status === 'done' && webpackStatsJson && webpackStatsJson.warnings.length > 0 && (
        <>
          <Color bold yellowBright>
            Warnings...
          </Color>
          {webpackStatsJson.warnings.map((text) => (
            <Color key={text} yellow>
              {text}
            </Color>
          ))}
        </>
      )}
    </>
  );
}
