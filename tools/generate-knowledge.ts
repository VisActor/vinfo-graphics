import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Project, InterfaceDeclaration, Type, Symbol, SyntaxKind } from 'ts-morph';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// Configuration
// ==========================================

const PROJECT_ROOT = path.resolve(__dirname, '..');
const TYPES_DIR = path.resolve(PROJECT_ROOT, 'src/types');
const CHART_DIR = path.resolve(TYPES_DIR, 'chart');
const COMPONENTS_DIR = path.resolve(TYPES_DIR, 'components');
const OUTPUT_DIR = path.resolve(__dirname, 'knowledge');
const TOP_KEYS_DIR = path.resolve(OUTPUT_DIR, 'top-keys');
const TYPE_DETAILS_DIR = path.resolve(OUTPUT_DIR, 'type-details');

// Chart types to process
const CHART_TYPES = ['pie', 'bar', 'column', 'area', 'treemap', 'circle-packing'];

// Simple types that don't need detailed documentation
const SIMPLE_TYPES = [
  'string', 'number', 'boolean', 'undefined', 'null', 'any', 'unknown',
  'string[]', 'number[]', 'boolean[]', 'any[]', 'unknown[]',
  'Record<string, unknown>[]', 'Record<string, unknown>',
];

// Types to skip when generating type-details
const SKIP_TYPE_DETAILS = new Set([
  // Simple union types
  'ChartType', 'DataItem', 'ThemeType', 'Theme',
  // Primitive types
  'string', 'number', 'boolean', 'any', 'unknown'
]);

// ==========================================
// Helper Functions
// ==========================================

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getChartInterfaceName(chartType: string): string {
  // Convert 'circle-packing' to 'CirclePacking'
  const parts = chartType.split('-');
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('') + 'ChartSchema';
}

