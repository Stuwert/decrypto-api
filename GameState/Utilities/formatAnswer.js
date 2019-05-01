const stripAnswer = ({ show_answer, parent_concept_id, ...rest }) => {
  const answerObject = {
    childConceptId: rest.child_concept_id,
    sequenceLocation:
  };

  if (show_answer) {
    return {
      ...answerObject
      parentConceptId: parent_concept_id,
    }
  }

  return answerObject;
}
