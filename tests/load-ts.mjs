import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import ts from 'typescript';

export function loadTs(file) {
  const absolute = path.resolve(file);
  const instance = new Module(absolute);
  instance.filename = absolute;
  instance.paths = Module._nodeModulePaths(path.dirname(absolute));
  const { outputText } = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true }
  });
  instance._compile(outputText, absolute);
  return instance.exports;
}
