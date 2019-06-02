declare module 'webpack/lib/RuleSet' {
  import { RuleSetRule, RuleSetUse } from 'webpack';
  
  class RuleSet {
    constructor(rules: RuleSetRule[]);
    
    exec(data: RuleSetRule): {type: string, value: RuleSetUse, enforce?: 'pre' | 'post'}[];
  }
  
  export = RuleSet;
}