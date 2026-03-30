import { useEffect, useRef } from 'react';
import cloud from 'd3-cloud';
import { WordCountDto } from '../util/types';

interface WordCloudCanvasProps {
  words: WordCountDto[];
}

const WIDTH = 750;
const HEIGHT = 320;
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export default function WordCloudCanvas({ words }: WordCloudCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const top100 = [...words]
      .sort((a, b) => b.count - a.count)
      .slice(0, 100);

    if (top100.length === 0) return;

    const maxCount = Math.max(...top100.map((w) => w.count), 1);

    const cloudWords: cloud.Word[] = top100.map((w) => ({
      text: w.word,
      size: Math.round(14 + (w.count / maxCount) * 60),
    }));

    cloud()
      .size([WIDTH, HEIGHT])
      .words(cloudWords)
      .padding(4)
      .rotate(0)
      .font('sans-serif')
      .fontSize((d) => d.size ?? 14)
      .on('end', (placed: cloud.Word[]) => {
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        element.setAttribute('transform', `translate(${WIDTH / 2},${HEIGHT / 2})`);

        placed.forEach((d, i) => {
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('font-family', d.font ?? 'sans-serif');
          text.setAttribute('font-size', String(d.size ?? 14));
          text.setAttribute('fill', COLORS[i % COLORS.length]);
          text.setAttribute(
            'transform',
            `translate(${d.x ?? 0},${d.y ?? 0}) rotate(${d.rotate ?? 0})`
          );
          text.textContent = d.text ?? '';
          element.appendChild(text);
        });

        svg.appendChild(element);
      })
      .start();
  }, [words]);

  if (words.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-8">No words to display.</p>;
  }

  return (
    <div className="w-full overflow-hidden">
      <svg ref={svgRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
}
