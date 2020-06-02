import localStyles from '../sectionsReorder.module.scss'
import { onMouseDownOrTouchStart } from './eventsHandler'

// Current Node being dragged.
export const sectionsOrder = {
    // Used to update store which ID we are moving
    draggedNodeId: null,
    initialOrder: [],
}

/**
 * Update the panel's order, save (optional) if the function is given.
 * 
 * @param {*} param0
 * @param {Function} param0.save The save action triggered on drop event
 * @param {Array} param0.sections The panels being rendered
 */
export const updateDataIndexAttributes = ({ save, sections }) => {
    // Get the nodes that need to have their index update
    const elements = document.querySelectorAll(`.${localStyles.section}`)
    const updatedSections = []
    // The given nodes have been already reordered by the onMove event. We just update the data-index here
    elements.forEach((el, index) => {
        el.setAttribute('data-index', index + 1)
        updatedSections.push({ ...sections.find(({ sectionId }) => parseInt(sectionId) === parseInt(el.getAttribute('id'))), sortIndex: index })
    })

    if (save) {
        setTimeout(() => {
            save(updatedSections)
        }, 100)
    }
}

/**
 * Keep the initial position of all the panels to reset their
 * position when the user cancels the changes.
 * 
 * @param {Array} loadedPanels The list of loaded panels
 */
export const saveInitialOrder = (loadedPanels) => {
    sectionsOrder.initialOrder = []
    loadedPanels.forEach(({ sectionId }) => {
        const order = [ ...sectionsOrder.initialOrder ]
        order.push(sectionId)
        sectionsOrder.initialOrder = Array.from(new Set(order))
    })
}

/**
 * If the user cancel the changes in the reordering modal, reset the position
 * of the panels.
 */
export const resetToInitialOrder = () => {
    sectionsOrder.initialOrder.forEach((id, index) => {
        if (index === sectionsOrder.initialOrder.length - 1) {
            document.getElementById(id).parentElement.appendChild(document.getElementById(id))
            document.getElementById(id).setAttribute('data-index', index + 1)
        } else {
            document.getElementById(id).parentElement.insertBefore(document.getElementById(id), document.getElementById(sectionsOrder.initialOrder[index + 1].id))
            document.getElementById(id).setAttribute('data-index', index + 1)
        }
    })
}

/**
 * Return the available events to intialise the drag and drop events
 */
export const withDragAndDrop = ({ save, sections }) => ({
    onMouseDown: (event) => onMouseDownOrTouchStart({ save, sections, event }),
    onTouchStart: (event) => onMouseDownOrTouchStart({ save, sections, event }),
})
