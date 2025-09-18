/**
 * @name IKU-CabalActiva-Agent
 * @version 2.0.0
 * @description Prompt-Engineering avanzado para implementación de AI-Assistant-Coding en VS-Code
 * @author Mauro D. Asuaje G.
 */

// ----------- CONFIGURACIÓN DE CONTEXTO -----------

const projectContext = {
  name: 'IKU-Cábala Activa Landing Page',
  repository: 'https://github.com/mdasuaje/iku-cabalactiva',
  domain: 'iku-cabalactiva.com',
  deployment: 'GitHub Pages + Squarespace DNS',
  mainTools: ['React', 'Vite', 'GitHub Actions', 'CSS Modules'],
  developer: {
    name: 'Mauro D. Asuaje G.',
    github: 'mdasuaje',
    philosophy: ['Análisis Metódico', 'Precisión Samurai', 'Integración Holística'],
  },
  projectGoals: [
    'Crear landing page para herramientas cabalísticas',
    'Integrar sistema de reserva y pagos',
    'Optimizar SEO y rendimiento',
    'Implementar CI/CD automatizado',
  ],
}

// ----------- CAPACIDADES DETALLADAS -----------

/**
 * @object agentCapabilities
 * @description Definición detallada de las capacidades del agente
 */
const agentCapabilities = {
  diagnosticMode: {
    repositoryAnalysis: {
      enabled: true,
      description: 'Análisis detallado de la estructura y configuración del repositorio',
      targets: ['estructura', 'dependencias', 'configuración', 'workflows'],
    },
    structureEvaluation: {
      enabled: true,
      description: 'Evaluación de la estructura de componentes y arquitectura del proyecto',
      targets: ['componentes', 'módulos', 'organización', 'patrones'],
    },
    configurationReview: {
      enabled: true,
      description: 'Revisión de archivos de configuración y su optimización',
      targets: ['vite.config.js', 'package.json', '.github/workflows', '.vscode'],
    },
    performanceAudit: {
      enabled: true,
      description: 'Auditoría de rendimiento y sugerencias de optimización',
      targets: ['carga', 'renderizado', 'assets', 'métricas'],
    },
  },
  implementationMode: {
    componentDevelopment: {
      enabled: true,
      description: 'Desarrollo de componentes React con mejores prácticas',
      targets: ['UI', 'lógica', 'estilos', 'interactividad'],
    },
    styleTweaking: {
      enabled: true,
      description: 'Ajuste y optimización de estilos CSS',
      targets: ['responsive', 'accesibilidad', 'consistencia', 'temas'],
    },
    optimizationSuggestions: {
      enabled: true,
      description: 'Sugerencias para optimizar código y recursos',
      targets: ['código', 'assets', 'bundling', 'caching'],
    },
    bugFixing: {
      enabled: true,
      description: 'Identificación y corrección de errores',
      targets: ['runtime', 'compilación', 'compatibilidad', 'lógica'],
    },
  },
  architectureSupport: {
    cloudNative: {
      enabled: true,
      description: 'Soporte para arquitecturas cloud-native',
      targets: ['deployment', 'escalabilidad', 'configuración', 'monitoreo'],
    },
    cicdWorkflows: {
      enabled: true,
      description: 'Configuración y optimización de flujos CI/CD',
      targets: ['GitHub Actions', 'build', 'test', 'deploy'],
    },
    securityBestPractices: {
      enabled: true,
      description: 'Implementación de mejores prácticas de seguridad',
      targets: ['dependencias', 'headers', 'formularios', 'datos'],
    },
  },
  integrationSupport: {
    paymentSystems: {
      enabled: true,
      description: 'Integración con sistemas de pago',
      targets: ['APIs', 'formularios', 'seguridad', 'UX'],
    },
    bookingSystems: {
      enabled: true,
      description: 'Integración con sistemas de reserva',
      targets: ['calendarios', 'disponibilidad', 'notificaciones', 'confirmaciones'],
    },
    marketingTools: {
      enabled: true,
      description: 'Integración con herramientas de marketing',
      targets: ['analytics', 'tags', 'pixels', 'seguimiento'],
    },
  },
}

/**
 * @function getEnabledCapabilities
 * @description Obtiene las capacidades habilitadas según el contexto
 * @param {string} context - El contexto actual de trabajo
 * @returns {Object} - Las capacidades habilitadas para el contexto
 */
function getEnabledCapabilities(context) {
  const allCapabilities = { ...agentCapabilities }
  let enabledCapabilities = {}

  // Si el contexto está definido, filtrar capacidades por contexto
  if (context) {
    Object.keys(allCapabilities).forEach(category => {
      if (category.toLowerCase().includes(context.toLowerCase())) {
        enabledCapabilities[category] = allCapabilities[category]
      }
    })
    return Object.keys(enabledCapabilities).length ? enabledCapabilities : allCapabilities
  }

  // Si no hay contexto específico, devolver todas las capacidades
  return allCapabilities
}

// ----------- SISTEMA DE DETECCIÓN DE CONTEXTO -----------

/**
 * @function detectContext
 * @description Detecta el contexto de trabajo actual basado en la ruta del archivo
 * @param {string} filePath - Ruta absoluta al archivo actual
 * @returns {Object} - Información contextual sobre el archivo y su relación con el proyecto
 */
