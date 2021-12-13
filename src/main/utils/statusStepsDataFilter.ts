export const StepState = {
  Optional: { key: 'Optional', value: 'Optional' },
  NotStarted: { key: 'Not started', value: 'To do' },
  CannotStartYet: { key: 'Cannot start yet', value: 'Cannot start yet' },
  InProgress: { key: 'In progress', value: 'In progress' },
  Completed: { key: 'Completed', value: 'Done' },
};
export const getValue = (stateKey: any) => {
  const elemState: any = Object.keys(StepState).find((elem: any) => elem.key === stateKey);
  return elemState.value;
};

export function statusStepsDataFilter(data: any, steps: any, type: string) {
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
        ].includes(stepInfo.state)
          ? 'status'
          : 'required';
        eventTask[keyMap] = getValue(stepInfo.state);
      }
      accum = accum + 1;
    });
  });
}
