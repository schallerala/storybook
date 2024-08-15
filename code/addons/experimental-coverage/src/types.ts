import type { ResultCoverageEventPayloadSuccess } from './constants';

export type State = {
  absoluteComponentPath: string | null;
  // performance.now() value when the testing started
  timeStartTesting: number;
  coverageResults: ResultCoverageEventPayloadSuccess[];
};

export interface CodeLocation {
  line: number;
  column: number;
}

export interface Location {
  start: CodeLocation;
  end: CodeLocation;
}

export interface Branch {
  loc: Location;
  // expression types like 'cond-expr' and 'binary-expr'
  type: string;
  locations: Location[];
  line: number;
}

export interface FunctionCoverage {
  name: string;
  decl: Location;
  loc: Location;
  line: number;
}

export interface CoverageItem {
  path: string;
  statementMap: Record<string, Location>;
  fnMap: Record<string, FunctionCoverage>;
  branchMap: Record<string, Branch>;
  s: Record<string, number>;
  f: Record<string, number>;
  b: Record<string, number[]>;
}

export type TestingMode = {
  browser: boolean;
  coverageProvider: 'istanbul' | 'v8';
  coverageType: 'project-coverage' | 'component-coverage';
};
