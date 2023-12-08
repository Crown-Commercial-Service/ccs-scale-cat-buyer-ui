const baseURL = () => process.env.AGREEMENTS_SERVICE_API_AWS_URL;

// Strip out legacy formatting from the supplied Lot ID, so that legacy projects can continue to work with the updated Agreement Service
function formatLotIdForAgreementService (lotId: string) {
  return lotId.replace('Lot ', '');
};

export { baseURL, formatLotIdForAgreementService };
