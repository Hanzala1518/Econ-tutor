import { useEffect, useRef, useId } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, '-');

  useEffect(() => {
    const renderDiagram = async () => {
      if (containerRef.current && chart.trim()) {
        try {
          // Clear previous content
          containerRef.current.innerHTML = '';
          
          // Render the diagram
          const { svg } = await mermaid.render(`mermaid-${uniqueId}`, chart.trim());
          containerRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          containerRef.current.innerHTML = `<pre class="text-red-500 text-sm">Diagram rendering error</pre>`;
        }
      }
    };

    renderDiagram();
  }, [chart, uniqueId]);

  return (
    <div className="my-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
      <div ref={containerRef} className="flex justify-center" />
    </div>
  );
}
