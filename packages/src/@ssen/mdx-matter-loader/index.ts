import matter from 'gray-matter';

export default function (this: LoaderContext, contents: string) {
  const callback = this.async();

  if (!callback) return contents;

  try {
    const { content, data } = matter(contents);
    const decoded = JSON.stringify(data);
    const code = `${content}\n\nexport const frontmatter = ${decoded};`;

    callback(null, code);
  } catch {
    callback(null, contents);
  }
}

interface LoaderContext {
  async: () => (
    err: Error | null | undefined,
    content: string | Buffer | undefined,
  ) => void;
}