function detectContext(filePath) {
  if (!filePath) return { type: 'unknown', isProjectFile: false }

  // Determinar si es un archivo del proyecto
  const isProjectFile = filePath.includes('iku-cabalactiva')

  // Determinar tipo de archivo y contexto específico
  const extension = filePath.split('.').pop().toLowerCase()

  // Mapeo de extensiones a tipos de contexto
  const fileTypeMap = {
    // Código fuente
    js: 'javascript',
    jsx: 'react',
    ts: 'typescript',
    tsx: 'react-typescript',

    // Estilos
    css: 'styles',
    scss: 'styles',
    less: 'styles',

    // Configuración
    json: 'configuration',
    yml: 'configuration',
    yaml: 'configuration',

    // Documentación
    md: 'documentation',
    mdx: 'documentation',

    // HTML y otros
    html: 'markup',
    svg: 'asset',
    png: 'asset',
    jpg: 'asset',
    jpeg: 'asset',

    // Config especiales
    gitignore: 'git-configuration',
    env: 'environment',
  }

  // Determinar el tipo de archivo
  let fileType = fileTypeMap[extension] || 'unknown'

  // Análisis más específico basado en la ruta
  let contextCategory = 'general'

  if (filePath.includes('/src/components/')) {
    contextCategory = 'component'
  } else if (filePath.includes('/src/pages/')) {
    contextCategory = 'page'
  } else if (filePath.includes('/src/hooks/')) {
    contextCategory = 'hook'
  } else if (filePath.includes('/src/utils/')) {
    contextCategory = 'utility'
  } else if (filePath.includes('/src/services/')) {
    contextCategory = 'service'
  } else if (filePath.includes('/src/styles/')) {
    contextCategory = 'style'
  } else if (filePath.includes('/.github/workflows/')) {
    contextCategory = 'ci-cd'
  } else if (filePath.includes('/public/')) {
    contextCategory = 'static-asset'
  } else if (filePath.includes('package.json') || filePath.includes('vite.config.js')) {
    contextCategory = 'project-config'
  }

  // Análisis de fase del proyecto
  let phase = 'general'
  if (filePath.includes('test') || filePath.includes('spec')) {
    phase = 'testing'
  } else if (filePath.includes('readme') || filePath.includes('docs/')) {
    phase = 'documentation'
  } else if (filePath.includes('deploy') || filePath.includes('build')) {
    phase = 'deployment'
  } else if (filePath.includes('optimize') || filePath.includes('perf')) {
    phase = 'optimization'
  }

  // Obtener el nombre del archivo sin la ruta
  const fileName = filePath.split('/').pop()

  return {
    filePath,
    fileName,
    extension,
    type: fileType,
    category: contextCategory,
    phase,
    isProjectFile,
  }
}

/**
 * @function getContextualRecommendations
 * @description Genera recomendaciones basadas en el contexto detectado
 * @param {Object} context - Contexto detectado por detectContext()
 * @returns {Object} - Recomendaciones adaptadas al contexto
 */
function getContextualRecommendations(context) {
  const recommendations = {
    bestPractices: [],
    relatedFiles: [],
    suggestedActions: [],
  }

  // Recomendaciones según el tipo de archivo
  switch (context.type) {
    case 'react':
      recommendations.bestPractices = [
        'Utilizar React.memo para componentes puros',
        'Extraer lógica compleja a hooks personalizados',
        'Implementar lazy loading para componentes pesados',
        'Considerar el uso de React.Suspense para carga asíncrona',
      ]
      recommendations.relatedFiles = [
        `${context.fileName.replace('.jsx', '')}.module.css`,
        `${context.fileName.replace('.jsx', '.test.jsx')}`,
      ]
      break
    case 'styles':
      recommendations.bestPractices = [
        'Preferir CSS Modules para evitar colisiones',
        'Implementar variables CSS para temas',
        'Utilizar media queries para diseño responsive',
        'Mantener especificidad baja para evitar anulaciones complicadas',
      ]
      recommendations.relatedFiles = [context.fileName.replace('.module.css', '.jsx')]
      break
    case 'configuration':
      recommendations.bestPractices = [
        'Documentar opciones de configuración no estándar',
        'Separar configuración de desarrollo y producción',
        'Evitar exponer secretos en archivos de configuración',
        'Validar la configuración antes de desplegar',
      ]
      break
    // Otros casos según sea necesario
  }

  // Recomendaciones según la categoría
  switch (context.category) {
    case 'component':
      recommendations.suggestedActions = [
        'Revisar accesibilidad del componente',
        'Verificar compatibilidad móvil',
        'Implementar tests unitarios',
        'Documentar props y comportamiento',
      ]
      break
    case 'page':
      recommendations.suggestedActions = [
        'Optimizar metadatos SEO',
        'Implementar lazy loading para componentes secundarios',
        'Verificar tiempo de carga inicial',
        'Revisar navegación y UX',
      ]
      break
    case 'ci-cd':
      recommendations.suggestedActions = [
        'Configurar notificaciones de fallos',
        'Implementar cachés para mejorar velocidad',
        'Añadir pasos de validación pre-deploy',
        'Documentar proceso de rollback',
      ]
      break
    // Otros casos según sea necesario
  }

  return recommendations
}

// ----------- PATRONES DE FLUJO DE TRABAJO -----------

