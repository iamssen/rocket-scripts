import { isValidElement, createElement } from 'react';
import svg, { ReactComponent } from './logo.svg';

describe('rocket-punch', () => {
  test('should get a svg string and a react component from svg importing', () => {
    expect(typeof svg).toBe('string');

    const element = createElement(ReactComponent);
    expect(isValidElement(element)).toBeTruthy();
  });
});
