import Sinon from 'sinon';
import { ppg } from 'main/services/publicProcurementGateway';
import { FetchResult, FetchResultStatus } from 'main/services/types/helpers/api';

const generateResponseMock = (isAuthenticated: boolean): Promise<FetchResult<boolean>> => {
  return new Promise((resolve) => resolve({
    status: FetchResultStatus.OK,
    data: isAuthenticated,
    unwrap: () => isAuthenticated
  }));
};

const mockCheckUserAuth = (mock: Sinon.SinonSandbox, isAuthenticated: boolean) => {
  mock.stub(ppg.api.oAuth, 'postValidateToken').returns(generateResponseMock(isAuthenticated));
};

export { mockCheckUserAuth };
