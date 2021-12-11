enum StepState {
  Optional = 'Optional',
  NotStarted = 'Not started',
  CannotStartYet = 'Cannot start yet',
  InProgress = 'In progress',
  Completed = 'Completed',
}

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
        const key = [
          StepState.NotStarted,
          StepState.CannotStartYet,
          StepState.InProgress,
          StepState.Completed,
        ].includes(stepInfo.state)
          ? 'status'
          : 'required';
        eventTask[key] = stepInfo.state;
      }
      accum = accum + 1;
    });
  });
}