/**
 * @function WORKFLOW_PATTERNS
 * @description Define patrones estandarizados para los flujos de trabajo
 * @returns {Object} - Objeto con funciones generadoras de patrones para distintas fases
 */
function WORKFLOW_PATTERNS() {
  return {
    /**
     * @function analyze
     * @description Genera un patrón para la fase de análisis
     * @param {Object} context - Contexto de trabajo actual
     * @returns {string} - Estructura markdown para análisis
     */
    analyze: context => {
      return `
## 📊 FASE DE ANÁLISIS

### Contexto Evaluado
- **Tipo de archivo**: ${context.type || 'No especificado'}
- **Categoría**: ${context.category || 'General'}
- **Ruta**: \`${context.filePath || 'No especificada'}\`

### Componentes Relacionados
${
  context.relatedFiles
    ? context.relatedFiles.map(file => `- \`${file}\``).join('\n')
    : '- No se identificaron componentes directamente relacionados'
}

### Implicaciones Arquitectónicas
${
  context.category === 'component'
    ? '- Este componente forma parte de la interfaz de usuario principal\n- Su rendimiento afecta la experiencia de usuario inicial\n- Debe mantener consistencia visual con otros elementos'
    : context.category === 'configuration'
    ? '- Esta configuración afecta el comportamiento global del proyecto\n- Impacta en el proceso de build y despliegue\n- Requiere validación antes de cambios en producción'
    : '- Se requiere análisis adicional para determinar implicaciones'
}

### Requisitos Identificados
- Requisitos explícitos:
  - [Listar según el contexto o solicitud]
- Requisitos implícitos:
  - Mantenimiento de estándares de código
  - Compatibilidad con la arquitectura existente
  - Optimización para rendimiento y SEO
      `
    },

    /**
     * @function suggest
     * @description Genera un patrón para la fase de propuesta
     * @param {Array} options - Opciones de implementación
     * @returns {string} - Estructura markdown para propuestas
     */
    suggest: options => {
      return `
## 💡 FASE DE PROPUESTA

${options
  .map(
    (opt, i) => `
### Opción ${i + 1}: ${opt.title}

#### Descripción
${opt.description}

#### Ventajas
${opt.advantages.map(adv => `- ✅ ${adv}`).join('\n')}

#### Desventajas
${opt.disadvantages.map(dis => `- ⚠️ ${dis}`).join('\n')}

#### Ejemplo de Implementación
\`\`\`${opt.language || 'jsx'}
${opt.codeExample}
\`\`\`
`
  )
  .join('\n')}

### Recomendación
${
  options.find(opt => opt.recommended)?.recommendationReason ||
  'Se requiere más información para ofrecer una recomendación específica.'
}
      `
    },

    /**
     * @function implement
     * @description Genera un patrón para la fase de implementación
     * @param {Object} solution - Solución a implementar
     * @returns {string} - Estructura markdown para implementación
     */
    implement: solution => {
      return `
## 🛠 FASE DE IMPLEMENTACIÓN

### ${solution.title}

#### Descripción técnica
${solution.description}

#### Código completo
\`\`\`${solution.language || 'jsx'}
${solution.code}
\`\`\`

#### Instrucciones de integración
${solution.integrationSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

#### Consideraciones adicionales
${solution.considerations.map(con => `- ${con}`).join('\n')}

#### Optimizaciones aplicadas
${solution.optimizations.map(opt => `- 🚀 ${opt}`).join('\n')}
      `
    },

    /**
     * @function validate
     * @description Genera un patrón para la fase de validación
     * @param {Object} validation - Información de validación
     * @returns {string} - Estructura markdown para validación
     */
    validate: validation => {
      return `
## ✅ FASE DE VALIDACIÓN

### Pruebas recomendadas
${validation.tests
  .map(
    test =>
      `- ${test.description} ${
        test.priority === 'high' ? '🔴' : test.priority === 'medium' ? '🟠' : '🟢'
      }`
  )
  .join('\n')}

### Posibles problemas
${validation.potentialIssues
  .map(issue => `- ⚠️ **${issue.title}**: ${issue.description}`)
  .join('\n')}

### Estándares verificados
${validation.standardsCheck.map(std => `- [${std.passed ? '✓' : '✗'}] ${std.standard}`).join('\n')}

### Prueba de compatibilidad
${validation.compatibilityCheck.map(comp => `- ${comp.browser}: ${comp.status}`).join('\n')}
      `
    },
  }
}

/**
 * @function generateWorkflowResponse
 * @description Genera una respuesta estructurada según la fase del flujo de trabajo
 * @param {string} phase - Fase actual del flujo de trabajo (analyze, suggest, implement, validate)
 * @param {Object} data - Datos específicos para la fase
 * @returns {string} - Respuesta estructurada en markdown
 */
function generateWorkflowResponse(phase, data) {
  const patterns = WORKFLOW_PATTERNS()

  if (!patterns[phase]) {
    return `La fase "${phase}" no está definida en los patrones de flujo de trabajo.`
  }

  return patterns[phase](data)
}

// ----------- COMANDOS ESPECÍFICOS -----------

/**
 * @object COMANDOS_ESPECÍFICOS
 * @description Conjunto de funciones para generar código para tareas comunes
 */
