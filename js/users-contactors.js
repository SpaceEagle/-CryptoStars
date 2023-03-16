import {openModalBuy} from './modal-buy.js';
import {openModalSell} from './modal-sell.js';
import {deleteStar, getLimits} from './util.js';

const profileCryptoBalance = document.querySelector('#user-crypto-balance');
const profileRubBalance = document.querySelector('#user-fiat-balance');
const profileName = document.querySelector('#user-profile-name');
const contractorTemplate = document.querySelector('#user-table-row__template').content.querySelector('.users-list__table-row');
const contractorContainer = document.querySelector('.users-list__table-body');
const baloonTemplate = document.querySelector('#map-baloon__template').content.querySelector('.user-card');
//const baloonContainer = baloonTemplate.querySelector('.user-card');

const getUserData = (user) => {
  profileCryptoBalance.textContent = `${user.balances[1].amount}`;
  profileRubBalance.textContent = `${user.balances[0].amount}`;
  profileName.textContent = `${user.userName}`;
};

const getPaymentProvider = (methods, element) => {
  const providerContainer = element.querySelector('.payment-methods-list');
  providerContainer.textContent = '';
  if (methods) {
    methods.forEach((method) => {
      const list = document.createElement('li');
      if (element === 'contractorElement') {
        list.classList.add('users-list__badges-item', 'badge');
      } else {
        list.classList.add('user-card__badges-item', 'badge');
      }
      list.textContent = method.provider;
      providerContainer.appendChild(list);
    });
  }
};

const getContactors = (contractors, user) => {
  contractors.forEach((element) => {
    const contractorElement = contractorTemplate.cloneNode(true);
    const tableBtn = contractorElement.querySelector('button');
    contractorElement.querySelector('.contractor-name').textContent = element.userName;
    contractorElement.querySelector('.contractor-currency').textContent = element.balance.currency;
    contractorElement.querySelector('.contractor-echange-rate').textContent = `${element.exchangeRate} ₽`;
    getLimits(element, contractorElement);
    getPaymentProvider(element.paymentMethods, contractorElement);
    deleteStar(element, contractorElement);
    if (element.status === 'seller') {
      tableBtn.addEventListener('click', () => openModalBuy(element, user));
    } else {
      tableBtn.addEventListener('click', () => openModalSell(element, user));
    }
    //element.status === 'seller' ? tableBtn.addEventListener('click', () => openModalBuy(element, user)) : tableBtn.addEventListener('click', () => openModalSell(element, user));
    //tableBtn.addEventListener('click', element.status === 'seller' ? modalSell.style.display = 'block' : modalBuy.style.display = 'block');
    contractorContainer.appendChild(contractorElement);
  });
};

const getMapBaloon = (contractor, user) => {
  const baloonElement = baloonTemplate.cloneNode(true);
  const tableBtn = baloonElement.querySelector('button');
  deleteStar(contractor, baloonElement);
  baloonElement.querySelector('.contactor-name').textContent = contractor.userName;
  baloonElement.querySelector('.user-card__cash-data').textContent = contractor.balance.currency;
  baloonElement.querySelector('.contractor-echange-rate').textContent = `${contractor.exchangeRate} ₽`;
  getLimits(contractor, baloonElement);
  getPaymentProvider(contractor.paymentMethods, baloonElement);
  tableBtn.addEventListener('click', () => openModalBuy(contractor, user));
  return baloonElement;
  //baloonContainer.appendChild(baloonElement);
};

export {getUserData, getContactors, getMapBaloon};
