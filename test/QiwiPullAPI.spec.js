const QiwiPullAPI = require('../lib/QiwiPullAPI');
const chai = require('chai');
const { URLSearchParams } = require('url');

const assert = chai.assert;

const prv_id = 264131;
const api_id = 74556135;
const api_password = 'KCVn0OGNdepwbrruSzvE';

const qiwiRestApi = new QiwiPullAPI(prv_id, api_id, api_password);

qiwiRestApi.prvId = prv_id;
qiwiRestApi.apiPassword = api_password;
qiwiRestApi.apiId = api_id;

const bill_id = qiwiRestApi.generateId();

/* const bill_id = crypto.randomBytes(5).toString('hex'); */

const fields = {
    amount: 1.0,
    ccy: 'RUB',
    comment: 'test',
    lifetime: qiwiRestApi.getLifetimeByDay(1),
    user: 'tel:+79086666695'
};

describe('qiwi api v2', () => {
    try {
        it('create bill', async () => {
            try {
                const data = await qiwiRestApi.createBill(bill_id, fields);

                assert.equal('0', data.response.result_code);
            } catch (e) {
                throw e;
            }
        });

        it('get redirect url', () => {
            let options = {
                transaction: bill_id,
                iframe: true,
                successUrl: 'https://example.com/successUrl',
                failUrl: 'https://example.com/failUrl',
                pay_source: 'qw'
            };

            const link = qiwiRestApi.createPaymentForm(options);

            options = {
                shop: prv_id,
                ...options
            };

            const query = new URLSearchParams(options);

            const testLink = `https://bill.qiwi.com/order/external/main.action?${query.toString()}`;

            assert.equal(testLink, link);
        });

        it('returns valid bill status', async () => {
            try {
                const data = await qiwiRestApi.getStatus(bill_id);

                assert.equal('0', data.response.result_code);
            } catch (e) {
                throw e;
            }
        });

        it('cancels bill', async () => {
            try {
                const data = await qiwiRestApi.cancel(bill_id);

                assert.equal('0', data.response.result_code);
            } catch (e) {
                throw e;
            }
        });
    } catch (e) {
        console.error(e);
    }
});