const COMANDOS_ESPECÍFICOS = {
  /**
   * @function crearComponente
   * @description Genera código para un nuevo componente React
   * @param {string} nombre - Nombre del componente
   * @param {Object} opciones - Opciones de configuración
   * @returns {Object} - Código del componente y archivos asociados
   */
  crearComponente: (nombre, opciones = {}) => {
    // Valores por defecto
    const {
      tipo = 'funcional',
      conEstado = false,
      conProps = true,
      conCSS = true,
      conTest = true,
      esReutilizable = true,
      conStorybook = false,
    } = opciones

    // Generar código JSX para el componente
    let componenteJSX = ''

    if (tipo === 'funcional') {
      componenteJSX = `import React${conEstado ? ', { useState, useEffect }' : ''} from 'react';
${conCSS ? `import styles from './${nombre}.module.css';` : ''}

/**
 * ${nombre} - ${esReutilizable ? 'Componente reutilizable para ' : 'Componente específico que '}
 * ${opciones.descripcion || `Implementa funcionalidad de ${nombre}`}
 *
 * @component
 ${conProps ? '* @param {Object} props - Propiedades del componente\n' : ''}${
        conProps && opciones.props
          ? opciones.props
              .map(prop => ` * @param {${prop.tipo}} props.${prop.nombre} - ${prop.descripcion}`)
              .join('\n')
          : ''
      }
 * @returns {React.ReactElement} Componente ${nombre}
 */
const ${nombre} = (${conProps ? 'props' : ''}) => {
  ${
    conProps
      ? `const { ${opciones.props ? opciones.props.map(p => p.nombre).join(', ') : ''} } = props;`
      : ''
  }
  ${
    conEstado
      ? `const [estado, setEstado] = useState(${opciones.estadoInicial || 'null'});

  useEffect(() => {
    // Efecto al montar el componente
    return () => {
      // Limpieza al desmontar
    };
  }, []);`
      : ''
  }

  return (
    <div ${conCSS ? 'className={styles.container}' : ''}>
      <h2>${nombre}</h2>
      ${
        conProps && opciones.props
          ? opciones.props.map(p => `<p>{${p.nombre}}</p>`).join('\n      ')
          : ''
      }
      ${conEstado ? '<p>{JSON.stringify(estado)}</p>' : ''}
    </div>
  );
};

export default ${nombre};`
    } else if (tipo === 'clase') {
      componenteJSX = `import React, { Component } from 'react';
${conCSS ? `import styles from './${nombre}.module.css';` : ''}

/**
 * ${nombre} - ${esReutilizable ? 'Componente reutilizable para ' : 'Componente específico que '}
 * ${opciones.descripcion || `Implementa funcionalidad de ${nombre}`}
 *
 * @component
 * @extends {Component}
 */
class ${nombre} extends Component {
  constructor(props) {
    super(props);
    ${
      conEstado
        ? `this.state = {
      ${opciones.estadoInicial ? `...${opciones.estadoInicial}` : '// Estado inicial'}
    };`
        : ''
    }
  }

  ${
    conEstado
      ? `componentDidMount() {
    // Lógica al montar el componente
  }

  componentWillUnmount() {
    // Limpieza al desmontar
  }`
      : ''
  }

  render() {
    ${
      conProps
        ? `const { ${
            opciones.props ? opciones.props.map(p => p.nombre).join(', ') : ''
          } } = this.props;`
        : ''
    }
    ${conEstado ? `const { } = this.state;` : ''}

    return (
      <div ${conCSS ? 'className={styles.container}' : ''}>
        <h2>${nombre}</h2>
        ${
          conProps && opciones.props
            ? opciones.props.map(p => `<p>{${p.nombre}}</p>`).join('\n        ')
            : ''
        }
      </div>
    );
  }
}

export default ${nombre};`
    }

    // Generar CSS Module si se solicita
    const css = conCSS
      ? `.container {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Estilos adicionales para ${nombre} */
`
      : null

    // Generar test si se solicita
    const test = conTest
      ? `import React from 'react';
import { render, screen${conEstado ? ', fireEvent' : ''} } from '@testing-library/react';
import ${nombre} from './${nombre}';

describe('${nombre} Component', () => {
  test('renders correctly', () => {
    render(<${nombre} ${
          conProps && opciones.props
            ? opciones.props.map(p => `${p.nombre}="${p.testValue || 'test'}" `).join('')
            : ''
        } />);
    expect(screen.getByText('${nombre}')).toBeInTheDocument();
  });
  
  ${
    conEstado
      ? `test('handles state changes', () => {
    render(<${nombre} ${
          conProps && opciones.props
            ? opciones.props.map(p => `${p.nombre}="${p.testValue || 'test'}" `).join('')
            : ''
        } />);
    // Add specific test for state changes
  });`
      : ''
  }
});`
      : null

    // Generar Storybook si se solicita
    const storybook = conStorybook
      ? `import React from 'react';
import ${nombre} from './${nombre}';

export default {
  title: 'Componentes/${nombre}',
  component: ${nombre},
  argTypes: {
    ${
      conProps && opciones.props
        ? opciones.props
            .map(
              p => `${p.nombre}: {
      control: '${p.tipo === 'string' ? 'text' : p.tipo === 'number' ? 'number' : 'object'}',
      description: '${p.descripcion}',
      defaultValue: ${typeof p.defaultValue !== 'undefined' ? `'${p.defaultValue}'` : 'undefined'},
    },`
            )
            .join('\n    ')
        : ''
    }
  },
};

const Template = (args) => <${nombre} {...args} />;

export const Default = Template.bind({});
Default.args = {
  ${
    conProps && opciones.props
      ? opciones.props
          .map(
            p =>
              `${p.nombre}: ${typeof p.defaultValue !== 'undefined' ? `'${p.defaultValue}'` : "''"}`
          )
          .join(',\n  ')
      : ''
  }
};`
      : null

    // Retornar todos los archivos generados
    return {
      [`${nombre}.jsx`]: componenteJSX,
      ...(css ? { [`${nombre}.module.css`]: css } : {}),
      ...(test ? { [`${nombre}.test.jsx`]: test } : {}),
      ...(storybook ? { [`${nombre}.stories.jsx`]: storybook } : {}),
    }
  },

  /**
   * @function generarSEO
   * @description Genera configuración de SEO para una página
   * @param {Object} metadatos - Metadatos SEO
   * @returns {string} - Código de configuración SEO
   */
  generarSEO: (metadatos = {}) => {
    const {
      titulo = 'IKU-Cábala Activa | Herramientas Cabalísticas',
      descripcion = 'Herramientas cabalísticas para el desarrollo personal y espiritual. Enseñanzas y prácticas basadas en la sabiduría ancestral de la cábala.',
      palabrasClave = [
        'cábala',
        'herramientas cabalísticas',
        'espiritualidad',
        'desarrollo personal',
      ],
      imagen = '/images/iku-cabala-og-image.jpg',
      url = 'https://iku-cabalactiva.com',
      tipoContenido = 'website',
      autor = 'Mauro D. Asuaje G.',
      twitterCard = 'summary_large_image',
    } = metadatos

    return `
// Componente de SEO para React + Helmet
import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * SEO - Componente para gestionar metadatos SEO
 * @component
 * @param {Object} props - Propiedades del componente
 * @returns {React.ReactElement} Componente Helmet con metadatos
 */
const SEO = () => {
  return (
    <Helmet>
      {/* Metadatos básicos */}
      <title>${titulo}</title>
      <meta name="description" content="${descripcion}" />
      <meta name="keywords" content="${palabrasClave.join(', ')}" />
      <meta name="author" content="${autor}" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="${tipoContenido}" />
      <meta property="og:url" content="${url}" />
      <meta property="og:title" content="${titulo}" />
      <meta property="og:description" content="${descripcion}" />
      <meta property="og:image" content="${url}${imagen}" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="${twitterCard}" />
      <meta property="twitter:url" content="${url}" />
      <meta property="twitter:title" content="${titulo}" />
      <meta property="twitter:description" content="${descripcion}" />
      <meta property="twitter:image" content="${url}${imagen}" />
      
      {/* Canónica */}
      <link rel="canonical" href="${url}" />
    </Helmet>
  );
};

export default SEO;
`
  },

  /**
   * @function generarJsonLD
   * @description Genera datos estructurados JSON-LD
   * @param {string} tipo - Tipo de entidad (Organization, Product, etc)
   * @param {Object} datos - Datos de la entidad
   * @returns {string} - Código para implementar JSON-LD
   */
  generarJsonLD: (tipo, datos = {}) => {
    let jsonLdData = {}

    switch (tipo) {
      case 'Organization':
        jsonLdData = {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: datos.nombre || 'IKU-Cábala Activa',
          url: datos.url || 'https://iku-cabalactiva.com',
          logo: datos.logo || 'https://iku-cabalactiva.com/images/logo.png',
          description:
            datos.descripcion || 'Centro de enseñanza y práctica de herramientas cabalísticas',
          address: {
            '@type': 'PostalAddress',
            addressCountry: datos.pais || 'España',
            addressLocality: datos.localidad || 'Madrid',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: datos.telefono || '+34-123-456-789',
            contactType: 'customer service',
            email: datos.email || 'contacto@iku-cabalactiva.com',
          },
          sameAs: datos.redesSociales || [
            'https://facebook.com/IKUCabalaActiva',
            'https://instagram.com/IKUCabalaActiva',
          ],
        }
        break

      case 'Product':
        jsonLdData = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: datos.nombre || 'Herramienta Cabalística',
          image: datos.imagen || 'https://iku-cabalactiva.com/images/herramienta-default.jpg',
          description:
            datos.descripcion ||
            'Herramienta para el desarrollo personal y espiritual basada en la sabiduría cabalística',
          offers: {
            '@type': 'Offer',
            priceCurrency: datos.moneda || 'EUR',
            price: datos.precio || '99.99',
            availability: datos.disponibilidad || 'https://schema.org/InStock',
          },
          brand: {
            '@type': 'Brand',
            name: datos.marca || 'IKU-Cábala Activa',
          },
        }
        break

      case 'Course':
        jsonLdData = {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: datos.nombre || 'Curso de Iniciación a la Cábala',
          description:
            datos.descripcion ||
            'Curso introductorio sobre los fundamentos de la cábala y sus herramientas prácticas',
          provider: {
            '@type': 'Organization',
            name: datos.proveedor || 'IKU-Cábala Activa',
            sameAs: datos.urlProveedor || 'https://iku-cabalactiva.com',
          },
          courseCode: datos.codigo || 'IKU-CAB-101',
          hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: datos.modo || 'online',
            duration: datos.duracion || 'P8W',
            startDate: datos.fechaInicio || '2025-10-01',
            endDate: datos.fechaFin || '2025-11-30',
            offers: {
              '@type': 'Offer',
              priceCurrency: datos.moneda || 'EUR',
              price: datos.precio || '199.99',
            },
          },
        }
        break
    }

    return `
// Componente de JSON-LD para datos estructurados
import React from 'react';

/**
 * JsonLD - Componente para implementar datos estructurados Schema.org
 * @component
 * @returns {React.ReactElement} Script con datos estructurados
 */
const JsonLD${tipo} = () => {
  const jsonLd = ${JSON.stringify(jsonLdData, null, 2)};
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default JsonLD${tipo};
`
  },

  /**
   * @function generarHook
   * @description Genera un hook personalizado
   * @param {string} nombre - Nombre del hook (sin el prefijo "use")
   * @param {Object} opciones - Opciones de configuración
   * @returns {string} - Código del hook
   */
  generarHook: (nombre, opciones = {}) => {
    const {
      descripcion = `Hook para ${nombre}`,
      params = [],
      returnValue = { tipo: 'Array', descripcion: 'Estado y funciones de actualización' },
      usesState = true,
      usesEffect = true,
      usesCallback = false,
      usesMemo = false,
      usesRef = false,
      usesContext = false,
      usesReducer = false,
      contextName = null,
    } = opciones

    // Generar imports
    const hooks = []
    if (usesState) hooks.push('useState')
    if (usesEffect) hooks.push('useEffect')
    if (usesCallback) hooks.push('useCallback')
    if (usesMemo) hooks.push('useMemo')
    if (usesRef) hooks.push('useRef')
    if (usesContext) hooks.push('useContext')
    if (usesReducer) hooks.push('useReducer')

    const imports = `import { ${hooks.join(', ')} } from 'react'${
      usesContext && contextName
        ? `;\nimport { ${contextName} } from '../contexts/${contextName}Context'`
        : ''
    };`

    // Generar documentación
    const jsdoc = `/**
 * use${nombre} - ${descripcion}
 *
${params
  .map(param => ` * @param {${param.tipo}} ${param.nombre} - ${param.descripcion}`)
  .join('\n')}
 * @returns {${returnValue.tipo}} ${returnValue.descripcion}
 */`

    // Generar cuerpo del hook
    let hookBody = ''

    if (usesState) {
      hookBody += `  // Estado
  const [state, setState] = useState(${opciones.initialState || 'null'});\n`
    }

    if (usesReducer) {
      hookBody += `  // Reducer
  const initialState = ${
    opciones.initialReducerState || '{ loading: false, data: null, error: null }'
  };
  
  const reducer = (state, action) => {
    switch (action.type) {
      case 'LOADING':
        return { ...state, loading: true };
      case 'SUCCESS':
        return { loading: false, data: action.payload, error: null };
      case 'ERROR':
        return { loading: false, data: null, error: action.payload };
      default:
        return state;
    }
  };
  
  const [reducerState, dispatch] = useReducer(reducer, initialState);\n`
    }

    if (usesContext) {
      hookBody += `  // Contexto
  const ${
    contextName ? contextName.charAt(0).toLowerCase() + contextName.slice(1) : 'context'
  } = useContext(${contextName || 'SomeContext'});\n`
    }

    if (usesRef) {
      hookBody += `  // Referencias
  const ref = useRef(${opciones.initialRef || 'null'});\n`
    }

    if (usesEffect) {
      hookBody += `  // Efectos
  useEffect(() => {
    // Lógica del efecto
    ${opciones.effectLogic || '// Implementar lógica aquí'}
    
    return () => {
      // Limpieza
      ${opciones.effectCleanup || '// Implementar limpieza aquí'}
    };
  }, [${opciones.effectDeps || ''}]);\n`
    }

    if (usesCallback) {
      hookBody += `  // Callbacks
  const handleAction = useCallback(() => {
    // Lógica del callback
    ${opciones.callbackLogic || '// Implementar lógica aquí'}
  }, [${opciones.callbackDeps || ''}]);\n`
    }

    if (usesMemo) {
      hookBody += `  // Valores memorizados
  const computedValue = useMemo(() => {
    // Cálculo costoso
    ${opciones.memoLogic || '// Implementar cálculo aquí'}
    return ${opciones.memoReturn || 'result'};
  }, [${opciones.memoDeps || ''}]);\n`
    }

    // Generar return
    let returnStatement = ''

    if (returnValue.tipo === 'Array') {
      returnStatement = `  // Retornar estado y funciones
  return [${usesState ? 'state, setState' : ''}${
        usesReducer ? `${usesState ? ', ' : ''}reducerState, dispatch` : ''
      }${usesCallback ? ', handleAction' : ''}${usesMemo ? ', computedValue' : ''}];`
    } else if (returnValue.tipo === 'Object') {
      const returnItems = []
      if (usesState) returnItems.push('state', 'setState')
      if (usesReducer) returnItems.push('...reducerState', 'dispatch')
      if (usesCallback) returnItems.push('handleAction')
      if (usesMemo) returnItems.push('value: computedValue')

      returnStatement = `  // Retornar objeto con estado y funciones
  return {
    ${returnItems.join(',\n    ')}
  };`
    }

    // Generar el hook completo
    return `${imports}

${jsdoc}
const use${nombre} = (${params.map(p => p.nombre).join(', ')}) => {
${hookBody}
${returnStatement}
};

export default use${nombre};`
  },
}

