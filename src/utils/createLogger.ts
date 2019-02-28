// tslint:disable:no-any
export function createLogger() {
  const messages: any[][] = [];
  
  function log(...message: any[]) {
    messages.push(message);
  }
  
  function flush() {
    for (const message of messages) {
      console.log(...message);
    }
    
    messages.length = 0;
  }
  
  return {log, flush};
}