import { exec } from 'child_process';
import { format } from 'date-fns';
import { Text, useInput, useStdin } from 'ink';
import React, { useEffect, useMemo, useState } from 'react';
import { Observable } from 'rxjs';
import { Divider } from './components/Divider';
import { PadText } from './components/PadText';
import { DevServer } from './DevServer';
import { DevServerStatus, TimeMessage, WebpackStats } from './types';

export interface DevServerUIProps {
  header?: string;
  devServer: DevServer;
  cwd: string;
  logfile: string;
  proxyMessage?: Observable<TimeMessage[]>;
  restartAlarm?: Observable<string[]>;
}

export function DevServerUI({
  header,
  devServer,
  cwd,
  logfile,
  proxyMessage,
  restartAlarm,
}: DevServerUIProps) {
  const [status, setStatus] = useState<DevServerStatus>(DevServerStatus.STARTING);
  const [webpackStats, setWebpackStats] = useState<WebpackStats>({ status: 'waiting' });
  const [restartMessages, setRestartMessages] = useState<string[] | null>(null);
  const [proxyMessages, setProxyMessages] = useState<TimeMessage[]>([]);

  useEffect(() => {
    const statusSubscription = devServer.status().subscribe(setStatus);
    const webpackStatsSubscription = devServer.webpackStats().subscribe(setWebpackStats);

    return () => {
      statusSubscription.unsubscribe();
      webpackStatsSubscription.unsubscribe();
    };
  }, [devServer]);

  useEffect(() => {
    if (restartAlarm) {
      const subscription = restartAlarm.subscribe((next) => {
        if (next.some((message) => !!message)) {
          setRestartMessages(next.filter((message) => !!message));
        } else {
          setRestartMessages(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setRestartMessages(null);
    }
  }, [restartAlarm]);

  useEffect(() => {
    if (proxyMessage) {
      const subscription = proxyMessage.subscribe((messages) => {
        setProxyMessages(messages);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [proxyMessage]);

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

  const { isRawModeSupported } = useStdin();

  useInput(
    (input) => {
      switch (input) {
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
    },
    { isActive: isRawModeSupported === true },
  );

  return (
    <>
      {typeof header === 'string' && <Text color="gray">{header}</Text>}

      <PadText title="Log" color="blueBright">
        {logfile}
      </PadText>

      {isRawModeSupported === true && (
        <PadText title="Keys" color="blueBright">
          (l) Open log with `code` (p) Open project with `code` (q) Quit
        </PadText>
      )}

      <PadText title="Server" color="blueBright">
        {status === DevServerStatus.STARTING
          ? 'DevServer Starting...'
          : status === DevServerStatus.STARTED
          ? 'DevServer Started!'
          : status === DevServerStatus.CLOSING
          ? 'DevServer Closing...'
          : 'DevServer Closed.'}
      </PadText>

      <Divider delimiter="=">
        {webpackStats.status === 'waiting'
          ? 'Server Stating...'
          : webpackStats.status === 'invalid'
          ? 'Compiling...'
          : webpackStatsJson
          ? `Compiled (${webpackStatsJson.time}ms)`
          : '?? Unknown Webpack Status ??'}
      </Divider>

      {restartMessages && restartMessages.length > 0 && (
        <>
          <Divider bold color="green">
            Restart server!
          </Divider>
          {restartMessages.map((message) => (
            <Text key={message} color="green">
              {message}
            </Text>
          ))}
        </>
      )}

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

      {proxyMessages.length > 0 && (
        <>
          <Divider bold>Proxy</Divider>
          {proxyMessages
            .slice()
            .reverse()
            .map(({ message, level, time }, i) => (
              <Text
                key={message + time}
                color={level === 'error' ? 'red' : level === 'warn' ? 'yellow' : undefined}
                dimColor={i > 3}
              >
                [{format(new Date(time), 'hh:mm:ss')}] {message}
              </Text>
            ))}
        </>
      )}
    </>
  );
}
