import 'katex/dist/katex.min.css';
import katex from 'katex';

function repairLatex(value) {
  return value
    .replace(/\\{2,}(?=(?:frac|sqrt|ln|sin|cos|tan|exp|neq|implies)\b)/g, '\\')
    .replace(/\\dfrac\b/g, '\\frac')
    .replace(/\\(?:le|leq)\b/g, '\\leq')
    .replace(/\\(?:ge|geq)\b/g, '\\geq')
    .replace(/\u2260/g, '\\neq')
    .replace(/\u00d7/g, '\\times')
    .replace(/\\rac(?=\s*\{)/g, '\\frac')
    .replace(/\brac(?=\s*\{)/g, '\\frac')
    .replace(/\beq(?=\s*[-+0-9a-zA-Z])/g, '\\neq')
    .replace(/\bneq(?=\s*[-+0-9a-zA-Z])/g, '\\neq')
    .replace(/\bimplies\b/g, '\\implies');
}

function wrapPlainFormula(value) {
  let text = repairLatex(value);
  text = text.replace(/(\\frac\s*\{[^{}]*\}\s*\{[^{}]*\})/g, '$$$1$$');
  text = text.replace(/(\\(?:sqrt|ln|sin|cos|tan|exp)\s*(?:\{[^{}]*\}|\([^)]*\)|[A-Za-z]))/g, '$$$1$$');
  text = text.replace(/(\\(?:neq|implies)\s*[A-Za-z0-9+-]+)/g, '$$$1$$');
  text = text.replace(/([A-Za-z0-9)]\s*\^\s*(?:\{[^{}]*\}|[A-Za-z0-9+-]+))/g, '$$$1$$');
  text = text.replace(/([A-Za-z]\s*\\neq\s*[A-Za-z0-9+-]+)/g, '$$$1$$');
  return text;
}

function renderPart(part, index) {
  const isBlock = part.startsWith('$$') && part.endsWith('$$');
  const expression = isBlock ? part.slice(2, -2) : part.slice(1, -1);

  try {
    return (
      <span
        key={`${part}-${index}`}
        className={isBlock ? 'my-3 block overflow-x-auto' : 'inline-block'}
        dangerouslySetInnerHTML={{ __html: katex.renderToString(expression, { throwOnError: false, displayMode: isBlock }) }}
      />
    );
  } catch {
    return <span key={`${part}-${index}`}>{part}</span>;
  }
}

export default function MathText({ children, className = '' }) {
  const text = children === null || children === undefined ? '' : String(children);
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g).map((part) => {
    if (part.startsWith('$$')) return `$$${repairLatex(part.slice(2, -2))}$$`;
    if (part.startsWith('$')) return `$${repairLatex(part.slice(1, -1))}$`;
    return wrapPlainFormula(part);
  });

  return (
    <span className={className}>
      {parts.map((part, index) => (
        part.startsWith('$') ? renderPart(part, index) : <span key={`${part}-${index}`}>{part}</span>
      ))}
    </span>
  );
}