/**
 * @function ejecutarComando
 * @description Ejecuta un comando específico para generar código
 * @param {string} comando - Nombre del comando a ejecutar
 * @param {...any} args - Argumentos para el comando
 * @returns {*} - Resultado del comando
 */
function ejecutarComando(comando, ...args) {
  if (!COMANDOS_ESPECÍFICOS[comando]) {
    return `El comando "${comando}" no está disponible. Comandos disponibles: ${Object.keys(
      COMANDOS_ESPECÍFICOS
    ).join(', ')}`
  }

  return COMANDOS_ESPECÍFICOS[comando](...args)
}

// ----------- INSTRUCCIONES PRINCIPALES -----------

/**
 * @function FASE_DIAGNÓSTICO
 * @description Instrucciones para análisis de estado del proyecto
 */
function FASE_DIAGNÓSTICO() {
  return `
# INSTRUCCIONES PARA DIAGNÓSTICO DEL PROYECTO

Como IKU-CabalActiva-Agent, realiza las siguientes tareas de diagnóstico:

1. Analiza el estado actual del repositorio en GitHub:
    - Estructura de carpetas y archivos
    - Dependencias en package.json
    - Configuración de Vite en vite.config.js
    - Flujos de CI/CD en .github/workflows

2. Identifica componentes clave y su estado de implementación:
    - Secciones principales (Header, Hero, Herramientas, Testimonios, Contacto)
    - Sistema de estilos (CSS Modules, TailwindCSS, styled-components)
    - Optimización para dispositivos móviles y accesibilidad
    - Integración de recursos estáticos

3. Evalúa configuraciones específicas:
    - Configuración de GitHub Pages (CNAME, workflows)
    - SEO (metatags, robots.txt, sitemap)
    - Rendimiento y optimizaciones (lazy loading, code splitting)

4. Genera un informe estructurado con:
    - Estado actual de cada componente principal
    - Puntos críticos que requieren atención inmediata
    - Recomendaciones técnicas prioritarias

Formato de respuesta: Markdown estructurado con secciones claras y código relevante.
`
}

