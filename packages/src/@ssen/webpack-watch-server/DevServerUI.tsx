import { Divider, PadText } from '@ssen/dev-server-components';
import { MirrorMessage } from '@ssen/mirror-files';
import { exec } from 'child_process';
import { format } from 'date-fns';
import { Box, Text, useInput, useStdin } from 'ink';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Observable } from 'rxjs';
import { DevServer } from './DevServer';
import { DevServerStatus, WebpackStats } from './types';

export interface DevServerUIProps {
  header?: ReactNode;
  devServer: DevServer;
  syncStaticFiles?: Observable<MirrorMessage>;
  cwd: string;
  logfile: string;
  restartAlarm?: Observable<string[]>;
  children?: ReactNode;
  exit: () => void;
}

export function DevServerUI({
  header,
  devServer,
  syncStaticFiles,
  cwd,
  logfile,
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
  const [syncStaticFilesMessages, setSyncStaticFilesMessages] = useState<
    MirrorMessage[]
  >([]);

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
    if (syncStaticFiles) {
      const subscription = syncStaticFiles.subscribe((message) => {
        setSyncStaticFilesMessages((prev) => {
          return [message, ...prev].slice(0, 5);
        });
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [syncStaticFiles]);

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
          children={`(l) Open log with \`code\` (p) Open project with \`code\` (q) Quit`}
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
          ? Array.isArray(webpackStatsJson.children)
            ? `Compiled (${webpackStatsJson.children
                .map(({ time }) => time + 'ms')
                .join(', ')})`
            : `Compiled (${webpackStatsJson.time}ms)`
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

      {webpackStatsJson?.errors && webpackStatsJson.errors.length > 0 && (
        <>
          <Divider bold color="redBright">
            Error
          </Divider>
          {webpackStatsJson.errors.map((error) => (
            <Text key={error.message} color="redBright">
              {JSON.stringify(error)}
            </Text>
          ))}
        </>
      )}

      {webpackStatsJson?.warnings && webpackStatsJson.warnings.length > 0 && (
        <>
          <Divider bold color="yellow">
            Warning
          </Divider>
          {webpackStatsJson.warnings.map((warning) => (
            <Text key={warning.message} color="yellow">
              {JSON.stringify(warning)}
            </Text>
          ))}
        </>
      )}

      {syncStaticFilesMessages.length > 0 && (
        <>
          <Divider bold>Sync Static Files</Divider>
          {syncStaticFilesMessages.map(({ type, file, time }, i) => (
            <Text
              key={file + time.getTime()}
              color={type === 'undefined' ? 'red' : undefined}
              dimColor={i > 3}
            >
              [{format(time, 'hh:mm:ss')}] [{type}] {file}
            </Text>
          ))}
        </>
      )}

      {children}
    </Box>
  );
}