function isSimpleType(typeText: string): boolean {
  // Check if it's a simple type
  const cleanType = typeText.replace(/\[\]$/, '').replace(/['"]/g, '').trim();

  if (SIMPLE_TYPES.includes(cleanType) || SIMPLE_TYPES.includes(typeText)) {
    return true;
  }

  // Check for literal types like 'pie' | 'bar'
  if (/^['"][\w-]+['"](\s*\|\s*['"][\w-]+['"])*$/.test(typeText)) {
    return true;
  }

  // Check for optional primitive types
  if (/^(string|number|boolean)(\s*\|\s*undefined)?$/.test(cleanType)) {
    return true;
  }

  return false;
}

function extractComponentName(typeText: string): string | undefined {
  // Remove array markers and optional marker
  let cleanType = typeText.replace(/\[\]$/, '').replace(/\|?\s*undefined$/, '').trim();

  // Handle union types - take the first non-primitive type
  const types = cleanType.split('|').map(t => t.trim());
  for (const t of types) {
    const trimmed = t.replace(/\[\]$/, '').trim();
    if (!isSimpleType(trimmed)) {
      return trimmed;
    }
  }

  return undefined;
}

function getPropertyDescription(property: any): string {
  const jsDocs = property.getJsDocs();
  if (jsDocs.length > 0) {
    // Get the description from JSDoc
    const description = jsDocs[0]?.getDescription()?.trim() || '';
    const tags = jsDocs[0]?.getTags() || [];

    // Check for @description tag
    const descTag = tags.find((tag: any) => tag.getTagName() === 'description');
    if (descTag) {
      return descTag.getCommentText()?.trim() || description;
    }

    return description;
  }
  return '';
}

function getFieldType(property: any): string {
  const typeNode = property.getTypeNode();
  return typeNode?.getText() || 'any';
}

// ==========================================
// Generate Top Keys
// ==========================================

// Base schema properties that should be included in all chart types
const BASE_SCHEMA_PROPERTIES = [
  {
    name: 'title',
    type: 'TitleConfig',
    componentName: 'TitleConfig',
    description: '图表标题配置',
    isRequired: false
  },
  {
    name: 'footnote',
    type: 'FootnoteConfig',
    componentName: 'FootnoteConfig',
    description: '脚注配置，支持图片和文字的多种布局',
    isRequired: false
  },
  {
    name: 'data',
    type: 'DataItem[]',
    componentName: 'DataItem',
    description: '数据（扁平数组），每条数据为一个对象，包含分类字段和数值字段',
    isRequired: true
  },
  {
    name: 'width',
    type: 'number',
    description: '画布宽度',
    isRequired: false
  },
  {
    name: 'height',
    type: 'number',
    description: '画布高度',
    isRequired: false
  },
  {
    name: 'background',
    type: 'BackgroundConfig',
    componentName: 'BackgroundConfig',
    description: '背景配置，支持背景图片、颜色等',
    isRequired: false
  },
  {
    name: 'colors',
    type: 'string[]',
    description: '自定义颜色数组，覆盖主题默认颜色',
    isRequired: false
  },
  {
    name: 'legend',
    type: 'LegendConfig',
    componentName: 'LegendConfig',
    description: '图例配置',
    isRequired: false
  },
  {
    name: 'theme',
    type: 'PresetThemeName',
    componentName: 'PresetThemeName',
    description: '预设主题名称，如 light, dark, fresh, sunset 等',
    isRequired: false
  },
  {
    name: 'customizedTheme',
    type: 'ThemeConfig',
    componentName: 'ThemeConfig',
    description: '自定义主题配置，优先级高于 theme 中的预设主题名称',
    isRequired: false
  }
];

function generateTopKeys(project: Project) {
  console.log('Generating top-keys...');

  ensureDir(TOP_KEYS_DIR);

  for (const chartType of CHART_TYPES) {
    const chartDir = path.resolve(CHART_DIR, chartType);
    const indexFile = path.resolve(chartDir, 'index.ts');

    if (!fs.existsSync(indexFile)) {
      console.log(`  Skipping ${chartType}: index.ts not found`);
      continue;
    }

    const sourceFile = project.addSourceFileAtPath(indexFile);
    const interfaceName = getChartInterfaceName(chartType);
    const interfaceDecl = sourceFile.getInterface(interfaceName);

    if (!interfaceDecl) {
      console.log(`  Skipping ${chartType}: Interface ${interfaceName} not found`);
      continue;
    }

    const topKeys: any[] = [];

    // First, add base schema properties (with proper order)
    for (const baseProp of BASE_SCHEMA_PROPERTIES) {
      topKeys.push({
        name: baseProp.name,
        type: baseProp.type,
        isRequired: baseProp.isRequired,
        ...(baseProp.componentName && { componentName: baseProp.componentName }),
        ...(baseProp.description && { description: baseProp.description })
      });
    }

    // Then, add chart-specific properties
    const properties = interfaceDecl.getProperties();

    for (const property of properties) {
      const name = property.getName();

      // Skip chartType as it's always the chart type
      if (name === 'chartType') {
        continue;
      }

      // Skip if already in base properties (avoid duplicates)
      if (BASE_SCHEMA_PROPERTIES.some(p => p.name === name)) {
        continue;
      }

      const typeText = getFieldType(property);
      const description = getPropertyDescription(property);
      const componentName = extractComponentName(typeText);
      // Check if property has optional modifier (?)
      const isRequired = !property.hasQuestionToken();

      const keyInfo: any = {
        name,
        type: typeText,
        isRequired
      };

      if (description) {
        keyInfo.description = description;
      }

      if (componentName) {
        keyInfo.componentName = componentName;
      }

      topKeys.push(keyInfo);
    }

    // Write the JSON file
    const outputPath = path.resolve(TOP_KEYS_DIR, `${chartType}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(topKeys, null, 2));
    console.log(`  Generated: ${outputPath}`);
  }

  console.log('Top-keys generation complete.\n');
}

// ==========================================
// Generate Type Details
// ==========================================

function findTypeDefinitionFile(typeName: string, project: Project): string | null {
  // Search in components directory
  if (fs.existsSync(COMPONENTS_DIR)) {
    const componentsFiles = fs.readdirSync(COMPONENTS_DIR, { recursive: true }) as string[];
    for (const file of componentsFiles) {
      if (file.endsWith('.ts')) {
        const fullPath = path.resolve(COMPONENTS_DIR, file);
        try {
          const sourceFile = project.addSourceFileAtPath(fullPath);
          const interfaces = sourceFile.getInterfaces();
          const types = sourceFile.getTypeAliases();

          for (const iface of interfaces) {
            if (iface.getName() === typeName) {
              return fullPath;
            }
          }
          for (const type of types) {
            if (type.getName() === typeName) {
              return fullPath;
            }
          }
        } catch (e) {
          // Ignore errors
        }
      }
    }
  }

  // Search in chart type directories
  for (const chartType of CHART_TYPES) {
    const chartDir = path.resolve(CHART_DIR, chartType);
    if (!fs.existsSync(chartDir)) continue;

    const files = fs.readdirSync(chartDir) as string[];
    for (const file of files) {
      if (file.endsWith('.ts') && file !== 'index.ts') {
        const fullPath = path.resolve(chartDir, file);
        try {
          const sourceFile = project.addSourceFileAtPath(fullPath);
          const interfaces = sourceFile.getInterfaces();
          const types = sourceFile.getTypeAliases();

          for (const iface of interfaces) {
            if (iface.getName() === typeName) {
              return fullPath;
            }
          }
          for (const type of types) {
            if (type.getName() === typeName) {
              return fullPath;
            }
          }
        } catch (e) {
          // Ignore errors
        }
      }
    }
  }

  // Search in base chart directory
  const baseTypesFile = path.resolve(CHART_DIR, 'base.ts');
  if (fs.existsSync(baseTypesFile)) {
    try {
      const sourceFile = project.addSourceFileAtPath(baseTypesFile);
      const interfaces = sourceFile.getInterfaces();
      const types = sourceFile.getTypeAliases();

      for (const iface of interfaces) {
        if (iface.getName() === typeName) {
          return baseTypesFile;
        }
      }
      for (const type of types) {
        if (type.getName() === typeName) {
          return baseTypesFile;
        }
      }
    } catch (e) {
      // Ignore errors
    }
  }

  return null;
}

function extractTypeDefinition(typeName: string, sourceFile: any): string | null {
  // Try to find interface
  const iface = sourceFile.getInterface(typeName);
  if (iface) {
    const text = sourceFile.getFullText();
    const start = iface.getStart();
    const end = iface.getEnd();

    // Include JSDoc comments
    let actualStart = start;
    const jsDocStart = text.lastIndexOf('/**', start);
    if (jsDocStart !== -1 && jsDocStart > text.lastIndexOf('}', start - 1)) {
      actualStart = jsDocStart;
    }

    return text.substring(actualStart, end);
  }

  // Try to find type alias
  const typeAlias = sourceFile.getTypeAlias(typeName);
  if (typeAlias) {
    const text = sourceFile.getFullText();
    const start = typeAlias.getStart();
    const end = typeAlias.getEnd();

    // Include JSDoc comments
    let actualStart = start;
    const jsDocStart = text.lastIndexOf('/**', start);
    if (jsDocStart !== -1 && jsDocStart > text.lastIndexOf('}', start - 1)) {
      actualStart = jsDocStart;
    }

    return text.substring(actualStart, end);
  }

  return null;
}

function extractDependencyTypes(typeDefinition: string, sourceFile: any, project: Project): string[] {
  const dependencies: string[] = [];
  const typeNames = new Set<string>();

  // Only extract types from intersection (& TypeName) and extends patterns
  // Do NOT extract from property types within the definition itself

  // Find types that are referenced with "& TypeName" (intersection types at the end)
  const intersectionPattern = /&\s+(\w+)/g;
  let match;
  while ((match = intersectionPattern.exec(typeDefinition)) !== null) {
    const typeName = match[1];
    if (typeName && !isSimpleType(typeName) && !SKIP_TYPE_DETAILS.has(typeName)) {
      typeNames.add(typeName);
    }
  }

  // Find types that are referenced with "= TypeName &" (intersection types at the start)
  // e.g., "export type Foo = Bar & { ... }"
  const intersectionStartPattern = /=\s+(\w+)\s+&/g;
  while ((match = intersectionStartPattern.exec(typeDefinition)) !== null) {
    const typeName = match[1];
    if (typeName && !isSimpleType(typeName) && !SKIP_TYPE_DETAILS.has(typeName)) {
      typeNames.add(typeName);
    }
  }

  // Find types that are referenced with "extends TypeName"
  const extendsPattern = /extends\s+(\w+)/g;
  while ((match = extendsPattern.exec(typeDefinition)) !== null) {
    const typeName = match[1];
    if (typeName && !isSimpleType(typeName) && !SKIP_TYPE_DETAILS.has(typeName)) {
      typeNames.add(typeName);
    }
  }

  // Extract the definitions for each dependency type
  for (const typeName of typeNames) {
    // First try in the same file
    let definition = extractTypeDefinition(typeName, sourceFile);

    // If not found in same file, search in other files
    if (!definition) {
      const dependencyFilePath = findTypeDefinitionFile(typeName, project);
      if (dependencyFilePath) {
        try {
          const depSourceFile = project.addSourceFileAtPath(dependencyFilePath);
          definition = extractTypeDefinition(typeName, depSourceFile);
        } catch (e) {
          // Ignore errors
        }
      }
    }

    if (definition) {
      dependencies.push(definition);
    }
  }

  return dependencies;
}

function generateTypeDetails(project: Project) {
  console.log('Generating type-details...');

  ensureDir(TYPE_DETAILS_DIR);

  // First, collect all complex types from top-keys
  const collectedTypes = new Set<string>();

  for (const chartType of CHART_TYPES) {
    const topKeysPath = path.resolve(TOP_KEYS_DIR, `${chartType}.json`);
    if (!fs.existsSync(topKeysPath)) continue;

    const topKeys = JSON.parse(fs.readFileSync(topKeysPath, 'utf-8'));
    for (const key of topKeys) {
      if (key.componentName && !SKIP_TYPE_DETAILS.has(key.componentName)) {
        collectedTypes.add(key.componentName);
      }
    }
  }

  console.log(`  Found ${collectedTypes.size} unique complex types`);

  // Generate markdown for each type
  const generatedTypes = new Set<string>();

  for (const typeName of collectedTypes) {
    if (generatedTypes.has(typeName)) continue;

    const filePath = findTypeDefinitionFile(typeName, project);
    if (!filePath) {
      console.log(`  Warning: Could not find definition file for ${typeName}`);
      continue;
    }

    try {
      const sourceFile = project.addSourceFileAtPath(filePath);
      const definition = extractTypeDefinition(typeName, sourceFile);

      if (definition) {
        // Get description from top-keys
        let description = '';
        for (const chartType of CHART_TYPES) {
          const topKeysPath = path.resolve(TOP_KEYS_DIR, `${chartType}.json`);
          if (!fs.existsSync(topKeysPath)) continue;

          const topKeys = JSON.parse(fs.readFileSync(topKeysPath, 'utf-8'));
          const key = topKeys.find((k: any) => k.componentName === typeName);
          if (key?.description) {
            description = key.description;
            break;
          }
        }

        // Extract dependency types
        const dependencies = extractDependencyTypes(definition, sourceFile, project);

        let mdContent = `### ${typeName}\n\n${description}\n\n\`\`\`typescript\n`;

        // Add dependency types first
        for (const dep of dependencies) {
          mdContent += dep + '\n\n';
        }

        mdContent += definition + '\n```\n';

        const outputPath = path.resolve(TYPE_DETAILS_DIR, `${typeName}.md`);
        fs.writeFileSync(outputPath, mdContent);
        generatedTypes.add(typeName);
        console.log(`  Generated: ${outputPath}`);
      }
    } catch (e) {
      console.log(`  Error processing ${typeName}:`, e);
    }
  }

  // Also generate base types
  generateBaseTypes(project);

  console.log('Type-details generation complete.\n');
}

function generateBaseTypes(project: Project) {
  console.log('  Generating base types...');

  // BaseChartSchema
  const basePath = path.resolve(CHART_DIR, 'base.ts');
  if (fs.existsSync(basePath)) {
    const sourceFile = project.addSourceFileAtPath(basePath);

    const baseTypes = ['BaseChartSchema', 'TitleConfig', 'FootnoteConfig', 'BackgroundConfig', 'LegendConfig', 'PresetThemeName'];

    for (const typeName of baseTypes) {
      const definition = extractTypeDefinition(typeName, sourceFile);
      if (definition) {
        // Extract dependencies
        const dependencies = extractDependencyTypes(definition, sourceFile, project);

        let mdContent = `### ${typeName}\n\n\`\`\`typescript\n`;

        // Add dependency types first
        for (const dep of dependencies) {
          mdContent += dep + '\n\n';
        }

        mdContent += definition + '\n```\n';

        const outputPath = path.resolve(TYPE_DETAILS_DIR, `${typeName}.md`);
        fs.writeFileSync(outputPath, mdContent);
        console.log(`    Generated: ${typeName}.md`);
      }
    }
  }

  // Component types
  const componentTypes = [
    { file: 'icon.ts', types: ['IconConfig', 'ImageMapConfig'] },
    { file: 'label.ts', types: ['LabelConfig'] },
    { file: 'axis.ts', types: ['AxisConfig'] },
    { file: 'theme.ts', types: ['ThemeConfig'] },
    { file: 'linear-gradient.ts', types: ['LinearGradientConfig'] }
  ];

  for (const { file, types } of componentTypes) {
    const filePath = path.resolve(COMPONENTS_DIR, file);
    if (fs.existsSync(filePath)) {
      const sourceFile = project.addSourceFileAtPath(filePath);
      for (const typeName of types) {
        const definition = extractTypeDefinition(typeName, sourceFile);
        if (definition) {
          let mdContent = `### ${typeName}\n\n\`\`\`typescript\n${definition}\n\`\`\`\n`;
          const outputPath = path.resolve(TYPE_DETAILS_DIR, `${typeName}.md`);
          fs.writeFileSync(outputPath, mdContent);
          console.log(`    Generated: ${typeName}.md`);
        }
      }
    }
  }
}

// ==========================================
// Main
// ==========================================

function main() {
  console.log('=== vinfo-graphics Knowledge Generator ===\n');

  // Create output directories
  ensureDir(OUTPUT_DIR);
  ensureDir(TOP_KEYS_DIR);
  ensureDir(TYPE_DETAILS_DIR);

  // Create TypeScript project
  const project = new Project({
    tsConfigFilePath: path.resolve(PROJECT_ROOT, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true
  });

  // Generate top-keys
  generateTopKeys(project);

  // Generate type-details
  generateTypeDetails(project);

  console.log('=== Generation Complete ===');
}

main();