/**
 * @function FASE_IMPLEMENTACIÓN
 * @description Instrucciones para desarrollo de componentes
 */
function FASE_IMPLEMENTACIÓN() {
  return `
# INSTRUCCIONES PARA IMPLEMENTACIÓN DE COMPONENTES

Como IKU-CabalActiva-Agent, asiste en la implementación de componentes con estas directrices:

1. Para cada componente solicitado:
    - Implementa código limpio y modular en React
    - Sigue principios de Clean Code y buenas prácticas
    - Utiliza CSS Modules para estilos específicos de componentes
    - Incluye comentarios descriptivos según estándares JSDoc

2. Asegura que cada implementación:
    - Sea compatible con React 18+ y Vite
    - Siga principios de diseño responsive
    - Incluya gestión de estados cuando sea necesario
    - Contemple accesibilidad (WCAG)

3. Estructura cada respuesta:
    - Análisis breve del componente y su función
    - Código completo del componente
    - Instrucciones de integración
    - Consideraciones de rendimiento y accesibilidad

4. Proporciona implementaciones para componentes específicos:
    - Formularios con validación
    - Secciones responsivas con grid/flexbox
    - Componentes de UI con feedback visual
    - Integraciones con APIs externas cuando se solicite

Formato de código: Sintaxis JSX moderna, imports organizados, estructura clara.
`
}

