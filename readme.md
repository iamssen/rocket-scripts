# config.js

```
app?:
  entry: string[]
  port: number
  staticFileDirectories: string[]
  
  buildPath?: string = ''
  https?: boolean | { key: string, cert: string } = false
  vendorFileName?: string = 'vendor'
  styleFileName?: string = 'style'
  publicPath?: string = ''
  
  ssr?: 
    port: number

modules?:
  entry: { [name: string]: { group?: string } }
```