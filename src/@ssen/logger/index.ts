interface Stream {
  output: string;
  columns: number;

  write(str: string): void;

  get(): string;
}

const createToStringStream: (options: { columns: number }) => Stream = ({ columns }) => {
  let output: string = '';
  return {
    output,
    columns,
    write(str: string) {
      output = str;
    },
    get() {
      return output;
    },
  };
};
