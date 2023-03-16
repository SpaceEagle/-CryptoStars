import {isEscapeKey, deleteStar, resetStar, getLimits, getMaxLimit, checkPassword} from './util.js';
import {sendData} from './api.js';
import {showSubmitSuccessMessage, showSubmitErrorMessage, resetMessageBlock} from './messages.js';

const modalBuy = document.querySelector('.modal--buy');
const modalBuyForm = modalBuy.querySelector('.modal-buy');
const closeBtn = modalBuy.querySelector('.close-btn--buy');
const contractorIdHidden = modalBuy.querySelector('#seller-id');
const exchangeRateHidden = modalBuy.querySelector('#exchange-rate--seller');
const starContainer = modalBuy.querySelector('.star');
const nameInfo = modalBuy.querySelector('.contractor-name');
const exchangeRateInfo = modalBuy.querySelector('.seller-exchage-rate');
const paymentField = modalBuy.querySelector('#payment-field--buy');
const purchaseField = modalBuy.querySelector('#purchase-field--buy');
const paymentBtn = modalBuy.querySelector('#btn-payment--buy');
const paymentSysemsField = modalBuy.querySelector('.payment-systems');
const cardNumberField = modalBuy.querySelector('#card-number--seller');
const cryptoNumberField = modalBuy.querySelector('#crypto-number--seller');
const passwordField = modalBuy.querySelector('#password--buy');
const body = document.querySelector('body');
const submitBtn = modalBuy.querySelector('.modal__submit');
const mapContainer = document.querySelector('#contractor-map');

const resetModalBuy = () => {
  modalBuyForm.reset();
  resetStar(starContainer);
  resetMessageBlock(modalBuy);
};

const onModalEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeModalBuy();
  }
};

const onWindowModalClose = (evt) => {
  const modalBuyContent = modalBuy.querySelector('.modal__content');
  if (evt.target.closest('.modal__content') !== modalBuyContent) {
    closeModalBuy();
  }
};

function closeModalBuy () {
  modalBuy.style.display = 'none';
  body.classList.remove('scroll-lock');
  document.removeEventListener('keydown', onModalEscKeydown);
  modalBuy.removeEventListener('click', onWindowModalClose);
  resetModalBuy();
  mapContainer.style.display = 'block';
}

closeBtn.addEventListener('click', closeModalBuy);

const checkPaymentMin = (currentSeller) => Number(paymentField.value) >= currentSeller.minAmount;
const checkPaymentMax = (currentSeller) => Number(paymentField.value) <= getMaxLimit(currentSeller);
const checkPurchaseMin = (currentSeller) => Number(purchaseField.value) >= currentSeller.minAmount / currentSeller.exchangeRate;
const checkPurchaseMax = (currentSeller) => Number(purchaseField.value) <= getMaxLimit(currentSeller) / currentSeller.exchangeRate;

const pristineBuyForm = {
  pristine: [],
};

const runValidate = (currentSeller) => {
  pristineBuyForm.pristine = new Pristine (modalBuyForm, {
    classTo:'custom-input',
    errorClass: 'custom-input__error',
    errorTextParent: 'custom-input',
    errorTextTag: 'div',
  });
  pristineBuyForm.pristine.addValidator(paymentField, () => checkPaymentMin(currentSeller), `Минимальная сумма — ${currentSeller.minAmount} ₽`);
  pristineBuyForm.pristine.addValidator(purchaseField, () => checkPurchaseMin(currentSeller), `Минимальная сумма — ${(currentSeller.minAmount / currentSeller.exchangeRate).toFixed(2)} KEKS`);
  pristineBuyForm.pristine.addValidator(paymentField, () => checkPaymentMax(currentSeller), `Максимальная сумма — ${getMaxLimit(currentSeller)} ₽`);
  pristineBuyForm.pristine.addValidator(purchaseField, () => checkPurchaseMax(currentSeller), `Максимальная сумма — ${(getMaxLimit(currentSeller) / currentSeller.exchangeRate).toFixed(2)} KEKS`);
  pristineBuyForm.pristine.addValidator(passwordField, () => checkPassword(passwordField), 'Неверный пароль');
  pristineBuyForm.pristine.reset();
};

const customizeInputFields = (user, currentSeller) => {
  // Скрытые поля
  contractorIdHidden.value = currentSeller.id;
  exchangeRateHidden.value = currentSeller.exchageRate;

  //Описании информации продавца
  deleteStar(currentSeller, starContainer);
  nameInfo.textContent = currentSeller.userName;
  exchangeRateInfo.textContent = currentSeller.exchangeRate;
  getLimits(currentSeller, modalBuy, '.users-list__table-cashlimit');

  // Описываем работу полей оплаты и зачисления
  paymentField.addEventListener('change', () => {
    purchaseField.value = (paymentField.value / currentSeller.exchangeRate).toFixed(2);
    pristineBuyForm.pristine.validate();
  });
  purchaseField.addEventListener('change', () => {
    paymentField.value = (purchaseField.value * currentSeller.exchangeRate).toFixed(2);
    pristineBuyForm.pristine.validate();
  });
  paymentBtn.addEventListener('click', () => {
    paymentField.value = user.balances[0].amount;
    purchaseField.value = (paymentField.value / currentSeller.exchangeRate).toFixed(2);
    pristineBuyForm.pristine.validate();
  });

  // Описываем поле "Выбор платёжной системы"
  paymentSysemsField.innerHTML = '';
  const supportingPaymentMethods = document.createElement('option');
  supportingPaymentMethods.textContent = 'Выберите платёжную систему';
  supportingPaymentMethods.selected = 'selected';
  supportingPaymentMethods.disabled = 'true';
  paymentSysemsField.append(supportingPaymentMethods);
  currentSeller.paymentMethods.forEach((method) => {
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

  //Описывает поле "Номер криптокошелька пользователя"
  cryptoNumberField.value = user.wallet.address;
};

function openModalBuy (currentSeller, user) {
  modalBuy.style.display = 'block';
  body.classList.add('scroll-lock');
  document.addEventListener('keydown', onModalEscKeydown);
  modalBuy.addEventListener('click', onWindowModalClose);
  customizeInputFields(user, currentSeller);
  runValidate(currentSeller);
  mapContainer.style.display = 'none';
}

const blockSubmitButton = () => {
  submitBtn.disabled = true;
  submitBtn.textContent = 'Покупаю...';
};
const unblockSubmitButton = () => {
  submitBtn.disabled = false;
  submitBtn.textContent = 'Обменять';
};

const setBuyFormSubmit = () => {
  modalBuyForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValid = pristineBuyForm.pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(() => {
        unblockSubmitButton();
        showSubmitSuccessMessage(modalBuy);
      },
      () => {
        unblockSubmitButton();
        showSubmitErrorMessage(modalBuy);
      },
      new FormData(modalBuyForm),
      );
    }
  });
};

export {openModalBuy, setBuyFormSubmit, resetModalBuy};
