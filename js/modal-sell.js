import {isEscapeKey, deleteStar, resetStar, getLimits, getMaxLimit, checkPassword} from './util.js';
import {sendData} from './api.js';
import {showSubmitSuccessMessage, showSubmitErrorMessage, resetMessageBlock} from './messages.js';

const modalSell = document.querySelector('.modal--sell');
const modalSellForm = modalSell.querySelector('.modal-sell');
const closeBtn = modalSell.querySelector('.close-btn--sell');
const contractorIdHidden = modalSell.querySelector('#buyer-id');
const exchangeRateHidden = modalSell.querySelector('#exchange-rate--buyer');
const starContainer = modalSell.querySelector('.star');
const nameInfo = modalSell.querySelector('.contractor-name');
const exchangeRateInfo = modalSell.querySelector('.buyer-exchage-rate');
const paymentField = modalSell.querySelector('#payment-field--sell');
const purchaseField = modalSell.querySelector('#purchase-field--sell');
const paymentBtn = modalSell.querySelector('#btn-payment--sell');
const purchaseBtn = modalSell.querySelector('#btn-purchase--sell');
const cryptoNumberField = modalSell.querySelector('#crypto-number--buyer');
const paymentSysemsField = modalSell.querySelector('.payment-systems');
const cardNumberField = modalSell.querySelector('#card-number--buyer');
const passwordField = modalSell.querySelector('#password--sell');
const body = document.querySelector('body');
const submitBtn = modalSell.querySelector('.modal__submit');

const resetModalSell = () => {
  modalSellForm.reset();
  resetStar(starContainer);
  resetMessageBlock(modalSell);
};

const onModalEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeModalSell();
  }
};

const onWindowModalClose = (evt) => {
  const modalBuyContent = modalSell.querySelector('.modal__content');
  if (evt.target.closest('.modal__content') !== modalBuyContent) {
    closeModalSell();
  }
};

function closeModalSell () {
  modalSell.style.display = 'none';
  body.classList.remove('scroll-lock');
  document.removeEventListener('keydown', onModalEscKeydown);
  modalSell.removeEventListener('click', onWindowModalClose);
  resetModalSell();
}

closeBtn.addEventListener('click', closeModalSell);

const checkPurchaseMin = (currentBuyer) => Number(purchaseField.value) >= currentBuyer.minAmount;
const checkPurchaseMax = (currentBuyer) => Number(purchaseField.value) <= getMaxLimit(currentBuyer);
const checkPaymentMin = (currentBuyer) => Number(paymentField.value) >= currentBuyer.minAmount / currentBuyer.exchangeRate;
const checkPaymentMax = (currentBuyer) => Number(paymentField.value) <= getMaxLimit(currentBuyer) / currentBuyer.exchangeRate;
const checkUserKEKS = (user) => Number(paymentField.value) <= user.balances[1].amount;

const pristineSellForm = {
  pristine: [],
};

const runValidate = (currentBuyer, user) => {
  pristineSellForm.pristine = new Pristine (modalSellForm, {
    classTo:'custom-input',
    errorClass: 'custom-input__error',
    errorTextParent: 'custom-input',
    errorTextTag: 'div',
  });
  pristineSellForm.pristine.addValidator(paymentField, () => checkPaymentMin(currentBuyer), `Минимальная сумма — ${(currentBuyer.minAmount / currentBuyer.exchangeRate).toFixed(2)} KEKS`);
  pristineSellForm.pristine.addValidator(paymentField, () => checkUserKEKS(user), 'У вас недостаточно KEKS');
  pristineSellForm.pristine.addValidator(purchaseField, () => checkPurchaseMin(currentBuyer), `Минимальная сумма — ${currentBuyer.minAmount} ₽`);
  pristineSellForm.pristine.addValidator(paymentField, () => checkPaymentMax(currentBuyer), `Максимальная сумма — ${(getMaxLimit(currentBuyer) / currentBuyer.exchangeRate).toFixed(2)} KEKS`);
  pristineSellForm.pristine.addValidator(purchaseField, () => checkPurchaseMax(currentBuyer), `Максимальная сумма — ${getMaxLimit(currentBuyer)} ₽`);
  pristineSellForm.pristine.addValidator(passwordField, () => checkPassword(passwordField), 'Неверный пароль');
  pristineSellForm.pristine.reset();
};

