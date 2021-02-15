/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { AbstractPoint, Point } from '@nodetron/math/point2D'

import { state } from '../../models/state'

import { Grid, Tile } from './astar/grid'
import { Cursor } from './astar/cursor'
/**
 * This class is an example of the new way to create Strategies.
 * It is basic and needs to be improved !
 * call "MSB.astar" ' { "id" : 1, "target" : { "x" : 0, "y" : "0"}}' (To try with npm run repl)
 */
export default class AStar extends Strategies {
  name = 'AStar';

  public constructor(public id: number, public target: Point) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {
      id: {
        type: 'number', min: 0, max: 15,
      },
      target: 'object',
    },
    handler(ctx: Context<{ id: number, target: AbstractPoint }>): void {
      state.assign.register([ctx.params.id], new AStar(
        ctx.params.id,
        new Point(ctx.params.target.x, ctx.params.target.y),
      ))
    },
  }

  compute(broker: ServiceBroker): boolean {
    const robot = state.world.robots.allies[this.id]

    const grid = new Grid(0.2)
    grid.fillGrid(robot.id)

    const openSet = new Array<{ i: number, j: number }>()

    const c = new Cursor(grid)
    c.update(robot.position)

    c.getTile().gScore = 0

    while (openSet.length > 0) {
      const t = openSet.shift()
      if (t === undefined) { break }

      const p = new Point(t.i, t.j)
      c.update(p)
      const current = c.getTile()

      current.visited = true

      if (this.target.distance(grid.cellToCoord(p.x, p.y)) < grid.resolution) {
        // TODO
      }

      for (const neighbour of c.findNeighbour()) {
        c.update(neighbour)
        if (c.getTile().visited) { continue }
        const g = current.gScore + p.distance(x)
        if (g < c.getTile().gScore) {
          c.getTile().parent = current
          c.getTile().gScore = g
          openSet.push({ i: neighbour.x, j: neighbour.y }) // TODO Not good
        }
      }
    }
    grid.debugHeatMap('test')

    return true
  }
}
