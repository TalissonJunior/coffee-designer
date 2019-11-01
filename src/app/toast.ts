import * as d3 from 'd3';
import { setTimeout } from 'timers';

export class Toast {
  private self: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;

  constructor() {
    this.self = d3.select('body .toast');

    if (!this.self.node()) {
      this.self = d3
        .select('body')
        .append('div')
        .attrs({
          class: 'toast'
        });
    }
  }

  show(message: string, timeout = 3000): void {
    this.self
      .attrs({
        class: 'toast show'
      })
      .text(message);

    setTimeout(() => {
      this.self
        .attrs({
          class: 'toast'
        })
        .text('');
    }, timeout);
  }
}
