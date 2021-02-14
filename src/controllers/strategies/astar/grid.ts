/* eslint-disable no-plusplus */
/* eslint-disable security/detect-object-injection */
/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable max-classes-per-file */
import * as fs from 'fs'

import { state } from '../../../models/state'

export class Tile {
  public visited = false

  public weight = 6.0

  public gScore = 1e10
}

export class Grid {
  private xlen: number

  private ylen: number

  private data: Array<Array<Tile>>

  constructor(public resolution: number) {
    const l = state.world.field.length + 1.0
    const w = state.world.field.width + 1.0

    this.xlen = l / resolution
    this.ylen = w / resolution

    if (this.xlen < 1 && this.ylen < 1) {
      throw new Error('Problem with grid')
    }

    this.data = Array.from({ length: this.ylen },
      (): Tile[] => Array.from({ length: this.xlen }, () => new Tile()))
  }

  public debugHeatMap(name: string): void {
    const file = fs.createWriteStream(`${name}.ppm`)

    file.write('P3 \n\n')
    file.write(`${this.xlen} ${this.ylen - 1}\n`)
    file.write('255\n')

    const range = 10
    let alpha = 0

    for (let j = (this.ylen - 1); j >= 0; --j) {
      for (let i = 0; i < this.xlen; ++i) {
        // Format weight
        this.data[j][i].weight = this.data[j][i].weight >= 9.5
          ? 10.0
          : Math.round(this.data[j][i].weight)

        alpha = Math.abs(range - this.data[j][i].weight) / range

        let R: number
        let G: number
        let B: number
        if (this.data[j][i].weight >= 9.5) {
          R = 0
          G = 0
          B = 255
        } else {
          R = alpha * 200.0 + (1.0 - alpha) * 255.0
          G = alpha * 200.0 + (1.0 - alpha) * 0.0
          B = alpha * 200.0 + (1.0 - alpha) * 0.0
        }
        file.write(`${R} ${G} ${B} `)
      }
    }

    file.write('\n')
    file.close()
  }
}
