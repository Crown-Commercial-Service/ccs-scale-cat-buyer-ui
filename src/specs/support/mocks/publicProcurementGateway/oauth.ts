import { vi } from 'vitest';
import { ppg } from 'main/services/publicProcurementGateway';
import { FetchResult, FetchResultStatus } from 'main/services/types/helpers/api';

const mockCheckUserAuth = (vitestUtils: typeof vi, isAuthenticated: boolean) => {
  const postValidateTokenSpy = vitestUtils.spyOn(ppg.api.oAuth, 'postValidateToken');

  postValidateTokenSpy.mockImplementation(async (): Promise<FetchResult<boolean>> => {
    return {
      status: FetchResultStatus.OK,
      data: isAuthenticated,
      unwrap: () => isAuthenticated
    };
  });
};

export { mockCheckUserAuth };
