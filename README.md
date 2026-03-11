<div align="center">
  <h1>@visactor/vinfo-graphics</h1>
  <p>
    A simplified, LLM-friendly infographic schema library built on top of VChart.
  </p>
  <p>
    <a href="https://www.npmjs.com/package/@visactor/vinfo-graphics">npm</a> |
    <a href="https://github.com/VisActor/vinfo-graphics">GitHub</a> |
    <a href="https://www.visactor.io/vchart">VChart</a>
  </p>
</div>

## Introduction

`@visactor/vinfo-graphics` provides a schema-first way to describe infographic charts,
and converts schema objects to VChart spec.

It is designed for:

- AI/LLM-friendly chart generation
- concise and readable chart schema
- consistent validation and conversion pipeline
- multi-format package output (ESM/CJS/UMD)

Supported chart types:

- `pie`
- `bar`
- `column`
- `area`
- `treemap`
- `circlePacking`

## Features

- Schema to VChart spec conversion via `toVChartSpec`
- Built-in schema validation via converter rules
- Zod runtime validation via `validateWithZod`
- Theme preset system (`presetThemes`, `resolveTheme`)
- Build outputs for ESM, CJS, and UMD

## Installation

```bash
# npm
npm install @visactor/vinfo-graphics zod

# pnpm
pnpm add @visactor/vinfo-graphics zod

# yarn
yarn add @visactor/vinfo-graphics zod
```

## Quick Start

```ts
import VChart from '@visactor/vchart';
import { toVChartSpec } from '@visactor/vinfo-graphics';

const schema = {
  chartType: 'bar',
  title: 'Monthly Sales',
  data: [
    { month: 'Jan', sales: 120 },
    { month: 'Feb', sales: 160 },
    { month: 'Mar', sales: 180 },
  ],
  categoryField: 'month',
  valueField: 'sales',
} as const;

const spec = toVChartSpec(schema);

const chart = new VChart(spec, { dom: 'chart' });
chart.renderSync();
```

## Validation

### 1) Validate by converter rules

```ts
import { validate } from '@visactor/vinfo-graphics';

const result = validate({
  chartType: 'pie',
  data: [{ name: 'A', value: 30 }],
  categoryField: 'name',
  valueField: 'value',
});

console.log(result.valid, result.errors);
```

### 2) Validate by Zod schema

```ts
import { validateWithZod } from '@visactor/vinfo-graphics';

// Auto-select schema by data.chartType
const result = validateWithZod({
  chartType: 'column',
  data: [{ category: 'Q1', value: 120 }],
  categoryField: 'category',
  valueField: 'value',
});

console.log(result.success, result.errors);
```

You can also pass an explicit schema:

```ts
import { validateWithZod } from '@visactor/vinfo-graphics';
import { pieChartSchema } from '@visactor/vinfo-graphics/schemas';

const result = validateWithZod(pieChartSchema, {
  chartType: 'pie',
  data: [{ name: 'A', value: 30 }],
  categoryField: 'name',
  valueField: 'value',
});
```

## API

Main exports from `@visactor/vinfo-graphics`:

- `toVChartSpec(schema)`
- `validate(schema)`
- `getDefaults(chartType)`
- `validateWithZod(data)` / `validateWithZod(schema, data)`
- `presetThemes`
- `resolveTheme`
- `isDarkTheme`

Schemas export path:

- `@visactor/vinfo-graphics/schemas`

UMD entry:

- `@visactor/vinfo-graphics/umd`

## Build Output

After build:

- ESM: `esm/**`
- CJS: `cjs/**`
- Types: `dist/**/*.d.ts`
- UMD bundle: `dist/index.umd.js`

## Development

```bash
# install
npm install

# type check
npm run typecheck

# test
npm run test

# build all outputs (esm/cjs/types/umd)
npm run build
```

## Related Links

- VChart: https://www.visactor.io/vchart
- VChart Example: https://www.visactor.io/vchart/example
- VisActor GitHub: https://github.com/VisActor

## License

[MIT](./LICENSE)
