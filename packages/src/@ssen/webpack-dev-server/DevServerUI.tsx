import { Divider, PadText } from '@ssen/dev-server-components';
import { exec } from 'child_process';
import { format } from 'date-fns';
import { Box, Text, useInput, useStdin } from 'ink';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import os from 'os';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Observable } from 'rxjs';
import { DevServer } from './DevServer';
import { DevServerStatus, TimeMessage, WebpackStats } from './types';

export interface DevServerUIProps {
  header?: ReactNode;
  devServer: DevServer;
  cwd: string;
  logfile: string;
  proxyMessage?: Observable<TimeMessage[]>;
  restartAlarm?: Observable<string[]>;
  children?: ReactNode;
  exit: () => void;
}

export function DevServerUI({
  header,
  devServer,
  cwd,
  logfile,
  proxyMessage,
  restartAlarm,
  children,
  exit,
}: DevServerUIProps) {
  const [status, setStatus] = useState<DevServerStatus>(
    DevServerStatus.STARTING,
  );
  const [webpackStats, setWebpackStats] = useState<WebpackStats>({
    status: 'waiting',
  });
  const [restartMessages, setRestartMessages] = useState<string[] | null>(null);
  const [proxyMessages, setProxyMessages] = useState<TimeMessage[]>([]);

  useEffect(() => {
    const statusSubscription = devServer.status().subscribe(setStatus);
    const webpackStatsSubscription = devServer
      .webpackStats()
      .subscribe(setWebpackStats);

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
    (input, key) => {
      if (input === 'q' || (input === 'c' && key.ctrl)) {
        exit();
      }

      switch (input) {
        case 'b':
          if (os.platform() === 'win32') {
            exec(`start ${devServer.url}`);
          } else {
            exec(`open ${devServer.url}`);
          }
          break;
        case 'l':
          exec(`code ${logfile}`);
          break;
        case 'p':
          exec(`code ${cwd}`);
          break;
      }
    },
    { isActive: isRawModeSupported === true },
  );

  const [, height] = useStdoutDimensions();

  return (
    <Box minHeight={height} flexDirection="column">
      {typeof header === 'string' ? <Text>{header}</Text> : header}

      <PadText title="Log" color="blueBright">
        {logfile}
      </PadText>

      {isRawModeSupported === true && (
        <PadText
          title="Keys"
          color="blueBright"
          children={`(b) Open ${devServer.url} (l) Open log with \`code\` (p) Open project with \`code\` (q) Quit`}
        />
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
          {webpackStatsJson.errors.map((text: string) => (
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
          {webpackStatsJson.warnings.map((text: string) => (
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
                color={
                  level === 'error'
                    ? 'red'
                    : level === 'warn'
                    ? 'yellow'
                    : undefined
                }
                dimColor={i > 3}
              >
                [{format(new Date(time), 'hh:mm:ss')}] {message}
              </Text>
            ))}
        </>
      )}

      {children}
    </Box>
  );
}
