import assert from 'assert'
import {operations} from '../../../main/utils/operations/operations'

const {equals, notEquals, isUndefined} = operations;

describe(`The test must show respective out to the input for operation class`, () => {


    it('it should return  true for equals', () => {
        const  comparison = equals(1, 1);
           assert.equal(comparison, true);
       });

       it('it should return true for notequals', () => {
        const  comparison = notEquals(1, 2)
           assert.equal(comparison, true);
       });

       it('it should return true for undefined item in Object', () => {
        const  RFI_OBJECT = {"name": "delta", "started": true};
        const CHECKFORPRESENCE = isUndefined(RFI_OBJECT, 'start_date');
           assert.equal(CHECKFORPRESENCE, true);
       });

   });