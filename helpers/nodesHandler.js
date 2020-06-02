import { sectionsOrder } from './'
import localStyles from '../sectionsReorder.module.scss'

/**
 * Check if the given Node is the last Node within its parent
 * 
 * @param {HTMLElement} node
 */
const isLastNodeInTheTree = (node) => node && !node.nextElementSibling

/**
 * (Remove from the DOM and) Insert the Source Node before the Target Node
 * 
 * @param {*} param0
 * @param {HTMLElement} param0.sourceNode
 * @param {HTMLElement} param0.targetNode
 * @param {HTMLElement} param0.parentNode
 */
const moveSourceBeforeTarget = ({ sourceNode, targetNode, parentNode }) => {
    parentNode.insertBefore(sourceNode, targetNode)
}

/**
 * (Remove from the DOM and) Insert the Source Node before the Target Node next sibling
 * 
 * @param {*} param0
 * @param {HTMLElement} param0.sourceNode
 * @param {HTMLElement} param0.targetNode
 * @param {HTMLElement} param0.parentNode
 */
const moveSourceAfterTarget = ({ sourceNode, targetNode, parentNode }) => {
    parentNode.insertBefore(sourceNode, targetNode.nextElementSibling)
}

/**
 * (Remove from the DOM and) Insert the Source Node as the last child
 * 
 * @param {*} param0
 * @param {HTMLElement} param0.sourceNode
 * @param {HTMLElement} param0.targetNode
 */
const moveSourceToLastNode = ({ sourceNode, parentNode }) => {
    parentNode.appendChild(sourceNode)
}

/**
 * Based on the current position of the Source Node and the Target Node within their (common) parent,
 * insert the Source Node before or after the Target Node
 * 
 * @param {*} param0
 * @param {HTMLElement} param0.sourceNode
 * @param {HTMLElement} param0.targetNode
 * @param {Boolean} param0.insertBefore
 */
export const moveSourceBeforeOrAfterTarget = ({ sourceNode, targetNode, insertBefore }) => {
    const { parentNode } = sourceNode
    sourceNode.classList.add(localStyles.isMoving)
    
    if (insertBefore) {
        moveSourceBeforeTarget({ sourceNode, targetNode, parentNode })
    } else {
        if (isLastNodeInTheTree(targetNode)) {
            moveSourceToLastNode({ sourceNode, parentNode })
        } else {
            moveSourceAfterTarget({ sourceNode, targetNode, parentNode })
        }
    }
}

/**
 * Create a shadow image of the dragged Node
 * 
 * @param {*} param0
 * @param {Number} param0.clientX The current X position of the Node being moved
 * @param {Number} param0.clientY The current Y position of the Node being moved
 * @param {HTMLElement} param0.nodeToMove The Node being moved to clone
 */
export const createDraggableImage = ({ clientX, clientY, nodeToMove }) => {
    const draggableImageNode = nodeToMove.cloneNode(true)
    draggableImageNode.id = localStyles.dragImage
    draggableImageNode.style.height =  `${nodeToMove.offsetHeight}px`
    draggableImageNode.style.width =  `${nodeToMove.offsetWidth}px`
    draggableImageNode.style.transform = `translate(${clientX + 10}px, ${clientY + 10}px) translateZ(0)`
    document.body.appendChild(draggableImageNode)
}

/**
 * When the user move its mouse, update the position of the shadow image of the dragged Node
 * 
 * @param {*} param0
 * @param {Number} param0.clientX The current mouse X position
 * @param {Number} param0.clientY The current mouse Y position
 */
export const moveDraggableImage = ({ clientX, clientY }) => {

    // Slightly move the shadow image node at the bottom left to avoid overlaping events
    document.getElementById(localStyles.dragImage).style.transform = `translate(${clientX + 10}px, ${clientY + 10}px) translateZ(0)`
    // Scroll the container when reaching the top / bottom triggers
    const modalContent = document.getElementById(localStyles.sectionReorderModalContent)
    const headerHeight = 60
    const topTrigger = modalContent.getBoundingClientRect().top + headerHeight
    const footerHeight = 65
    const bottomTrigger = modalContent.getBoundingClientRect().bottom - footerHeight
    if (clientY <= topTrigger) {
        modalContent.scrollTop = modalContent.scrollTop - 20
    } else if (clientY >= bottomTrigger) {
        modalContent.scrollTop = modalContent.scrollTop + 20
    }
}

/**
 * Remove the shadow image of the dragged Node
 */
export const removeRemainingDragImage = () => {
    if (document.getElementById(localStyles.dragImage)) {
        document.body.removeChild(document.getElementById(localStyles.dragImage))
        setTimeout(() => {
            document.getElementById(sectionsOrder.draggedNodeId).classList.remove(localStyles.isMoving)
        }, 100)
    }
}

/**
 * When we drag we keep the outline border after the onDrop.
 * This function removes every remaining border.
 */
export const reinitOutlineBorder = () => {
    Array.from(document.getElementsByClassName(localStyles.section)).forEach((el) => {
        el.classList.remove(localStyles.sectionBeingDragged)
    })
}
