import {getContactors} from './users-contactors.js';
import {getDataUser, getDataContractors} from './api.js';
import {initMap, resetMarkers} from './map.js';

const CONTRACTOR_STATUS = 'seller';
const filterContainer = document.querySelector('.users-nav');
const btnBuy = filterContainer.querySelector('.btn-buy');
const btnSell = filterContainer.querySelector('.btn-sell');
const contractorTable = document.querySelector('.users-list__table-body');
const checkedUsers = document.querySelector('#checked-users');
const btnList = document.querySelector('.btn-list');
const btnMap = document.querySelector('.btn-map');
const mapContainer = document.querySelector('.container-map');
const contractorContainer = document.querySelector('.users-list');

let contractorsBuy = [];
let contractorsSell = [];

const getVerifiedUsers = (userArray) => {
  if (checkedUsers.checked) {
    const verifiedUsers = userArray.filter((contractor) => contractor.isVerified);
    return verifiedUsers;
  }
  return userArray;
};

const getByCash = (userArray) => {
  const byCashContractor = userArray.filter((contractor) => contractor.coords);
  return byCashContractor;
};

const getArray = (contractors) => {
  contractors.forEach((contractor) => {
    if (contractor.status === CONTRACTOR_STATUS) {
      contractorsBuy.push(contractor);
      return contractorsBuy;
    } else {
      contractorsSell.push(contractor);
      return contractorsSell;
    }
  });
};

const isActive = (btn) => btn.classList.contains('is-active');

const filter = (contractors) => {
  if (isActive(btnBuy)) {
    getArray(contractors);
    return contractorsBuy;
  }
  if (isActive(btnSell)) {
    getArray(contractors);
    return contractorsSell;
  }
};

const resetFilter = () => {
  contractorTable.innerHTML = '';
  contractorsBuy = [];
  contractorsSell = [];
  getDataUser((newUser) => {
    getDataContractors((newContractors) => {
      getContactors(getVerifiedUsers(filter(newContractors)), newUser);
      resetMarkers(getVerifiedUsers(getByCash(filter(newContractors))), newUser);
    });
  });
};

btnSell.addEventListener('click', () => {
  if (!isActive(btnSell)) {
    btnSell.classList.add('is-active');
    btnBuy.classList.remove('is-active');
    btnMap.disabled = true;
    resetFilter();
  }
});

btnBuy.addEventListener('click', () => {
  if (!isActive(btnBuy)) {
    btnBuy.classList.add('is-active');
    btnSell.classList.remove('is-active');
    btnMap.disabled = false;
    resetFilter();
  }
});

checkedUsers.addEventListener('change', () => {
  resetFilter();
});

btnList.addEventListener('click', () => {
  if(!isActive(btnList)){
    btnList.classList.add('is-active');
    btnMap.classList.remove('is-active');
    btnSell.disabled = false;
    mapContainer.style.display = 'none';
    contractorContainer.style.display = 'block';
  }
});

btnMap.addEventListener('click', () => {
  if(!isActive(btnMap)){
    btnMap.classList.add('is-active');
    btnList.classList.remove('is-active');
    btnSell.disabled = true;
    contractorContainer.style.display = 'none';
    mapContainer.style.display = 'block';
    getDataUser((newUser) => {
      getDataContractors((newContractors) => {
        initMap(getVerifiedUsers(getByCash(filter(newContractors))), newUser);
      });
    });
  }
});

export {filter, isActive};
