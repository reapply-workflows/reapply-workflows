/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { getX } from './LinkTransitions';

export default function nodeTransitions(
  xOffset: number,
  yOffset: number,
  clusterOffset: number,
  backboneOffset: number,
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  duration: number = 500,
  annotationOpen: number,
  annotationHeight: number,
) {
  xOffset = -xOffset;
  backboneOffset = -backboneOffset;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const start = (data: any) => {
    let clusteredNodesInFront = 0;

    const x = getX(data.width, xOffset, backboneOffset);
    // eslint-disable-next-line max-len
    clusteredNodesInFront =
      clusteredNodesInFront === 0 ? clusteredNodesInFront : clusteredNodesInFront - 1;

    let y = yOffset * data.depth - (yOffset - clusterOffset) * clusteredNodesInFront;

    if (annotationOpen !== -1 && data.depth > annotationOpen && data.width === 0) {
      y += annotationHeight;
    }

    return { x, y: y - yOffset, opacity: 0 };
  };

  const enter = (data: any) => {
    let clusteredNodesInFront = 0;

    const x = getX(data.width, xOffset, backboneOffset);

    // eslint-disable-next-line max-len
    clusteredNodesInFront =
      clusteredNodesInFront === 0 ? clusteredNodesInFront : clusteredNodesInFront - 1;

    let y = yOffset * data.depth - (yOffset - clusterOffset) * clusteredNodesInFront;

    if (annotationOpen !== -1 && data.depth > annotationOpen && data.width === 0) {
      y += annotationHeight;
    }

    return {
      x: [x],
      y: [y],
      opactiy: 1,
      timing: { duration },
    };
  };

  const update = (data: any) => {
    let clusteredNodesInFront = 0;

    const x = getX(data.width, xOffset, backboneOffset);

    // eslint-disable-next-line max-len
    clusteredNodesInFront =
      clusteredNodesInFront === 0 ? clusteredNodesInFront : clusteredNodesInFront - 1;

    let y = yOffset * data.depth - (yOffset - clusterOffset) * clusteredNodesInFront;

    if (annotationOpen !== -1 && data.depth > annotationOpen && data.width === 0) {
      y += annotationHeight;
    }

    return {
      x: [x],
      y: [y],
      opactiy: 1,
      timing: { duration },
    };
  };

  return {
    enter,
    leave: start,
    update,
    start,
  };
}
