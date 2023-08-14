import { Inequality } from '@/types/classes/Inequality';
import { TargetFunction } from '@/types/classes/TargetFunction';
import { ExtremumType } from '@/types/enums/ExtremumType';
import JXG, {Line} from 'jsxgraph';

const CONSTRAINTS_LINE_COLOR = 'lightgray';
let board: JXG.Board

function getRestructuredConstraintsInfo(inequalities: Inequality[]) {
    const inequalityAsObjects: unknown[] = []
    const lines: Line[] = []

    const plotAxis = inequalities
      .find((el) =>
          el.polynomial.coefficients.filter((coef) =>
              coef.multiplier !== 0
          ).length <= 2
      )
      ?.polynomial.coefficients
      .filter((el) => el.multiplier !== 0)
      .map((el) => el.index) || [0, 1]

    inequalities.forEach((line) => {
      const x = line.polynomial.coefficients.find((el) =>
          el.index === plotAxis[0]
      )?.multiplier || 0
      const y = line.polynomial.coefficients.find((el) =>
          el.index === plotAxis[1]
      )?.multiplier || 1

      const jsxLine = board.create(
        'line',
        [line.polynomial.constant, x, y],
        {strokeColor: CONSTRAINTS_LINE_COLOR}
      )
      lines.push(jsxLine)
      inequalityAsObjects.push(
        board.create(
          'inequality',
          [jsxLine],
          {fillColor: 'transparent', inverse: true}
        )
      )
    })

    return {inequalityAsObjects, plotLines: lines, plotAxis}
}

function buildGeometryArea(inequalityObjects: unknown[]) {
  const [x, y] = [
    board.create('line', [0, 1, 0], {strokeColor: CONSTRAINTS_LINE_COLOR}),
    board.create('line', [0, 0, 1], {strokeColor: CONSTRAINTS_LINE_COLOR})
  ]

  let area = board.create(
    'curveintersection',
    [
      board.create('inequality', [x], {inverse: true, fillOpacity: 0.0}),
      board.create('inequality', [y], {inverse: true, fillOpacity: 0.0})
    ],
    {fillOpacity: 0.0}
  )

  for (let i = 0; i < inequalityObjects.length; i++) {
    area = board.create(
      'curveintersection',
      [area, inequalityObjects[i]],
      i === inequalityObjects.length - 1
        ? {fillOpacity: 0.3, fillColor: 'red'}
        : {fillOpacity: 0.0}
    )
  }

  return {axis: [x, y]}
}

function drawNormalVector(target: TargetFunction) {
  const coordsFrom = [0, 0]
  const coordsTo = target.func.coefficients
    .slice(0, 2)
    .map((el) => el.multiplier)

  if (target.extremumType === ExtremumType.MINIMUM) {
    for (let i = 0; i < coordsTo.length; i++) {
      coordsTo[i] *= -1
    }
  }

  board.create(
    'arrow',
    [
      board.create('point', coordsFrom),
      board.create('point', coordsTo)
    ],
    {strokeColor: 'orange'}
  )
}

function drawIntersectionPointsInFirstQuarter(lines: Array<Line>) {
  for (let i = 0; i < lines.length - 1; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      board.create(
        'intersection',
        [lines[i], lines[j]],
        {opacity: 0.0}
      )
    }
  }
}

// function getResult(sourceTarget: TargetFunction, points: Array<Point>) {
//   const pointToValue = points.map((point) => {
//     return {
//       point,
//       value: sourceTarget.func.getValueIn(...point.coordinates)
//     }
//   }).sort(
//     sourceTarget.extremumType === ExtremumType.MAXIMUM
//       ? (a, b) => b.value - a.value
//       : (a, b) => a.value - b.value
//   )

//   return pointToValue[0]
// }

export async function passPlotStep(
  resultBySimplex: Array<number>,
  shortedTarget: TargetFunction,
  inequalities: Array<Inequality>
) {
  board = JXG.JSXGraph.initBoard(
    'jxgbox', 
    {
      boundingbox: [-10, 10, 10, -10], 
      axis: true,
      showCopyright: false,
      showNavigation: false,
      beautifulScientificTickLabels: true,
    }
  );

  const {inequalityAsObjects, plotLines, plotAxis} = getRestructuredConstraintsInfo(inequalities)
  const {axis} = buildGeometryArea(inequalityAsObjects)
  drawNormalVector(shortedTarget)

  drawIntersectionPointsInFirstQuarter([...plotLines, ...axis])
  board.create(
    'point',
    [
      resultBySimplex[plotAxis[0]], resultBySimplex[plotAxis[1]]
    ],
    {fillColor: 'red'}
  )
  
  return {plotAxis}
}