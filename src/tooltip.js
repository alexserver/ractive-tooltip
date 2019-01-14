
require('./styles.styl');

var win = window, doc = win.document;

function positionTooltip(event, anchor, tooltip) {

    // Keep the tooltip near where the mouse is
    var mousePos = {x: event.pageX, y: event.pageY};
    var tooltipWidth = tooltip.offsetWidth;
    var tooltipHeight = tooltip.offsetHeight;

    var top = mousePos.y - tooltip.offsetHeight - 5;
    var left = mousePos.x - 20;
    var tooltipHorizontalPos = 'ractive-tooltip-left';
    var tooltipVerticalPos = 'ractive-tooltip-top';

    // if(mousePos.x > win.innerWidth*0.75)
    //     left -= tooltipWidth;

    // account for the edges of the screen, no need to do left
    var topClip = top - tooltipHeight - 5;
    var rightClip = left + tooltipWidth - win.innerWidth;


    if(rightClip > 0) {
        left -= tooltipWidth - 38;
        tooltipHorizontalPos = 'ractive-tooltip-right';
    }

    if(topClip < 0) {
        top += tooltipHeight + 15;
        tooltipVerticalPos = 'ractive-tooltip-bottom';
    } else

    tooltip.style.left = left + 'px';
    tooltip.style.top =  top + 'px';
    tooltip.className = 'ractive-tooltip ' + tooltipHorizontalPos + ' ' + tooltipVerticalPos;
}

function tooltipDecorator(node, content) {

    var tooltip, handlers, eventName;

    var start = function(event) {
        if(!content || content.length === 0)
            return;

        // Create the tooltip
        if(!tooltip)
        {
            tooltipbody = doc.createElement('div');
            tooltiptail = doc.createElement('div');
            tooltipbody.className = 'ractive-tooltip-body';
            tooltiptail.className = 'ractive-tooltip-tail';
            tooltip = doc.createElement('div');
            tooltip.appendChild(tooltipbody);
            tooltip.appendChild(tooltiptail);
            tooltipbody.textContent = content;
            tooltip.className = 'ractive-tooltip ';
        }
        positionTooltip(event, node, tooltip);

        doc.body.appendChild(tooltip);
    }, 

    move = function(event) {

        if(!tooltip) {
            start(event);
            return;
        }
        positionTooltip(event, node, tooltip);
    }, 

    end = function(event) {

        if(!tooltip || !tooltip.parentNode)
            return;

        tooltip.parentNode.removeChild(tooltip);
    };

    handlers = {
        mouseenter: start,
        touchstart: start,
        mousemove: move,
        touchmove: move,
        mouseleave: end,
        touchend: end
    };

    // Add event handlers to the node
    for(eventName in handlers) {
        if(handlers.hasOwnProperty(eventName)) {
            node.addEventListener(eventName, handlers[eventName], false);
        }
    }

    // Return an object with a `teardown()` method that removes the
    // event handlers when we no longer need them
    return {
        update: function(newContent) {
            content = newContent;

            if(tooltip && tooltip.querySelector('.ractive-tooltip-body'))
                tooltip.querySelector('.ractive-tooltip-body').textContent = content;

            if((!content || content.length === 0) && tooltip && tooltip.parentNode)
                tooltip.parentNode.removeChild(tooltip);
        },
        teardown: function() {
            if(tooltip && tooltip.parentNode)
            {
                tooltip.parentNode.removeChild(tooltip);
                tooltip = null;
            }
            for(eventName in handlers) {
                if(handlers.hasOwnProperty(eventName)) {
                    node.removeEventListener(eventName, handlers[eventName], false);
                }
            }
        }
    };
}

module.exports = tooltipDecorator;
