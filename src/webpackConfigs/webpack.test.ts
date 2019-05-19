declare module 'webpack/lib/RuleSet' {
  import { RuleSetRule } from 'webpack';
  
  class RuleSet {
    constructor(rules: RuleSetRule[]);
    
  }
  
  export = RuleSet;
}

describe('webpack', () => {
  test('RuleSet 테스트', () => {
    // TODO
  });
});