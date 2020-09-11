import { Divider, PadText } from '@ssen/dev-server-components';
import { MirrorMessage } from '@ssen/mirror-files';
import { exec } from 'child_process';
import { Text, useInput, useStdin } from 'ink';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Observable } from 'rxjs';
import { ElectronServer } from './ElectronServer';
import { WebpackServerStatus, WebpackStats } from './types';
import { WebpackServer } from './WebpackServer';
import { format } from 'date-fns';

export interface DevServerUIProps {
  header?: ReactNode;
  webpackServer: WebpackServer;
  electronServer: ElectronServer;
  syncStaticFiles?: Observable<MirrorMessage>;
  cwd: string;
  logfile: string;
  restartAlarm?: Observable<string[]>;
  children?: ReactNode;
}

export function DevServerUI({
  header,
  webpackServer,
  electronServer,
  syncStaticFiles,
  cwd,
  logfile,
  restartAlarm,
  children,
}: DevServerUIProps) {
  const [webpackServerStatus, setWebpackServerStatus] = useState<
    WebpackServerStatus
  >(WebpackServerStatus.STARTING);
  const [webpackMainStats, setWebpackMainStats] = useState<WebpackStats>({
    status: 'waiting',
  });
  const [webpackRendererStats, setWebpackRendererStats] = useState<
    WebpackStats
  >({ status: 'waiting' });
  const [restartMessages, setRestartMessages] = useState<string[] | null>(null);
  const [syncStaticFilesMessages, setSyncStaticFilesMessages] = useState<
    MirrorMessage[]
  >([]);

  useEffect(() => {
    const statusSubscription = webpackServer
      .status()
      .subscribe(setWebpackServerStatus);
    const mainStatsSubscription = webpackServer
      .mainWebpackStats()
      .subscribe(setWebpackMainStats);
    const rendererStatsSubscription = webpackServer
      .rendererWebpackStats()
      .subscribe(setWebpackRendererStats);

    return () => {
      statusSubscription.unsubscribe();
      mainStatsSubscription.unsubscribe();
      rendererStatsSubscription.unsubscribe();
    };
  }, [webpackServer]);

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

  const webpackMainStatsJson = useMemo(() => {
    return webpackMainStats.status === 'done'
      ? webpackMainStats.statsData.toJson({
          all: false,
          errors: true,
          warnings: true,
          timings: true,
        })
      : null;
  }, [webpackMainStats]);

  const webpackRendererStatsJson = useMemo(() => {
    return webpackRendererStats.status === 'done'
      ? webpackRendererStats.statsData.toJson({
          all: false,
          errors: true,
          warnings: true,
          timings: true,
        })
      : null;
  }, [webpackRendererStats]);

  const { isRawModeSupported } = useStdin();

  useInput(
    (input) => {
      switch (input) {
        case 'r':
          electronServer.restart();
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
    },
    { isActive: isRawModeSupported === true },
  );

  return (
    <>
      {typeof header === 'string' ? <Text>{header}</Text> : header}

      <PadText title="Log" color="blueBright">
        {logfile}
      </PadText>

      {isRawModeSupported === true && (
        <PadText
          title="Keys"
          color="blueBright"
          children={`(r) Restart Electron Main (l) Open log with \`code\` (p) Open project with \`code\` (q) Quit`}
        />
      )}

      <PadText title="Server" color="blueBright">
        {webpackServerStatus === WebpackServerStatus.STARTING
          ? 'Webpack Starting...'
          : webpackServerStatus === WebpackServerStatus.STARTED
          ? 'Webpack Started!'
          : webpackServerStatus === WebpackServerStatus.CLOSING
          ? 'Webpack Closing...'
          : 'Webpack Closed.'}
      </PadText>

      {restartMessages && restartMessages.length > 0 && (
        <>
          <Divider bold color="green" delimiter="=">
            Restart Dev Server!
          </Divider>
          {restartMessages.map((message) => (
            <Text key={message} color="green">
              {message}
            </Text>
          ))}
        </>
      )}

      <Divider delimiter="=">
        {webpackMainStats.status === 'waiting'
          ? 'Webpack<main, preload> Stating...'
          : webpackMainStats.status === 'invalid'
          ? 'Webpack<main, preload> Compiling...'
          : webpackMainStatsJson
          ? `Webpack<main, preload> Compiled (${webpackMainStatsJson.time}ms)`
          : '?? Webpack<main, preload> Unknown Webpack Status ??'}
      </Divider>

      {webpackMainStatsJson && webpackMainStatsJson.errors.length > 0 && (
        <>
          <Divider bold color="redBright">
            Error
          </Divider>
          {webpackMainStatsJson.errors.map((text) => (
            <Text key={text} color="redBright">
              {text}
            </Text>
          ))}
        </>
      )}

      {webpackMainStatsJson && webpackMainStatsJson.warnings.length > 0 && (
        <>
          <Divider bold color="yellow">
            Warning
          </Divider>
          {webpackMainStatsJson.warnings.map((text) => (
            <Text key={text} color="yellow">
              {text}
            </Text>
          ))}
        </>
      )}

      <Divider delimiter="=">
        {webpackRendererStats.status === 'waiting'
          ? 'Webpack<renderer> Stating...'
          : webpackRendererStats.status === 'invalid'
          ? 'Webpack<renderer> Compiling...'
          : webpackRendererStatsJson
          ? `Webpack<renderer> Compiled (${webpackRendererStatsJson.time}ms)`
          : '?? Webpack<renderer> Unknown Webpack Status ??'}
      </Divider>

      {webpackRendererStatsJson && webpackRendererStatsJson.errors.length > 0 && (
        <>
          <Divider bold color="redBright">
            Error
          </Divider>
          {webpackRendererStatsJson.errors.map((text) => (
            <Text key={text} color="redBright">
              {text}
            </Text>
          ))}
        </>
      )}

      {webpackRendererStatsJson &&
        webpackRendererStatsJson.warnings.length > 0 && (
          <>
            <Divider bold color="yellow">
              Warning
            </Divider>
            {webpackRendererStatsJson.warnings.map((text) => (
              <Text key={text} color="yellow">
                {text}
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
    </>
  );
}
