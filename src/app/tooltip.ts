import * as d3 from 'd3';

/**
 * Tooltip
 */
export class Tooltip {
  create(
    parentElement: any,
    tooltiptext: string,
    position: 'bottom' | 'top' | 'left' | 'right' = 'top'
  ): d3.Selection<d3.BaseType, unknown, HTMLElement, any> {
    const parentWidth = tooltiptext.length * 6;

    // Create tooltip container
    const tooltip = d3
      .select(parentElement)
      .append('div')
      .attrs({
        class: 'tooltip'
      });

    let tooltipTextElement = null;

    // Create tooltip text
    tooltip.on('mouseover', () => {
      tooltipTextElement = tooltip
        .append('span')
        .attrs({
          style: `width:${parentWidth}px;margin-left:-${parentWidth / 2 + 8}px`,
          class: `tooltiptext tooltip-${position}`
        })
        .text(tooltiptext);
    });

    // Remove old tooltip when mouseout
    tooltip.on('mouseout', () => {
      if (tooltipTextElement) {
        tooltipTextElement.remove();
        tooltipTextElement = null;
      }
    });

    return tooltip;
  }
}
