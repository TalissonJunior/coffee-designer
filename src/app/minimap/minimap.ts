import * as d3 from 'd3';
import { MiniMapOptions } from './minimap-options';
import { WorkSpace } from '../workspace/workspace';

/**
 * https://bl.ocks.org/tlfrd/5efbd1639276d58c904fd1f74508335f
 * Minimap
 */
export class Minimap {
  options: MiniMapOptions;
  self: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;

  constructor(container: string, target: WorkSpace, options: MiniMapOptions) {
    this.options = options;

    this.self = d3
      .select(container)
      .append('xhtml:div')
      .attrs({
        class: 'minimap minimap-bottom-right',
        style: this.createStyleHeightWidth(options.heigth, options.width)
      });

    this.createZoomViewPort(this.self, target.svg);
  }

  /**
   * Create minimap zoom view port
   */
  createZoomViewPort(
    container: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
  ): void {
    const zoomViewPort = container.append('xhtml:div').attrs({
      class: 'minimap-viewport',
      style: this.createStyleHeightWidth(
        this.windowHeight() / this.options.scale,
        this.windowWidth() / this.options.scale
      )
    });

    var dragPosX = 0;
    var dragPosY = 0;

    // Add drag behavior
    const drag = d3.drag().on('drag', () => {
      const currentPosX = dragPosX + d3.event.dx;
      const currentPosY = dragPosY + d3.event.dy;

      const bounds = this.getZoomViewPortBounds(
        this.options.width - this.windowWidth() / this.options.scale,
        this.options.heigth - this.windowHeight() / this.options.scale
      );

      // Validate bounds
      // LEFT
      // If x is positive and is on the left bound then allow user to move on y and x
      if (currentPosX < bounds.left && this.isNumberPositive(d3.event.dx)) {
        dragPosX += d3.event.dx;
        dragPosY += d3.event.dy;
      }
      // If x is negative and is on the left bound then allow user to only move on y
      // or it will overflow the left bound
      else if (
        currentPosX < bounds.left &&
        !this.isNumberPositive(d3.event.dx)
      ) {
        dragPosY += d3.event.dy;
      }
      // RIGHT
      // If x is negative and is on the right bound then allow user to move on y and x
      else if (
        currentPosX > bounds.right &&
        !this.isNumberPositive(d3.event.dx)
      ) {
        dragPosX += d3.event.dx;
        dragPosY += d3.event.dy;
      }
      // If x is positive and is on the right bound then allow user to only move on y
      // or it will overflow the right bound
      else if (
        currentPosX > bounds.right &&
        this.isNumberPositive(d3.event.dx)
      ) {
        dragPosY += d3.event.dy;
      }
      // TOP
      // If y is positive and is on the top bound then allow user to move on y and x
      else if (currentPosY < bounds.top && this.isNumberPositive(d3.event.dy)) {
        dragPosX += d3.event.dx;
        dragPosY += d3.event.dy;
      }
      // If x is negative and is on the top bound then allow user to only move on x
      // or it will overflow the top bound
      else if (
        currentPosY < bounds.top &&
        !this.isNumberPositive(d3.event.dy)
      ) {
        dragPosX += d3.event.dx;
      }
      // Bottom
      // If y is negative and is on the bottom bound then allow user to move on y and x
      else if (
        currentPosY > bounds.bottom &&
        !this.isNumberPositive(d3.event.dy)
      ) {
        dragPosX += d3.event.dx;
        dragPosY += d3.event.dy;
      }
      // If x is positive and is on the bottom bound then allow user to only move on x
      // or it will overflow the bottom bound
      else if (
        currentPosY > bounds.bottom &&
        this.isNumberPositive(d3.event.dy)
      ) {
        dragPosX += d3.event.dx;
      } else {
        dragPosX += d3.event.dx;
        dragPosY += d3.event.dy;
      }

      // Change the zoom view portposition
      zoomViewPort.attr(
        'style',
        this.createStyleHeightWidth(
          this.windowHeight() / this.options.scale,
          this.windowWidth() / this.options.scale
        ) + `left:${dragPosX}px;top:${dragPosY}px`
      );

      var translate = [
        -dragPosX * this.options.scale,
        -dragPosY * this.options.scale
      ];

      // Change target position based on zoom view port position
      target.attr('transform', 'translate(' + translate + ')');
    });

    zoomViewPort.call(drag);
  }

  private isNumberPositive(value: number): boolean {
    switch (Math.sign(value)) {
      case 0:
        return true;
      case 1:
        return true;
      default:
        false;
    }
  }

  private getZoomViewPortBounds(width: number, height: number) {
    return {
      left: 0,
      top: 0,
      bottom: height,
      right: width
    };
  }

  private createStyleHeightWidth(height: number, width: number): string {
    return `width:${width}px;height:${height}px;`;
  }

  private windowHeight(): number {
    return (
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight
    );
  }

  private windowWidth(): number {
    return (
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    );
  }
}
