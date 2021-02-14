/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'

import { state } from '../../models/state'

import { Grid, Tile } from './astar/grid'
/**
 * This class is an example of the new way to create Strategies.
 * It is basic and needs to be improved !
 * call "MSB.astar" ' { "id" : 1, "target" : { "x" : 0, "y" : "0"}}' (To try with npm run repl)
 */
export default class AStar extends Strategies {
  name = 'AStar';

  public constructor(public id: number) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {
      id: {
        type: 'number', min: 0, max: 15,
      },
      target: 'object',
    },
    handler(ctx: Context<{ id: number }>): void {
      state.assign.register([ctx.params.id], new AStar(ctx.params.id))
    },
  }

  compute(broker: ServiceBroker): boolean {
    const robot = state.world.robots.allies[this.id]

    const grid = new Grid(0.2)
    grid.fillGrid(robot.id)

    const openSet = new Array<Tile>()
    openSet.push()
    grid.debugHeatMap('test')

    return true
  }
}
