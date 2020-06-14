import { Color, render } from 'ink';
import React, { useEffect, useState } from 'react';
import { BehaviorSubject, Subscription } from 'rxjs';

const subject: BehaviorSubject<string> = new BehaviorSubject<string>('hello');

setTimeout(() => {
  subject.next('World!');
}, 5000);

function useCounter() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const intervalId: NodeJS.Timeout = setInterval(() => {
      setCount((value) => value + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return count;
}

function App() {
  const [text, setText] = useState(() => subject.getValue());

  useEffect(() => {
    const subscription: Subscription = subject.subscribe((value) => setText(value));

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const count: number = useCounter();

  return (
    <>
      <Color red bold>
        {text}
      </Color>
      <Color yellow bold>
        Count = {count}
      </Color>
    </>
  );
}

console.log(<Color blue>????</Color>);
console.log('?????');

render(<App />);
