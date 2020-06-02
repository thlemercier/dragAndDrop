import { moveDraggableImage, moveSourceBeforeOrAfterTarget, createDraggableImage, removeRemainingDragImage, reinitOutlineBorder } from './nodesHandler'
import localStyles from '../sectionsReorder.module.scss'
import { sectionsOrder, updateDataIndexAttributes } from './'

// Those 2 attributes are used to store the events function to be able to remove their listeners
const on = {
    move: null,
    end: null,
}

/**
 * onMouseMove event or onTouchMove event, move the current selected node within the list
 * 
 * @param {*} param0
 * @param {Array} param0.sections The list of rendered panels
 * @returns {Function} The (event) => {} function
 */
const onMouseOrTouchMove = () => (event) => {
    const { clientX, clientY } = event.changedTouches?.length ? event.changedTouches[0] : event
    moveDraggableImage({ clientX, clientY })

    const targetNode = document.elementFromPoint(clientX, clientY).parentNode
    const sourceNode = document.getElementById(sectionsOrder.draggedNodeId)

    if (targetNode !== sourceNode && targetNode.classList.contains(localStyles.section)) {
        const isMouseOnLeftSideOfSection = targetNode.getBoundingClientRect().x + (targetNode.offsetWidth / 2) >= clientX
        
        // Set the css class to "animate" the section to the left or to the right
        if (isMouseOnLeftSideOfSection) {
            targetNode.classList.remove(localStyles.hoverRight)
            targetNode.classList.add(localStyles.sectionHovered)
            targetNode.classList.add(localStyles.hoverLeft)
        } else {
            targetNode.classList.remove(localStyles.hoverLeft)
            targetNode.classList.add(localStyles.sectionHovered)
            targetNode.classList.add(localStyles.hoverRight)
        }
        
    } else {
        Array.from(document.getElementsByClassName(localStyles.section)).forEach((el) => {
            el.classList.remove(localStyles.sectionHovered)
            el.classList.remove(localStyles.hoverLeft)
            el.classList.remove(localStyles.hoverRight)
        })
    }

}

/**
 * Remove all the event listeners attached to the document, remove the shadow image from the DOM
 * and trigger the save positions function
 * 
 * @returns {Function} The (event) => {} function
 */
const onMouseUpOrTouchEnd = ({ sections }) => (event) => {
    const { clientX, clientY } = event.changedTouches?.length ? event.changedTouches[0] : event
    const targetNode = document.elementFromPoint(clientX, clientY).parentNode
    
    // ID of the node being dragged
    const sourceNode = document.getElementById(sectionsOrder.draggedNodeId)
    moveSourceBeforeOrAfterTarget({ sourceNode, targetNode, insertBefore: targetNode.classList.contains(localStyles.hoverLeft) })
    updateDataIndexAttributes({ sections })

    document.removeEventListener('mousemove', on.move)
    document.removeEventListener('touchmove', on.move)
    document.removeEventListener('touchend', on.end)
    document.removeEventListener('mouseup', on.end)
    removeRemainingDragImage()
    Array.from(document.getElementsByClassName(localStyles.section)).forEach((el) => {
        el.classList.remove(localStyles.sectionHovered)
        el.classList.remove(localStyles.hoverLeft)
        el.classList.remove(localStyles.hoverRight)
    })
}

/**
 * Start moving the selected DOM Node (selected panel)
 * 
 * @param {*} param0
 * @param {Function} param0.save The save function that saves the updated positions
 * @param {Array} param0.sections The list of rendered panels
 * @returns {Function} The (event) => {} function
 */
export const onMouseDownOrTouchStart = ({ sections, event }) => {
    event.preventDefault()
    event.stopPropagation()
    reinitOutlineBorder()
    const { clientX, clientY } = event.changedTouches?.length ? event.changedTouches[0] : event
    const nodeToMove = event.target.classList.contains(localStyles.section) ? event.target : event.target.parentNode
    nodeToMove.classList.add(localStyles.sectionBeingDragged)
    sectionsOrder.draggedNodeId = nodeToMove.id
    on.move = onMouseOrTouchMove()
    on.end = onMouseUpOrTouchEnd({ sections })

    createDraggableImage({ clientX, clientY, nodeToMove })
    document.addEventListener('mousemove', on.move)
    document.addEventListener('touchmove', on.move, { passive: false })
    document.addEventListener('touchend', on.end)
    document.addEventListener('mouseup', on.end)
}
