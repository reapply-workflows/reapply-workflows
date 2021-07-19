/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { quadtree, ScaleLinear, select } from 'd3';
import { observer } from 'mobx-react';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

import translate from '../../utils/transform';

export type BrushSize = 20 | 35 | 50;

const useStyles = makeStyles(() => ({
  brushStyle: {
    cursor: 'grabbing',
    stroke: 'gray',
    opacity: 1,
    transition: 'opacity 0.5s',
  },
  brushDownSelection: {
    stroke: '#028A0F',
  },
  brushDownDeselection: {
    stroke: 'rgb(244, 106, 15)',
  },
  brushHide: {
    opacity: 0,
    transition: 'opacity 0.5s',
  },
}));

export const union_color = '';
export type FreeformBrushEvent = 'Start' | 'Brushing' | 'End';
export type FreeformBrushAction = 'Selection' | 'Deselection';

type BrushHandler = (
  points: string[],
  event: FreeformBrushEvent,
  action: FreeformBrushAction,
) => void;

type BrushData = { x: number; y: number; id: string; [other: string]: unknown };

function isInCircle(
  center: { x: number; y: number },
  radius: number,
  point: { x: number; y: number },
) {
  const x_sq = Math.pow(point.x - center.x, 2);
  const y_sq = Math.pow(point.y - center.y, 2);
  const distance = Math.sqrt(x_sq + y_sq);

  return distance <= radius;
}

function useQuadSearch(
  searchArea: { left: number; top: number; width: number; height: number },
  data: BrushData[],
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
) {
  const { left, top, width, height } = searchArea;
  const quadTree = useMemo(() => {
    const qt = quadtree<BrushData>()
      .extent([
        [left - 1, top - 1],
        [width + 1, height + 1],
      ])
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .addAll(data);

    return qt;
  }, [left, top, width, height, data, xScale, yScale]);

  const search = (x: number, y: number, radius: number) => {
    const [x0, x3, y0, y3] = [x - radius, x + radius, y - radius, y + radius];
    const selectedNodes: string[] = [];
    // TODO: Figure out the types for this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    quadTree.visit((node: any, x1, y1, x2, y2) => {
      if (!node.length) {
        let newNode = node;
        do {
          const {
            data: d,
            data: { x: cx, y: cy },
          } = newNode;

          const isSelected = isInCircle({ x, y }, radius, { x: xScale(cx), y: yScale(cy) });

          if (isSelected) {
            selectedNodes.push(d.id);
          }
        } while ((newNode = newNode.next));
      }

      return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
    });

    return selectedNodes;
  };

  return { search };
}

type Props = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  extentPadding?: number;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  onBrush: BrushHandler;
  data: BrushData[];
  brushSize?: BrushSize;
};

const FreeFormBrush: FC<Props> = ({
  left = 0,
  right = 0,
  top = 0,
  bottom = 0,
  extentPadding = 0,
  onBrush,
  xScale,
  yScale,
  brushSize = 35,
  data = [],
}: Props) => {
  const { brushStyle, brushDownSelection, brushDownDeselection, brushHide } = useStyles();
  const brushRef = useRef<SVGCircleElement>(null);
  const layerRef = useRef<SVGRectElement>(null);
  const selectedPointsRef = useRef<string[]>([]);

  const radius = brushSize || 20;

  const [mouseIn, setMouseIn] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [clickMode, setClickMode] = useState(-1);

  const mode: { [key: number]: FreeformBrushAction } = {
    0: 'Selection',
    2: 'Deselection',
  };

  const [height, width] = [
    Math.abs(bottom + extentPadding - (top - extentPadding)),
    Math.abs(left - extentPadding - (right + extentPadding)),
  ];

  const { search } = useQuadSearch({ left, top, width, height }, data, xScale, yScale);

  function handleMouseDown(event: React.MouseEvent<SVGElement, MouseEvent>) {
    const targetNode = layerRef.current;
    setClickMode(event.button);
    setMouseDown(true);

    if (targetNode) {
      const target = targetNode.getBoundingClientRect();
      const [x, y] = [event.clientX - target.left, event.clientY - target.top];
      const selectedPoints = search(x, y, radius);
      selectedPointsRef.current = selectedPoints;
      onBrush(selectedPoints, 'Start', mode[clickMode]);
    }
  }

  function handleMouseUp() {
    const targetNode = layerRef.current;

    if (targetNode) {
      onBrush(Array.from(new Set(selectedPointsRef.current)), 'End', mode[clickMode]);
      selectedPointsRef.current = [];
    }
    setMouseDown(false);
    setClickMode(-1);
  }

  function handleMove(event: MouseEvent) {
    if (!mouseIn) return;
    const node = brushRef.current;
    const targetNode = layerRef.current;

    if (node && targetNode) {
      const target = targetNode.getBoundingClientRect();
      const [x, y] = [event.clientX - target.left, event.clientY - target.top];

      const nodeSelection = select(node);

      const edgeX = x + radius >= width + 10 || x - radius <= -10;
      const edgeY = y + radius >= height + 10 || y - radius <= -10;

      if (!edgeX) nodeSelection.attr('cx', x);

      if (!edgeY) nodeSelection.attr('cy', y);

      if (mouseDown) {
        const selectedPoints = search(x, y, radius);
        selectedPointsRef.current.push(...selectedPoints);
        onBrush(selectedPoints, 'Brushing', mode[clickMode]);
      }
    }
  }

  function addEvent() {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  function removeEvent() {
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  useEffect(() => {
    addEvent();

    return removeEvent;
  });

  return (
    <g
      transform={translate(-extentPadding, -extentPadding)}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setMouseIn(true)}
      onMouseLeave={() => {
        if (!mouseDown) setMouseIn(false);
      }}
    >
      <rect ref={layerRef} fill="none" height={height} pointerEvents="all" width={width} />
      <circle
        ref={brushRef}
        className={clsx(brushStyle, {
          [brushDownSelection]: mouseDown && clickMode === 0,
          [brushDownDeselection]: mouseDown && clickMode === 2,
          [brushHide]: !mouseIn,
        })}
        fill="none"
        pointerEvents={mouseDown ? 'all' : 'initial'}
        r={radius}
        strokeWidth="2"
      />
    </g>
  );
};

export default observer(FreeFormBrush);
