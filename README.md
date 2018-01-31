# QIWI Wallet Pull API Node.js SDK
Node.js SDK для внедрения прием платежей с баланса QIWI Кошелька путем выставления счета.

## Установка и подключение

Установка с помощью npm:

```bash
$ npm install git +https://github.com/QIWI-API/pull-payments-node-js-sdk.git --save
```

Подключение:

```javascript
const QiwiPullAPI = require('pull-rest-api-node-js-sdk');
```

## Документация

**QIWI Wallet Pull API**: https://developer.qiwi.com/ru/pull-payments

## Авторизация

Для использования SDK требуется: `prv_id` - ID проекта, `api_id` - идентификатор для авторизации провайдера в API, `api_password` - пароль для авторизации в API, подробности в [документации](https://developer.qiwi.com/ru/pull-payments/index.html?http#auth_param).

```javascript
const prv_id = 5814662325;
const api_id = 7559058292;
const api_password = 'MzAci8yl2NZgmoZDMZRD*****';

const qiwiRestApi = new QiwiPullAPI(prv_id, api_id, api_password);
```

Смена `prv_id`, `api_id`, `api_password` на новые:

```javascript
const new_prv_id = 6814672325;
const new_api_id = 8999058292;
const new_api_password = 'LzAcisncosidsimoZDMZRD*****';

qiwiRestApi.prvId = prv_id;
qiwiRestApi.apiPassword = api_password;
qiwiRestApi.apiId = api_id;
```

## Примеры

### Выставление счета

Метод `createBill` выставляет новый счет на указанный номер телефона `fields.user`. В параметрах нужно указать: идентификатор счета `bill_id` внутри вашей системы и дополнительными параметрами `fields`. В результате будет получена ответ с данными о выставленном счете Подробнее о доступных параметрах в [документации](https://developer.qiwi.com/ru/pull-payments/index.html?http#invoice_rest).

```javascript
const bill_id = '893794793973';

const fields = {
    amount: 1,
    ccy: 'RUB',
    comment: 'test',
    lifetime: '2017-07-25T09:00:00',
    user: 'tel:+799955515**'
};

qiwiRestApi.createBill( bill_id, fields ).then( data => {
    //do with data
});
```

В результате:

```json
{
    "response": {
        "result_code": 0,
        "bill": {
            "bill_id": "893794793973",
            "amount": "1.00",
            "ccy": "RUB",
            "status": "waiting",
            "error": 0,
            "user": "tel:+799955515**",
            "comment": "test"
        }
    }
}
```

### Платежная форма

Метод `createPaymentForm` создает платежную форму. В параметрах нужно указать: идентификатор счета `transaction` то же самое, что `bill_id`. В результате будет получена ссылка на форму оплаты, которую можно передать клиенту. Подробнее о доступных параметрах в [документации](https://developer.qiwi.com/ru/pull-payments/index.html?http#checkout_ru).

```javascript
const bill_id = '893794793973';

const options = {
    transaction: billId,
    iframe: true,
    successUrl: 'https://example.com/successUrl',
    failUrl: 'https://example.com/failUrl',
    pay_source: 'qw'
};

const link = qiwiRestApi.createPaymentForm(options);
```

В результате:

```
https://bill.qiwi.com/order/external/main.action?shop=6814672325&transaction=893794793973&iframe=true&successUrl=https%3A%2F%2Fexample.com%2FsuccessUrl&failUrl=https%3A%2F%2Fexample.com%2FfailUrl&pay_source=qw
```

### Статус счета

Метод `getStatus` проверяет статус оплаты счета. В параметрах нужно указать идентификатор счета `bill_id` внутри вашей системы, в результате будет получен ответ со статусом счета. Подробнее в [документации](https://developer.qiwi.com/ru/pull-payments/index.html?http#invoice-status).

```javascript
const bill_id = '893794793973';

qiwiRestApi.getStatus(bill_id).then( data => {
    //do with data
});
```

Ответ:

```json
{
    "response": {
        "result_code": 0,
        "bill": {
            "bill_id": "893794793973",
            "amount": "1.00",
            "ccy": "RUB",
            "status": "waiting",
            "error": 0,
            "user": "tel:+799955515**",
            "comment": "test"
        }
    }
}
```

### Отмена неоплаченного счета

Метод `cancel` отменяет неоплаченный счет. В параметрах нужно указать идентификатор счета `bill_id` внутри вашей системы, в результате будет получен ответ с информацией о счете. Подробнее в [документации](https://developer.qiwi.com/ru/pull-payments/index.html?http#cancel).

```javascript
const bill_id = '893794793973';

qiwiRestApi.cancel(bill_id).then( data => {
    //do with data
});
```

Ответ:

```json
{
    "response": {
        "result_code": 0,
        "bill": {
            "bill_id": "893794793973",
            "amount": "1.00",
            "ccy": "RUB",
            "status": "rejected",
            "error": 0,
            "user": "tel:+799955515**",
            "comment": "test"
        }
    }
}
```

### Возврат средств

Методом `refund` производит возврат средств. В параметрах нужно указать идентификатор счета `bill_id`, идентификатор возврата `refund_id` внутри вашей системы и сумму возврата `amount`. Подробнее в [документации](https://developer.qiwi.com/ru/pull-payments/index.html?http#refund).

```javascript
const bill_id = '893794793973';
const refund_id = '899343443';
const amount = 1;

qiwiRestApi.refund(bill_id, refund_id, amount).then( data => {
    //do with data
});
```

В результате будет получен ответ с информацией о возврате:

```json
{
    "response": {
        "result_code": 0,
        "refund": {
            "refund_id": "899343443",
            "amount": "1.00",
            "status": "success",
            "error": 0
        }
    }
}
```

### Статус возврата

Метод `getRefundStatus` запрашивает статус возврата, в параметрах нужно указать идентификатор счета `bill_id`, идентификатор возврата `refund_id` внутри вашей системы. Подробнее в [документации](https://developer.qiwi.com/ru/pull-payments/index.html?http#refund_status). 

```javascript
const bill_id = '893794793973';
const refund_id = '899343443';

qiwiApi.getRefundStatus(bill_id, refund_id).then( data => {
    //do with data
});
```

В результате будет получен ответ со статусом о возврате:

```json
{
    "response": {
        "result_code": 0,
        "refund": {
            "refund_id": "899343443",
            "amount": "1.00",
            "status": "success",
            "error": 0
        }
    }
}
```

### Вспомогательные методы

* Для генерирования `bill_id`, `refund_id` можно использовать метод `generateId`. Метод возвращает строку в формате UUID v4:

    ```javascript
    const bill_id = qiwiApi.generateId();
    //e9b47ee9-b2f9-4b45-9438-52370670e2a6
    ```

## Тестирование

```bash
$ cd pull-rest-api-node-js-sdk
npm install
npm run test
```

## Требования

* **Node.js v7.0.0**, запуск c флагом `--harmony`
* **Node.js v7.6.0** или выше 

или 

* **Babel** с плагином `babel-preset-es2017`

## Лицензия

[MIT](LICENSE)
