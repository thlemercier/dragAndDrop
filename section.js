const RenderedSection = ({
    sectionId, renderedSectionProps, section, index,
    sectionBeingDragged, renderedSections, saveOrder, panelsValueResults,
}) => {
    return (
        <React.Fragment key={sectionId}>
            <div
                // The ID is used to update the indexes of the sections in helper.js/updateDataIndexAttributes()
                id={sectionId}
                // The data-index is used to update the indexes and display the number on top of the sections
                data-index={index + 1}
                {
                    ...withDragAndDrop({
                        save: saveOrder,
                        sections: renderedSections,
                    })
                }
                className={classnames(
                    localStyles.section,
                    sectionBeingDragged?.id === sectionId && localStyles.sectionBeingDragged,
                    sectionId === sectionBeingDragged?.duplicatedId && localStyles.isDuplicated,
                )}
            >
                <div className={classnames(
                    localStyles.sectionClickableArea,
                    (!sectionBeingDragged || sectionBeingDragged.id === sectionId) && localStyles.enabled,
                )} />
                <EllipsisWithTooltip textContent={section.panelName} classes={[ localStyles.panelName ]} />
                <ReportRenderer {...renderedSectionProps} panelsValueResults={panelsValueResults} isSectionReorderMode />
            </div>
        </React.Fragment>
    )
}