/**
 * @function FASE_OPTIMIZACIÓN
 * @description Instrucciones para mejora de rendimiento y arquitectura
 */
function FASE_OPTIMIZACIÓN() {
  return `
# INSTRUCCIONES PARA OPTIMIZACIÓN Y ARQUITECTURA

Como IKU-CabalActiva-Agent, aplica estos principios para optimización y mejoras arquitectónicas:

1. Rendimiento:
    - Identifica y resuelve cuellos de botella en el renderizado
    - Implementa lazy loading para componentes pesados
    - Optimiza assets (imágenes, fuentes, scripts)
    - Sugiere estrategias de caching efectivas

2. Arquitectura Cloud-Native:
    - Propón flujos CI/CD optimizados para GitHub Actions
    - Sugiere configuraciones de seguridad y headers HTTP
    - Recomienda estrategias de despliegue (PR previews, entornos)
    - Asegura la correcta configuración del dominio personalizado

3. Seguridad:
    - Revisa dependencias vulnerables
    - Implementa Content-Security-Policy adecuado
    - Sugiere mejores prácticas para formularios y datos de usuario
    - Recomienda configuraciones de CORS y headers de seguridad

4. SEO y Accesibilidad:
    - Verifica implementación correcta de metatags
    - Asegura estructura semántica del HTML
    - Verifica contraste de colores y navegación por teclado
    - Implementa JSON-LD para datos estructurados

Formato de respuesta: Recomendaciones técnicas específicas con ejemplos de código implementables.
`
}

/**
 * @function FLUJO_TRABAJO
 * @description Instrucciones para la metodología de trabajo
 */
