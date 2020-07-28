import { Text } from 'ink';
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
      <Text bold color="blueBright">
        Log : {logfile}
      </Text>
      <Text>Status : {status}</Text>
      {webpackStats.status === 'waiting' && (
        <Text bold color="" backgroundColor="">
          Compiling...
        </Text>
      )}
      {webpackStats.status === 'done' && webpackStatsJson && webpackStatsJson.errors.length > 0 && (
        <>
          <Text bold color="redBright">
            Errors...
          </Text>
          {webpackStatsJson.errors.map((text) => (
            <Text key={text} color="red">
              {text}
            </Text>
          ))}
        </>
      )}
      {webpackStats.status === 'done' && webpackStatsJson && webpackStatsJson.warnings.length > 0 && (
        <>
          <Text bold color="yellowBright">
            Warnings...
          </Text>
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
