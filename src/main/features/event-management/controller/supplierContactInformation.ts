import * as express from 'express';
import {LoggTracer} from '@common/logtracer/tracer';
import {TokenDecoder} from '@common/tokendecoder/tokendecoder';
import {TenderApi} from '@common/util/fetch/procurementService/TenderApiInstance';
import {GetLotSuppliers} from 'main/features/shared/supplierService';
import {stringify} from 'csv-stringify/sync';


export const SUPPLIER_CONTACT_INFORMATION = async (req: express.Request, res: express.Response) => {
    const {SESSION_ID} = req.cookies;
    const {projectId} = req.session;
    const {eventId} = req.session;
    const {download} = req.query;

    try {
        if (download != undefined) {
            const events = (await TenderApi.Instance(SESSION_ID).get(`/tenders/projects/${projectId}/events`)).data;
            const stage1 = events.find((e: any) => !e.title.includes('-FC'));
            const stage2 = events.find((e: any) => e.title.includes('-FC'));

            const stage1Suppliers = await TenderApi.Instance(SESSION_ID).get(`tenders/projects/${projectId}/events/${stage1.id}/responses`);
            const stage2Suppliers = await TenderApi.Instance(SESSION_ID).get(`tenders/projects/${projectId}/events/${stage2.id}/responses`);

            const fullSupplierDataList = await GetLotSuppliers(req);
            const supplierScore = await TenderApi.Instance(SESSION_ID).get(`tenders/projects/${projectId}/events/${eventId}/scores`);

            const respondedSuppliers = stage1Suppliers.data.responders.filter((supplier: any) => supplier.responseState === 'Submitted');

            const combinedList = respondedSuppliers.map((supplier: any) => {
                const contactData = fullSupplierDataList.find((supplierDetail) => supplier.supplier.id === supplierDetail.organization.id);
                const scoreData = supplierScore.data.find((scoreDetail: any) => supplier.supplier.id === scoreDetail.organisationId);
                const invitedToStage2 = stage2Suppliers.data.responders.find((stage2Supplier: any) => stage2Supplier.supplier.id === supplier.supplier.id);

                return {
                    NAME: supplier.supplier.name,
                    US_DUNS: supplier.supplier.id,
                    CONTACT_EMAIL: contactData?.organization?.contactPoint?.email || '',
                    SCORE: scoreData?.score || '',
                    INVITED_TO_STAGE_2: Boolean(invitedToStage2)
                };
            }).sort((a: any, b: any) => b.INVITED_TO_STAGE_2 - a.INVITED_TO_STAGE_2);

            const csv = stringify(combinedList, {
                header: true,
                columns: [
                    {key: 'NAME', header: 'NAME'},
                    {key: 'US_DUNS', header: 'US_DUNS'},
                    {key: 'CONTACT_EMAIL', header: 'CONTACT_EMAIL'},
                    {key: 'SCORE', header: 'SCORE'},
                    {key: 'INVITED_TO_STAGE_2', header: 'INVITED_TO_STAGE_2'}
                ],
                cast: {
                    number: function (value) {
                        return String(value);
                    },
                    boolean: function (value) {
                        return value ? 'Yes' : 'No';
                    }
                }
            });

            res.attachment(`${projectId}-suppliers.csv`);
            res.status(200).send(csv);
        }
    } catch (error) {
        LoggTracer.errorLogger(
            res,
            error,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Download Supplier Contact Details - Error Creating CSV',
            true,
        );
    }
};