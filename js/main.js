import {getUserData, getContactors} from './users-contactors.js';
import {showAlert, hideUserProfile, hideContractors} from './util.js';
import {getDataUser, getDataContractors} from './api.js';
import {showContractorErrorMessage} from './messages.js';
import {filter} from './filtrs.js';
import {setBuyFormSubmit, resetModalBuy} from './modal-buy.js';
import {setSellFormSubmit, resetModalSell} from './modal-sell.js';

getDataUser((newUser) => {
  getUserData(newUser);
},
() => {
  showAlert('Не удалось загрузить Пользователя. Обновите страницу');
  hideUserProfile();
});

getDataUser((newUser) => {
  getDataContractors((newContractors) => {
    getContactors(filter(newContractors), newUser);
  },
  () => {
    showContractorErrorMessage();
    hideContractors();
  });
},
() => {
  showAlert('Не удалось загрузить Пользователя. Обновите страницу');
});

setBuyFormSubmit(resetModalBuy);
setSellFormSubmit(resetModalSell);
