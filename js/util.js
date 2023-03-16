const ALERT_SHOW_TIME = 5000;
const VERIFICATION_STATUS = 'false';
const userProfile = document.querySelector('.user-profile');
const contractorsBlock = document.querySelector('.contractors-block');

const getRandomInteger = (min, max) => {
  if (min < 0 || max < 0 || min >= max) {
    return -1;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandom = (min, max, afterComma) => {
  if (min < 0 || max < 0 || min >= max) {
    return -1;
  }
  return (Math.random() * (max - min + 1) + min).toFixed(afterComma);
};

const getRandomArrayElement = (elements) => elements[getRandom(0, elements.length - 1)];

const isEscapeKey = (evt) => evt.key === 'Escape';

const isVerifiedUser = (contractor) => (contractor.isVerified).toString() === VERIFICATION_STATUS;

const deleteStar = (verification, element) => {
  if (isVerifiedUser(verification)) {
    const star = element.querySelector('svg');
    star.style.display = 'none';
  }
};

const resetStar = (element) => {
  const star = element.querySelector('svg');
  star.style.display = 'block';
};

let maxLimit = 0;
const getMaxLimit = (data) => {
  if (data.status === 'seller') {
    maxLimit = (data.balance.amount * data.exchangeRate).toFixed(2);
    return maxLimit;
  } else {
    maxLimit = data.balance.amount;
    return maxLimit;
  }
};

const getLimits = (data, element) => {
  const limitsContainer = element.querySelector('.users-list__table-cashlimit');
  getMaxLimit(data);
  limitsContainer.textContent = `${data.minAmount} ₽ - ${maxLimit} ₽`;
};

const checkPassword = (field) => field.value === '180712';

const showAlert = (message) => {
  const alert = document.createElement('div');
  alert.style.position = 'absolute';
  alert.style.zIndex = '100';
  alert.style.left = '0';
  alert.style.top = '0';
  alert.style.right = '0';
  alert.style.padding = '10px 3px';
  alert.style.fontSize = '35px';
  alert.style.textAlign = 'center';
  alert.style.fontWeight = 'bold';

  alert.textContent = message;

  document.body.append(alert);

  setTimeout(()=>{
    alert.remove();
  }, ALERT_SHOW_TIME);
};

const hideUserProfile = () => {
  userProfile.style.display = 'none';
};

const hideContractors = () => {
  contractorsBlock.style.display = 'none';
};

export {getRandomInteger, getRandom, getRandomArrayElement, isEscapeKey, deleteStar, resetStar, getLimits, getMaxLimit,
  checkPassword, showAlert, hideUserProfile, hideContractors, isVerifiedUser};