function FLUJO_TRABAJO() {
  return `
# METODOLOGÍA DE TRABAJO CON IKU-CABALACTIVA-AGENT

Para cada tarea o solicitud, sigue este flujo sistemático:

1. ANÁLISIS
    - Comprende el contexto de la solicitud
    - Relaciona con componentes existentes
    - Identifica requisitos explícitos e implícitos
    - Evalúa impacto en la arquitectura global

2. PROPUESTA
    - Ofrece enfoque técnico claro y directo
    - Presenta alternativas cuando sea pertinente
    - Explica ventajas y desventajas de cada opción
    - Recomienda la solución óptima para el contexto

3. IMPLEMENTACIÓN
    - Genera código completo y funcional
    - Estructura modular y mantenible
    - Documenta adecuadamente con comentarios
    - Optimiza para rendimiento y accesibilidad

4. VALIDACIÓN
    - Sugiere pruebas específicas para la implementación
    - Anticipa posibles problemas
    - Verifica adherencia a estándares y mejores prácticas
    - Confirma compatibilidad con el resto del proyecto

Para cada interacción, establece claramente en qué fase del flujo te encuentras.
`
}

// ----------- ACTIVACIÓN DEL AGENTE -----------

/**
 * @function IKU_CABALACTIVA_AGENT
 * @description Función principal de activación del agente
 * @param {string} filePath - Ruta del archivo actual (para detección de contexto)
 * @returns {string} - Instrucciones completas para el asistente
 */
function IKU_CABALACTIVA_AGENT(filePath = null) {
  // Detectar contexto si se proporciona una ruta de archivo
  const detectedContext = filePath ? detectContext(filePath) : null
  const contextualRecommendations = detectedContext
    ? getContextualRecommendations(detectedContext)
    : null

  // Obtener capacidades relevantes según el contexto
  const relevantCapabilities = getEnabledCapabilities(detectedContext?.category)

  // Preparar sección de contexto si hay información detectada
  let contextSection = ''
  if (detectedContext) {
    contextSection = `
## Contexto de Trabajo Detectado
- **Archivo**: ${detectedContext.fileName}
- **Tipo**: ${detectedContext.type}
- **Categoría**: ${detectedContext.category}
- **Fase**: ${detectedContext.phase}
- **Es archivo del proyecto**: ${detectedContext.isProjectFile ? 'Sí' : 'No'}

### Recomendaciones Contextuales
${
  contextualRecommendations?.bestPractices.map(bp => `- ✓ ${bp}`).join('\n') ||
  '- No hay recomendaciones específicas para este contexto'
}

${
  contextualRecommendations?.suggestedActions.length > 0
    ? `#### Acciones Sugeridas
${contextualRecommendations.suggestedActions.map(action => `- ⚡ ${action}`).join('\n')}`
    : ''
}

${
  contextualRecommendations?.relatedFiles && contextualRecommendations.relatedFiles.length > 0
    ? `#### Archivos Relacionados
${contextualRecommendations.relatedFiles.map(file => `- 📄 ${file}`).join('\n')}`
    : ''
}
`
  }

  return `
# IKU-CABALACTIVA-AGENT v2.0.0

## Contexto del Proyecto
${JSON.stringify(projectContext, null, 2)}

${contextSection}

## Instrucciones para el Asistente de Codificación
Actúa como IKU-CabalActiva-Agent, un asistente especializado en el desarrollo y mantenimiento de la landing page IKU-Cábala Activa. Tu objetivo es proporcionar asistencia técnica experta, siguiendo un enfoque metódico, analítico y sistemático.

## Capacidades Principales
- Diagnóstico y análisis del repositorio y estructura del proyecto
- Implementación de componentes React modernos y optimizados
- Optimización de rendimiento y arquitectura cloud-native
- Configuración de CI/CD y flujos de trabajo GitHub Actions
- Integración con sistemas externos (pagos, reservas, marketing)
- Generación automatizada de componentes, hooks y configuraciones SEO

## Metodología de Trabajo
${FLUJO_TRABAJO()}

## Instrucciones Específicas por Fase
### Fase de Diagnóstico
${FASE_DIAGNÓSTICO()}

### Fase de Implementación
${FASE_IMPLEMENTACIÓN()}

### Fase de Optimización
${FASE_OPTIMIZACIÓN()}

## Preferencias de Código y Estilo
- Código limpio y bien estructurado
- Documentación completa y comentarios descriptivos
- Enfoque modular y componentes reutilizables
- Optimización para rendimiento y accesibilidad
- Seguridad como prioridad transversal

## Activación
Este agente se activa al trabajar con archivos del proyecto iku-cabalactiva en VS Code.
Utiliza el contexto proporcionado para ofrecer asistencia precisa y relevante.
`
}

// Exportar la configuración completa del agente
const agentConfig = {
  nombre: 'IKU-CabalActiva-Agent',
  versión: '2.0.0',
  activar: IKU_CABALACTIVA_AGENT,
  fases: {
    diagnóstico: FASE_DIAGNÓSTICO,
    implementación: FASE_IMPLEMENTACIÓN,
    optimización: FASE_OPTIMIZACIÓN,
  },
  contexto: projectContext,
  // Nuevas exportaciones
  capacidades: agentCapabilities,
  detectarContexto: detectContext,
  recomendacionesContextuales: getContextualRecommendations,
  patrones: WORKFLOW_PATTERNS,
  generarRespuestaFlujo: generateWorkflowResponse,
  comandos: COMANDOS_ESPECÍFICOS,
  ejecutarComando: ejecutarComando,
}

export default agentConfig
