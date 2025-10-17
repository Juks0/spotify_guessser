// Global type definitions

declare module 'react' {
  export interface ChangeEvent<T = Element> {
    target: T;
  }
  
  export interface KeyboardEvent<T = Element> {
    key: string;
    preventDefault(): void;
  }
  
  export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  
  export const ChangeEvent: {
    prototype: ChangeEvent;
  };
  
  export const KeyboardEvent: {
    prototype: KeyboardEvent;
  };
  
  export default React;
}

declare module 'react-router-dom' {
  export function Link(props: any): any;
  export function useParams(): any;
  export function useNavigate(): any;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export const Fragment: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
