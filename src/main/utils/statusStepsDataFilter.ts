const StepState = {
  Optional: { key: 'Optional', value: 'Optional' },
  NotStarted: { key: 'Not started', value: 'To do' },
  CannotStartYet: { key: 'Cannot start yet', value: 'Cannot start yet' },
  InProgress: { key: 'In progress', value: 'In progress' },
  Completed: { key: 'Completed', value: 'Done' },
};
export const getValue = (stateKey: any) => {
  let statusValue
  switch ( stateKey ) {
    case 'Optional':
      statusValue = 'Optional'
        break;
    case 'Not started':
      statusValue = 'To do'
        break;
    case 'Cannot start yet':
      statusValue = 'Cannot start yet'
        break;
    case 'In progress':
      statusValue = 'In progress'
        break;
    case 'Completed':
      statusValue = 'Done'
        break;
    default: 
      statusValue = null
        break;
 }
  return statusValue;
};

export function statusStepsDataFilter(data: any, steps: any, type: string, agreement_id: string, projectId: string, event_id: string) {
  const { events } = data;
  let accum = 0;
  let stepsByType: any = [];
  switch (type) {
    case 'rfi':
      stepsByType = steps.slice(5, 15);
      break;
    case 'eoi':
      stepsByType = steps.slice(15, 25);
      break;
    case 'CA':
      stepsByType = steps.slice(44, 58);
      break;
  }

  events.forEach((event: any) => {
    event.eventTask.forEach((eventTask: any) => {
      const stepInfo = stepsByType[accum];

      if (stepInfo) {
        const keyMap = [
          StepState.NotStarted.key,
          StepState.CannotStartYet.key,
          StepState.InProgress.key,
          StepState.Completed.key,
          StepState.Optional.key,
        ].includes(stepInfo.state)
          ? 'status'
          : 'required';
        eventTask[keyMap] = getValue(stepInfo.state);
        if (stepInfo.step == 10) {
          eventTask[
            'link'
          ] = `/rfi/online-task-list?agreement_id=${agreement_id}&proc_id=${projectId}&event_id=${event_id}`;
        } else if (stepInfo.step == 20) {
          eventTask[
            'link'
          ] = `/eoi/online-task-list?agreement_id=${agreement_id}&proc_id=${projectId}&event_id=${event_id}`;
        } else if (stepInfo.step == 14) {
          eventTask[
            'link'
          ] = `/ca/online-task-list?agreement_id=${agreement_id}&proc_id=${projectId}&event_id=${event_id}`;
        } 
      }
      accum = accum + 1;
    });
  });
}
