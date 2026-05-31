const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'node_modules/iyzipay/lib/Iyzipay.js');
let code = fs.readFileSync(file, 'utf8');

const target = `    fs.readdirSync(modelsPath).forEach(function (fileName) {
        if (~fileName.indexOf('.js')) {
            var resource = require(modelsPath + '/' + fileName);
            var resourceName = fileName.split('.js')[0];
            _self[resourceName[0].toLowerCase() + resourceName.substring(1)] = new resource(_self._config);
        }
    });`;

const replacement = `    var resources = [
        'ApiTest', 'Approval', 'Apm', 'BasicBkm', 'BasicBkmInitialize', 'BasicPayment', 
        'BasicPaymentPostAuth', 'BasicPaymentPreAuth', 'BasicThreedsInitialize', 
        'BasicThreedsInitializePreAuth', 'BasicThreedsPayment', 'BinNumber', 'Bkm', 
        'BkmInitialize', 'Cancel', 'CardList', 'CardManagementPageCard', 
        'CardManagementPageInitialize', 'CheckoutForm', 'CheckoutFormInitialize', 
        'CrossBookingFromSubMerchant', 'CrossBookingToSubMerchant', 'Disapproval', 
        'InstallmentInfo', 'IyziupForm', 'IyziupFormInitialize', 'Payment', 'PaymentItem', 
        'PaymentPostAuth', 'PaymentPreAuth', 'PeccoInitialize', 'PeccoPayment', 'Refund', 
        'RefundToBalance', 'SettlementToBalance', 'SubMerchant', 'Subscription', 
        'SubscriptionCardUpdate', 'SubscriptionCardUpdateWithSubscriptionReference', 
        'SubscriptionCheckoutForm', 'SubscriptionCheckoutFormInitialize', 'SubscriptionCustomer', 
        'SubscriptionPayment', 'SubscriptionPricingPlan', 'SubscriptionProduct', 'ThreedsInitialize', 
        'ThreedsInitializePreAuth', 'ThreedsPayment'
    ];
    resources.forEach(function(resourceName) {
        var resource = require('./resources/' + resourceName + '.js');
        _self[resourceName[0].toLowerCase() + resourceName.substring(1)] = new resource(_self._config);
    });`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log("Patched successfully!");
} else {
    console.log("Could not find target string.");
}