const customizeInputFields = (user, currentBuyer) => {
  // Скрытые поля
  contractorIdHidden.value = currentBuyer.id;
  exchangeRateHidden.value = currentBuyer.exchageRate;

  //Описании информации покупателя
  deleteStar(currentBuyer, starContainer);
  nameInfo.textContent = currentBuyer.userName;
  exchangeRateInfo.textContent = currentBuyer.exchangeRate;
  getLimits(currentBuyer, modalSell);

  // Описываем работу полей оплаты и зачисления
  paymentField.addEventListener('change', () => {
    purchaseField.value = (paymentField.value * currentBuyer.exchangeRate).toFixed(2);
    pristineSellForm.pristine.validate();
  });
  purchaseField.addEventListener('change', () => {
    paymentField.value = (purchaseField.value / currentBuyer.exchangeRate).toFixed(2);
    pristineSellForm.pristine.validate();
  });

  paymentBtn.addEventListener('click', () => {
    paymentField.value = user.balances[1].amount;
    purchaseField.value = (paymentField.value * currentBuyer.exchangeRate).toFixed(2);
    pristineSellForm.pristine.validate();
  });
  purchaseBtn.addEventListener('click', () => {
    purchaseField.value = currentBuyer.balance.amount;
    paymentField.value = (purchaseField.value / currentBuyer.exchangeRate).toFixed(2);
    pristineSellForm.pristine.validate();
  });

  //Описывает поле "Номер криптокошелька пользователя"
  cryptoNumberField.value = currentBuyer.wallet.address;

  // Описываем поле "Выбор платёжной системы"
  paymentSysemsField.innerHTML = '';
  const supportingPaymentMethods = document.createElement('option');
  supportingPaymentMethods.textContent = 'Выберите платёжную систему';
  supportingPaymentMethods.selected = 'selected';
  supportingPaymentMethods.disabled = 'true';
  paymentSysemsField.append(supportingPaymentMethods);
  user.paymentMethods.forEach((method) => {
    const paymentMethodOption = document.createElement('option');
    paymentMethodOption.textContent = method.provider;
    paymentSysemsField.append(paymentMethodOption);
  });

  //Описывает поле "Номер банковской карты"
  paymentSysemsField.addEventListener('change', () => {
    if (paymentSysemsField.value === 'Cash in person') {
      cardNumberField.placeholder = '';
      cardNumberField.value = '';
    } else {
      const cardNumberContainer = user.paymentMethods.find((method) => method.provider === paymentSysemsField.value);
      cardNumberField.value = cardNumberContainer.accountNumber;
    }
  });
};

const openModalSell = (currentBuyer, user) => {
  modalSell.style.display = 'block';
  body.classList.add('scroll-lock');
  document.addEventListener('keydown', onModalEscKeydown);
  modalSell.addEventListener('click', onWindowModalClose);
  customizeInputFields(user, currentBuyer);
  runValidate(currentBuyer, user);
};

modalSellForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristineSellForm.pristine.validate();
});

const blockSubmitButton = () => {
  submitBtn.disabled = true;
  submitBtn.textContent = 'Покупаю...';
};
const unblockSubmitButton = () => {
  submitBtn.disabled = false;
  submitBtn.textContent = 'Обменять';
};

const setSellFormSubmit = () => {
  modalSellForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValid = pristineSellForm.pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(() => {
        unblockSubmitButton();
        showSubmitSuccessMessage(modalSell);
      },
      () => {
        unblockSubmitButton();
        showSubmitErrorMessage(modalSell);
      },
      new FormData(modalSellForm),
      );
    }
  });
};
export {openModalSell, setSellFormSubmit, resetModalSell};
