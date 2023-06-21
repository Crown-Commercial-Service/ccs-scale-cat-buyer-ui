const StepState = {
  Optional: { key: 'Optional', value: 'Optional' },
  NotStarted: { key: 'Not started', value: 'To do' },
  CannotStartYet: { key: 'Cannot start yet', value: 'Cannot start yet' },
  InProgress: { key: 'In progress', value: 'In progress' },
  Completed: { key: 'Completed', value: 'Done' },
};

const getValue = (stateKey: any) => {
  let statusValue;
  switch (stateKey) {
  case 'Optional':
    statusValue = 'Optional';
    break;
  case 'Not started':
    statusValue = 'To do';
    break;
  case 'Cannot start yet':
    statusValue = 'Cannot start yet';
    break;
  case 'In progress':
    statusValue = 'In progress';
    break;
  case 'Completed':
    statusValue = 'Done';
    break;
  default:
    statusValue = null;
    break;
  }
  return statusValue;
};

interface accumType {
  accum: number;
}

const checkSublevels = (
  obj: any,
  accumElem: accumType,
  nameSublevel: string[],
  stepsByType: any,
  agreementId: string,
  projectId: string,
  eventId: string,
  stage2_value?: any
) => {
  if (nameSublevel.length) {
    obj[nameSublevel[0]].forEach((eventTask: any) => {
      const stepInfo = stepsByType[accumElem.accum];

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
          if (agreementId == 'RM6263') {
            //DSP
            eventTask['link'] = '/rfi/online-task-list';
          } else if (agreementId == 'RM1043.8') {
            //MCF3 or DOS or gcloud
            eventTask['link'] = '/rfi/choose-build-your-rfi';
          } else {
            //Default
            eventTask['link'] = '/rfi/online-task-list';
          }
        } else if (stepInfo.step == 20) {
          eventTask[
            'link'
          ] = `/eoi/online-task-list?agreement_id=${agreementId}&proc_id=${projectId}&event_id=${eventId}`;
        }
        if (stepInfo.step == 86 && stage2_value != 'Stage 2') {
          eventTask['status'] = 'Cannot start yet';
        }
        // if (stepInfo.step == 30 && stage2_value == "Stage 2") {
        //   eventTask[
        //     'status'
        //   ] = `Cannot start yet`;
        // }
        /*  else if (stepInfo.step == 30) {
          eventTask[
            'link'
          ] = `/ca/online-task-list?agreement_id=${agreementId}&proc_id=${projectId}&event_id=${eventId}`;
        } */
      }
      accumElem.accum = accumElem.accum + 1;
      if (eventTask[nameSublevel[1]]) {
        checkSublevels(eventTask, accumElem, nameSublevel.slice(-1), stepsByType, agreementId, projectId, eventId);
      }
    });
  }
};

const statusStepsDataFilter = (
  data: any,
  steps: any,
  type: string,
  agreementId: string,
  projectId: string,
  eventId: string,
  stage2_value?: any
) => {
  const { events } = data;

  const accum: accumType = { accum: 0 };
  let stepsByType: any = [];
  switch (type) {
  case 'rfi':
    stepsByType = steps.slice(6, 14);
    if (agreementId == 'RM6187' || agreementId == 'RM1557.13') {
      const result = steps.filter((obj: any) => {
        return obj.step === 81;
      });

      stepsByType.splice(3, 0, result[0]);
    }
    break;
  case 'eoi':
    stepsByType = steps.slice(15, 25);
    break;
  case 'rfp':
    stepsByType = steps.slice(26, 41); //result: step 27 to 41
    if (agreementId == 'RM1043.8') {
      if (stage2_value != undefined && stage2_value == 'Stage 2') {
        const result = steps.filter((obj: any) => {
          return obj.step === 86;
        });
        stepsByType.splice(3, 0, result[0]);
      } else {
        const result = steps.filter((obj: any) => {
          return obj.step === 86;
        });
        stepsByType.splice(14, 0, result[0]);
      }
    }
    break;
  case 'FCA':
    stepsByType = steps.slice(74, 80); //result: step 75 to 80
    break;
  case 'TBD':
    stepsByType = steps.slice(41, 58); //result: step 42 to 58
    break;
  case 'DAA':
    stepsByType = steps.slice(59, 74);
    break;
  case 'DA':
    stepsByType = steps.slice(26, 41); //result: step 27 to 41
    break;
  }
  events.forEach((event: any) => {
    checkSublevels(
      event,
      accum,
      ['eventTask', 'eventSubTask'],
      stepsByType,
      agreementId,
      projectId,
      eventId,
      stage2_value
    );
  });
};

export { getValue, statusStepsDataFilter };
